// 따라 쓰기 필살기의 규칙 (화면과 분리된 순수 로직).
// 음절 네모(0~100) 안에 초성·중성·종성 자리를 잡아 자모 획을 놓고, 아이가 그린 선이 지금 획을 따라갔는지 판정한다.
// 아이는 한글을 거의 모르는 만 5세라서 판정은 넉넉하게: 조금 삐뚤어도, 한 획을 두세 번에 나눠 그려도 인정한다.
// 수치는 플레이테스트용 임시값이다.
import { jamoStrokes, type Pt } from '../content/strokes';
import { decomposeSyllable, splitWord, vowelShape } from '../hangul/hangul';
import type { CellRole } from './assembly';

export type { Pt };

export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface PlacedStroke {
  jamo: string;
  role: CellRole;
  /** 음절 네모(0~100) 좌표 */
  pts: Pt[];
  closed: boolean;
}

export const TRACE_CONFIG = {
  /** 획에서 이만큼(음절 네모 100 기준) 안이면 따라간 것으로 본다 */
  tol: 16,
  /** 그린 점이 획에서 벗어나도 되는 거리 = tol × 이 값 */
  offScale: 1.5,
  /** 획을 이만큼 덮으면 완성 */
  coverage: 0.72,
  /** 그린 점 중 이만큼은 획 가까이에 있어야 한다 */
  precision: 0.65,
  /** 이보다 짧게 그은 것은 톡 친 것으로 보고 무시한다 */
  minDraw: 4,
  /** 같은 획을 이만큼 틀리면 획을 대신 그려 주고 넘어간다 (진행을 막지 않는다) */
  maxFails: 3,
  sampleStep: 3,
};

/** 음절 안 자리: 모음 모양(세로/가로)과 받침 유무에 따라 실제 한글 배치와 비슷하게 */
const LAYOUT: Record<'vertical' | 'horizontal', { plain: Record<'cho' | 'jung', Box>; jong: Record<CellRole, Box> }> = {
  vertical: {
    plain: { cho: { x0: 8, y0: 16, x1: 52, y1: 84 }, jung: { x0: 56, y0: 6, x1: 94, y1: 94 } },
    jong: { cho: { x0: 8, y0: 6, x1: 50, y1: 50 }, jung: { x0: 54, y0: 2, x1: 92, y1: 58 }, jong: { x0: 20, y0: 64, x1: 82, y1: 96 } },
  },
  horizontal: {
    plain: { cho: { x0: 22, y0: 6, x1: 78, y1: 50 }, jung: { x0: 6, y0: 52, x1: 94, y1: 90 } },
    jong: { cho: { x0: 24, y0: 2, x1: 76, y1: 34 }, jung: { x0: 6, y0: 34, x1: 94, y1: 60 }, jong: { x0: 22, y0: 64, x1: 78, y1: 96 } },
  },
};

function place(pts: Pt[], b: Box): Pt[] {
  return pts.map(([x, y]) => [b.x0 + (x / 100) * (b.x1 - b.x0), b.y0 + (y / 100) * (b.y1 - b.y0)]);
}

/** 한 음절의 획을 쓰는 순서대로 (초성 → 중성 → 종성). 쓸 수 없는 음절(겹모음 등)은 null. */
export function syllableStrokes(syllable: string): PlacedStroke[] | null {
  const j = decomposeSyllable(syllable);
  if (!j) return null;
  const shape = vowelShape(j.jung);
  if (shape === 'mixed') return null;
  const boxes = j.jong ? LAYOUT[shape].jong : LAYOUT[shape].plain;
  const out: PlacedStroke[] = [];
  for (const role of (j.jong ? ['cho', 'jung', 'jong'] : ['cho', 'jung']) as CellRole[]) {
    const jamo = j[role];
    const strokes = jamoStrokes(jamo);
    if (!strokes) return null;
    for (const st of strokes) out.push({ jamo, role, pts: place(st.pts, (boxes as Record<CellRole, Box>)[role]), closed: !!st.closed });
  }
  return out;
}

