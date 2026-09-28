// 플레이 로그: 부모 화면의 오답 분석용. 기기 안(localStorage)에만 두고 밖으로 보내지 않는다.
// 단어 id·자모·시간만 적는다. 아이 이름·생년월일·목소리는 적지 않는다.
import type { CellRole } from './assembly';

export type WordResult = 'alone' | 'help' | 'stop';

export type LogEvent =
  /** 전투 시작 */
  | { k: 'battle'; t: number; stage: string }
  /** 단어 한 문제의 끝. alone = 도움 없이 완성, help = 흐린 자모·안내·정답 보기를 본 완성, stop = 끝내지 못함 */
  | { k: 'word'; t: number; w: string; stage: string; level: string; res: WordResult; ms: number | null; mis: number; rep: number; hint: number; trap: number; drop: number }
  /** 다른 글자가 된 칸: want 자리에 got을 넣음. trap = 넣은 자모가 이 단어에 없는 함정 자모 */
  | { k: 'miss'; t: number; w: string; syl: string; role: CellRole; want: string; got: string | null; trap: boolean }
  /**
   * 칸이 받지 않은 끌어 놓기: 차례인 칸(role, 정답 want)에 got을 놓으려 했거나, 차례가 아닌 칸(over)에 놓으려 함.
   * 자음·모음 순서를 엇갈리는 버릇을 보려고 남긴다.
   */
  | { k: 'drop'; t: number; w: string; syl: string; role: CellRole; want: string; got: string; over: CellRole | null; trap: boolean };

/** 오래된 기록부터 버린다 (localStorage 용량과 저장 시간 때문에) */
export const LOG_CAP = 1500;

export interface LogStore {
  load(): LogEvent[];
  save(events: LogEvent[]): void;
}

interface Pending {
  w: string;
  stage: string;
  level: string;
  mis: number;
  rep: number;
  hint: number;
  trap: number;
  drop: number;
}

export class PlayLog {
  events: LogEvent[];
  private pending: Pending | null = null;

  constructor(
    private store: LogStore,
    private now: () => number = Date.now,
  ) {
    this.events = store.load();
  }

  private push(e: LogEvent): void {
    this.events.push(e);
    if (this.events.length > LOG_CAP) this.events.splice(0, this.events.length - LOG_CAP);
    this.store.save(this.events);
  }

  battle(stage: string): void {
    this.abandon();
    this.push({ k: 'battle', t: this.now(), stage });
  }

  /** 새 문제 시작. 앞 문제를 끝내지 못했으면 stop으로 남긴다. */
  begin(w: string, stage: string, level: string): void {
    this.abandon();
    this.pending = { w, stage, level, mis: 0, rep: 0, hint: 0, trap: 0, drop: 0 };
  }

  miss(syl: string, role: CellRole, want: string, got: string | null, trap: boolean): void {
    const p = this.pending;
    if (!p) return;
    p.mis++;
    if (trap) p.trap++;
    this.push({ k: 'miss', t: this.now(), w: p.w, syl, role, want, got, trap });
  }

  drop(syl: string, role: CellRole, want: string, got: string, over: CellRole | null, trap: boolean): void {
    const p = this.pending;
    if (!p) return;
    p.drop++;
    this.push({ k: 'drop', t: this.now(), w: p.w, syl, role, want, got, over, trap });
  }

  replay(): void {
    if (this.pending) this.pending.rep++;
  }

  hint(): void {
    if (this.pending) this.pending.hint++;
  }

  finish(assisted: boolean, ms: number): void {
    this.close(assisted ? 'help' : 'alone', Math.round(ms));
  }

  /** 전투를 그만두거나 진 경우 등: 끝내지 못한 문제를 기록한다 */
  abandon(): void {
    this.close('stop', null);
  }

  private close(res: WordResult, ms: number | null): void {
    const p = this.pending;
    if (!p) return;
    this.pending = null;
    this.push({ k: 'word', t: this.now(), w: p.w, stage: p.stage, level: p.level, res, ms, mis: p.mis, rep: p.rep, hint: p.hint, trap: p.trap, drop: p.drop });
  }

  clear(): void {
    this.pending = null;
    this.events = [];
    this.store.save(this.events);
  }
}

const ROLES: readonly string[] = ['cho', 'jung', 'jong'];
const str = (v: unknown): v is string => typeof v === 'string';
const n = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0);

/** 저장된 로그를 읽을 때 형식이 맞지 않는 항목은 버린다. 예외를 던지지 않는다. */
export function sanitizeLog(raw: unknown): LogEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: LogEvent[] = [];
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue;
    const e = r as Record<string, unknown>;
    const t = n(e.t);
    if (e.k === 'battle' && str(e.stage)) out.push({ k: 'battle', t, stage: e.stage });
    else if (e.k === 'word' && str(e.w) && (e.res === 'alone' || e.res === 'help' || e.res === 'stop'))
      out.push({ k: 'word', t, w: e.w, stage: str(e.stage) ? e.stage : '', level: str(e.level) ? e.level : '', res: e.res, ms: typeof e.ms === 'number' ? e.ms : null, mis: n(e.mis), rep: n(e.rep), hint: n(e.hint), trap: n(e.trap), drop: n(e.drop) });
    else if (e.k === 'miss' && str(e.w) && str(e.want) && str(e.role) && ROLES.includes(e.role))
      out.push({ k: 'miss', t, w: e.w, syl: str(e.syl) ? e.syl : '', role: e.role as CellRole, want: e.want, got: str(e.got) ? e.got : null, trap: e.trap === true });
    else if (e.k === 'drop' && str(e.w) && str(e.want) && str(e.got) && str(e.role) && ROLES.includes(e.role))
      out.push({ k: 'drop', t, w: e.w, syl: str(e.syl) ? e.syl : '', role: e.role as CellRole, want: e.want, got: e.got, over: str(e.over) && ROLES.includes(e.over) ? (e.over as CellRole) : null, trap: e.trap === true });
  }
  return out.slice(-LOG_CAP);
}