/** 단어 전체 획 수. 쓸 수 없는 단어는 null. */
export function wordStrokeCount(word: string): number | null {
  const syl = splitWord(word);
  if (!syl) return null;
  let n = 0;
  for (const s of syl) {
    const st = syllableStrokes(s);
    if (!st) return null;
    n += st.length;
  }
  return n;
}

/** 필살기로 쓸 단어 고르기: 획이 너무 많지 않은 단어 중에서 (방금 낸 단어는 피한다) */
export function pickWriteWord(pool: string[], last: string, maxStrokes: number, rng: () => number): string | null {
  const counted = pool.map((w) => ({ w, n: wordStrokeCount(w) })).filter((x): x is { w: string; n: number } => x.n !== null);
  if (!counted.length) return null;
  let ok = counted.filter((x) => x.n <= maxStrokes && x.w !== last);
  if (!ok.length) {
    const min = Math.min(...counted.map((x) => x.n));
    ok = counted.filter((x) => x.n === min);
  }
  return ok[Math.floor(rng() * ok.length)].w;
}

// ───────────── 판정 ─────────────

function dist(a: Pt, b: Pt): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function segDist(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  const t = len2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2)) : 0;
  return dist(p, [a[0] + t * dx, a[1] + t * dy]);
}

/** 점에서 꺾은선까지 거리 */
export function polyDist(p: Pt, line: Pt[]): number {
  if (line.length === 1) return dist(p, line[0]);
  let m = Infinity;
  for (let i = 1; i < line.length; i++) m = Math.min(m, segDist(p, line[i - 1], line[i]));
  return m;
}

export function polyLength(line: Pt[]): number {
  let n = 0;
  for (let i = 1; i < line.length; i++) n += dist(line[i - 1], line[i]);
  return n;
}

/** 꺾은선을 step 간격 점들로 */
export function resample(line: Pt[], step: number): Pt[] {
  const out: Pt[] = [line[0]];
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1];
    const b = line[i];
    const d = dist(a, b);
    for (let k = step; k < d; k += step) out.push([a[0] + ((b[0] - a[0]) * k) / d, a[1] + ((b[1] - a[1]) * k) / d]);
    out.push(b);
  }
  return out;
}

export type TraceVerdict =
  /** 획 완성 */
  | { kind: 'done' }
  /** 맞게 따라가는 중이지만 아직 덜 그렸다 (그린 선을 남겨 두고 이어 그리게 한다) */
  | { kind: 'partial'; coverage: number }
  /** 너무 짧다 (톡 친 것): 실수로 세지 않는다 */
  | { kind: 'tap' }
  /** 다른 곳을 그렸거나 거꾸로 그렸다 */
  | { kind: 'miss'; reason: 'off' | 'direction' };

/**
 * 지금 획 판정. segments = 이 획을 위해 지금까지 그은 선들 (마지막 것이 방금 그은 선).
 * 방향은 첫 선이 획의 끝 쪽에서 분명히 시작했을 때만 틀렸다고 본다.
 */
export function judgeStroke(stroke: PlacedStroke, segments: Pt[][], cfg = TRACE_CONFIG): TraceVerdict {
  const last = segments[segments.length - 1];
  if (!last || last.length < 2 || polyLength(last) < cfg.minDraw) return { kind: 'tap' };
  const off = cfg.tol * cfg.offScale;
  const near = last.filter((p) => polyDist(p, stroke.pts) <= off).length / last.length;
  if (near < cfg.precision) return { kind: 'miss', reason: 'off' };
  if (!stroke.closed && segments.length === 1) {
    const start = stroke.pts[0];
    const end = stroke.pts[stroke.pts.length - 1];
    if (dist(last[0], end) + cfg.tol * 0.5 < dist(last[0], start)) return { kind: 'miss', reason: 'direction' };
  }
  const samples = resample(stroke.pts, cfg.sampleStep);
  const covered = samples.filter((q) => segments.some((seg) => polyDist(q, seg) <= cfg.tol)).length / samples.length;
  return covered >= cfg.coverage ? { kind: 'done' } : { kind: 'partial', coverage: covered };
}
