// 동물 그림 묶음 1b (올챙이·꿀벌 … 해마: 곤충·새·물속 동물·아기 동물). 그림 규칙은 docs/picture-style.md.
import { INK, HL, dot, blob, cheeks, tube, sparkle } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  r1(cx + r * Math.cos((deg * Math.PI) / 180)),
  r1(cy + r * Math.sin((deg * Math.PI) / 180)),
];

/** 흰자 + 눈동자 */
const eye = (x: number, y: number, r = 5.5, p = 3) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` + dot(x, y + 0.5, p);

// 네 다리 (옆모습 동물)
const legs = (xs: number[], y: number, w: number, h: number, fill: string, hoof = '') =>
  xs
    .map(
      (x) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}"/>` +
        (hoof ? `<rect x="${x}" y="${y + h - 6}" width="${w}" height="6" rx="2" fill="${hoof}"/>` : ''),
    )
    .join('');

/** 뾰족한 육각형 (벌집 칸) */
const hex = (x: number, y: number, r: number, fill: string) =>
  `<path d="M${Array.from({ length: 6 }, (_, k) => pt(x, y, r, -90 + 60 * k).join(' ')).join('L')}Z" fill="${fill}"/>`;

/** 동그라미 둘레 가시 (복어) */
function puffSpikes(cx: number, cy: number, rin: number, rout: number, degs: number[], fill: string): string {
  return degs
    .map((a) => {
      const [ax, ay] = pt(cx, cy, rin, a - 8);
      const [bx, by] = pt(cx, cy, rout, a);
      const [c, d] = pt(cx, cy, rin, a + 8);
      return `<path d="M${ax} ${ay}L${bx} ${by}L${c} ${d}Z" fill="${fill}"/>`;
    })
    .join('');
}

/** 부채꼴 꼬리깃 (칠면조) */
function fan(cx: number, cy: number, n: number, dist: number, rx: number, ry: number, fill: string, tip: string): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = -168 + (156 * i) / (n - 1);
    const [x, y] = pt(cx, cy, dist, a);
    const [tx, ty] = pt(cx, cy, dist + ry - 6, a);
    s +=
      `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${r1(a + 90)} ${x} ${y})"/>` +
      `<circle cx="${tx}" cy="${ty}" r="${r1(rx * 0.55)}" fill="${tip}" stroke="none"/>`;
  }
  return s;
}

/** 공작 깃의 눈무늬 */
const peaEye = (x: number, y: number, s = 1) =>
  `<circle cx="${x}" cy="${y}" r="${r1(6.5 * s)}" fill="${HL}" stroke-width="2"/>` +
  `<circle cx="${x}" cy="${y}" r="${r1(4.2 * s)}" fill="#3b78e6" stroke="none"/>` +
  dot(x, y, r1(2 * s), '#1d3a6e');

export const PICS: Record<string, string> = {
  올챙이:
    `<circle cx="74" cy="22" r="4" fill="#bfe6f7"/><circle cx="84" cy="14" r="3" fill="#bfe6f7"/><circle cx="64" cy="14" r="2.5" fill="#bfe6f7" stroke-width="2"/>` +
    `<path d="M50 44C62 36 70 58 80 52C85 49 89 44 94 42C92 56 84 68 70 66C62 64 58 64 50 66Z" fill="#3a3f5c"/>` +
    `<ellipse cx="34" cy="56" rx="26" ry="22" fill="#3a3f5c"/>` +
    eye(26, 50, 6.5, 3.4) +
    eye(43, 48, 6.5, 3.4) +
    `<path d="M26 64q9 7 18 0" stroke="#fff" stroke-width="2.5"/>` +
    `<ellipse cx="22" cy="42" rx="5" ry="3" fill="#fff" stroke="none" opacity=".35" transform="rotate(-35 22 42)"/>`,

  꿀벌:
    hex(22, 83, 10, '#ffb020') +
    hex(39.3, 83, 10, '#ffb020') +
    hex(56.6, 83, 10, '#ffb020') +
    `<path d="M16 80h12M33 80h12M50 80h13" stroke="#e8862e" stroke-width="2.5"/>` +
    `<path d="M80 62c-5 9-8 13-8 17a8 8 0 0 0 16 0c0-4-3-8-8-17z" fill="#ff9f1a"/>` +
    `<ellipse cx="77" cy="80" rx="2" ry="3.5" fill="#fff" stroke="none" opacity=".55"/>` +
    `<g transform="translate(10 -4) scale(.78)">` +
    `<ellipse cx="48" cy="30" rx="9" ry="15" fill="#dff3ff" transform="rotate(-25 48 30)"/><ellipse cx="64" cy="30" rx="9" ry="15" fill="#dff3ff" transform="rotate(25 64 30)"/>` +
    `<path d="M78 56L91 60L78 64Z" fill="${INK}"/>` +
    `<ellipse cx="56" cy="60" rx="24" ry="18" fill="#ffd23f"/>` +
    `<path d="M50 42.6Q53.5 42 57 42V78Q53.5 78 50 77.4ZM64 43Q67.5 44.5 71 46V74Q67.5 75.5 64 77Z" fill="${INK}" stroke="none"/>` +
    `<ellipse cx="56" cy="60" rx="24" ry="18"/>` +
    `<path d="M26 44C24 36 20 32 15 31M34 43C36 35 39 31 44 29"/>` +
    dot(15, 31, 3) +
    dot(44, 29, 3) +
    `<circle cx="30" cy="57" r="15" fill="#ffd23f"/>` +
    dot(25, 54) +
    dot(36, 54) +
    `<path d="M26 62q4 4 9 0" stroke-width="2.5"/>` +
    cheeks(61, 10, 30) +
    `</g>`,

  매미:
    `<rect x="35" y="4" width="30" height="92" rx="3" fill="#9a5b2e"/>` +
    `<path d="M42 8v14M58 10v10M44 84v8M57 80v12" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="60" rx="10" ry="22" fill="#5a6b3a"/>` +
    `<path d="M47 36C32 42 22 66 32 88C39 92 46 86 49 74Z" fill="#dff3ff"/>` +
    `<path d="M53 36C68 42 78 66 68 88C61 92 54 86 51 74Z" fill="#dff3ff"/>` +
    `<path d="M43 44C36 58 34 72 37 84M57 44C64 58 66 72 63 84" stroke="#7ec8f0" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="40" rx="13" ry="8" fill="#5a6b3a"/>` +
    `<ellipse cx="50" cy="27" rx="15" ry="8" fill="#6f8248"/>` +
    eye(36, 26, 5.5, 2.8) +
    eye(64, 26, 5.5, 2.8) +
    `<path d="M46 30q4 3 8 0" stroke-width="2.5"/>`,

  반딧불이:
    `<circle cx="50" cy="50" r="45" fill="#2a3566"/>` +
    sparkle(22, 26, 4, '#fff') +
    sparkle(80, 74, 3.5, '#fff') +
    sparkle(84, 30, 3, '#fff') +
    `<circle cx="34" cy="66" r="22" fill="#fff1b8" stroke="none" opacity=".45"/>` +
    `<path d="M14 66H8M18 82l-4 4M34 88v4M16 50l-5-3M50 86l3 4" stroke="#ffe14d" stroke-width="3.5"/>` +
    `<ellipse cx="52" cy="52" rx="21" ry="11" transform="rotate(-35 52 52)" fill="#8a6a4a"/>` +
    `<ellipse cx="44" cy="34" rx="7" ry="16" fill="#dff3ff" transform="rotate(-55 44 34)"/>` +
    `<ellipse cx="56" cy="28" rx="7" ry="15" fill="#dff3ff" transform="rotate(-20 56 28)"/>` +
    `<circle cx="35" cy="65" r="12" fill="#ffe14d"/>` +
    `<path d="M70 30C72 22 76 18 82 17M64 29C62 21 64 16 68 12" stroke="#fff" stroke-width="2.5"/>` +
    `<circle cx="68" cy="39" r="10" fill="#ff9f1a"/>` +
    dot(66, 37, 2.3) +
    dot(73, 36, 2.3) +
    `<path d="M66 43q4 3 8-1" stroke-width="2.2"/>`,

  지렁이:
    tube('M22 84C18 60 32 46 42 56C50 64 60 70 68 56C74 44 80 38 86 42', '#ff9aa8', 14) +
    `<path d="M29 58l7 3M52 60l-2 7M62 60l7 3" stroke="#e85d9a" stroke-width="2.5"/>` +
    `<path d="M70 50l9 4" stroke="#e85d9a" stroke-width="6"/>` +
    `<path d="M6 80C20 74 34 78 50 76S80 74 94 80V90Q94 94 90 94H10Q6 94 6 90Z" fill="#9a5b2e"/>` +
    `<g fill="#6b3e26" stroke="none"><circle cx="20" cy="88" r="2.5"/><circle cx="60" cy="86" r="2.5"/><circle cx="80" cy="89" r="2.5"/></g>` +
    dot(83, 39, 2.3) +
    dot(89, 43, 2.3) +
    `<path d="M82 46q3 2 5 0" stroke-width="2"/>`,

  애벌레:
    `<path d="M6 72C18 42 60 30 94 44C82 78 40 92 6 72Z" fill="#3a9e47"/>` +
    `<path d="M10 70C40 64 66 56 90 46" stroke="#2a7a35" stroke-width="2.5"/>` +
    `<path d="M28 66v5M40 62v5M52 60v5M63 58v5" stroke-width="3"/>` +
    `<circle cx="24" cy="58" r="9" fill="#b8e86a"/><circle cx="36" cy="54" r="10" fill="#a8e05f"/><circle cx="49" cy="52" r="10" fill="#b8e86a"/><circle cx="61" cy="48" r="10" fill="#a8e05f"/>` +
    `<g fill="${HL}" stroke="none"><circle cx="36" cy="51" r="2.5"/><circle cx="49" cy="49" r="2.5"/><circle cx="61" cy="45" r="2.5"/></g>` +
    `<path d="M70 27L65 16M79 27L84 16"/>` +
    dot(65, 16, 3) +
    dot(84, 16, 3) +
    `<circle cx="74" cy="38" r="13" fill="#c6ec6a"/>` +
    dot(69, 36, 2.8) +
    dot(79, 36, 2.8) +
    `<path d="M70 43q4 4 8 0" stroke-width="2.5"/>`,

  치타:
    tube('M24 50C12 48 8 38 10 28', '#f2c14e', 5) +
    tube('M30 58L18 68L8 66', '#e6b040', 7) +
    tube('M60 60L68 74L78 78', '#e6b040', 7) +
    tube('M36 60L30 76L20 80', '#f2c14e', 7) +
    tube('M64 58L78 64L88 62', '#f2c14e', 7) +
    `<ellipse cx="46" cy="52" rx="27" ry="12" fill="#f2c14e"/>` +
    `<g fill="#3d3530" stroke="none"><circle cx="30" cy="50" r="2.4"/><circle cx="38" cy="46" r="2.4"/><circle cx="48" cy="45" r="2.4"/><circle cx="58" cy="47" r="2.4"/><circle cx="36" cy="56" r="2.4"/><circle cx="46" cy="55" r="2.4"/><circle cx="56" cy="55" r="2.4"/><circle cx="65" cy="51" r="2.4"/></g>` +
    `<circle cx="71" cy="30" r="4.5" fill="#f2c14e"/><circle cx="82" cy="28" r="4.5" fill="#f2c14e"/>` +
    `<circle cx="77" cy="40" r="12" fill="#f2c14e"/>` +
    `<ellipse cx="85" cy="45" rx="6.5" ry="5" fill="#fff4d6"/>` +
    dot(89, 42, 2.2) +
    dot(79, 37, 2.8) +
    `<path d="M79 40C80 44 81 47 82 50" stroke="#3d3530" stroke-width="2.5"/>` +
    `<path d="M4 38h7M4 48h5M6 84h8" stroke="#9aa6c4" stroke-width="2.5"/>`,

  북극곰:
    `<path d="M4 82C14 78 22 86 32 82S50 78 60 82S80 86 96 82V90Q96 94 92 94H8Q4 94 4 90Z" fill="#7ec8f0"/>` +
    `<path d="M10 78L18 66H84L92 78L86 88H16Z" fill="#dff3ff"/>` +
    `<path d="M18 66L24 74L38 70M84 66L78 76" stroke="#9fd8f2" stroke-width="2.5"/>` +
    legs([24, 35, 56, 67], 50, 10, 18, '#fff') +
    `<ellipse cx="46" cy="46" rx="29" ry="17" fill="#fff"/>` +
    `<circle cx="17" cy="42" r="4" fill="#fff"/>` +
    `<circle cx="72" cy="27" r="5" fill="#fff"/>` +
    `<ellipse cx="80" cy="38" rx="14" ry="11" fill="#fff"/>` +
    `<ellipse cx="89" cy="41" rx="6" ry="5" fill="#f2f4f8"/>` +
    dot(92, 39, 2.6) +
    dot(79, 34, 2.6) +
    `<path d="M86 46q3 2 6 0" stroke-width="2.2"/>` +
    `<circle cx="72" cy="27" r="2" fill="#dfe8f5" stroke="none"/>`,

  물개:
    `<g transform="translate(4 2)">` +
    `<circle cx="58" cy="17" r="13" fill="#fff"/>` +
    `<path d="M58 4A13 13 0 0 0 58 30C51 24 51 10 58 4Z" fill="#e8553d" stroke="none"/>` +
    `<path d="M58 4A13 13 0 0 1 58 30C65 24 65 10 58 4Z" fill="#3b78e6" stroke="none"/>` +
    `<circle cx="58" cy="17" r="13"/>` +
    `<path d="M24 88L8 92L14 80Z" fill="#6f7a94"/>` +
    `<path d="M28 90C18 88 18 76 24 68C30 58 34 46 42 38C48 32 58 30 62 36C66 44 60 56 60 70C60 82 56 90 46 90Z" fill="#8a96b0"/>` +
    `<path d="M38 88C36 80 40 66 50 58C54 70 54 82 50 90Z" fill="#b8c2d6" stroke="none"/>` +
    `<path d="M48 62C56 68 64 72 72 70C68 62 60 58 52 56Z" fill="#6f7a94"/>` +
    dot(56, 29, 2.8) +
    dot(50, 38, 2.8) +
    `<path d="M54 38L64 36M54 41L63 42" stroke-width="1.8"/>` +
    `<path d="M50 44q4 2 7-1" stroke-width="2.2"/>` +
    `</g>`,

  가오리:
    `<circle cx="16" cy="20" r="3.5" fill="#bfe6f7"/><circle cx="84" cy="80" r="4" fill="#bfe6f7"/><circle cx="24" cy="12" r="2.5" fill="#bfe6f7" stroke-width="2"/>` +
    tube('M50 70C50 82 56 88 66 92', '#7a9cc6', 3) +
    `<path d="M50 12C60 28 76 38 94 44C78 52 62 60 50 74C38 60 22 52 6 44C24 38 40 28 50 12Z" fill="#7a9cc6"/>` +
    `<path d="M50 20C56 32 66 40 80 44C68 50 58 56 50 64C42 56 32 50 20 44C34 40 44 32 50 20Z" fill="#a8c2e0" stroke="none"/>` +
    dot(43, 40) +
    dot(57, 40) +
    `<path d="M44 50q6 5 12 0"/>` +
    cheeks(47, 14),

  복어:
    `<path d="M80 52L95 40V64Z" fill="#ff9f1a"/>` +
    puffSpikes(50, 52, 28, 42, [-150, -120, -90, -60, -30, 30, 60, 90, 120, 150, 180, -165, 165], '#e8b030') +
    `<circle cx="50" cy="52" r="32" fill="#ffd23f"/>` +
    `<path d="M22 64C30 80 70 80 78 64C66 72 34 72 22 64Z" fill="#fff4c2"/>` +
    `<ellipse cx="62" cy="58" rx="8" ry="5" fill="#ff9f1a" transform="rotate(-20 62 58)"/>` +
    `<g fill="#e8a020" stroke="none"><circle cx="48" cy="30" r="2.5"/><circle cx="60" cy="36" r="2.5"/><circle cx="70" cy="46" r="2.5"/></g>` +
    eye(33, 44, 7, 3.6) +
    `<ellipse cx="22" cy="57" rx="3.5" ry="4" fill="#ff7a9c"/>` +
    `<circle cx="34" cy="56" r="4.5" fill="#ff9aa8" stroke="none" opacity=".6"/>`,

  금붕어:
    `<path d="M26 20C10 30 6 54 12 70C18 86 34 94 50 94S82 86 88 70C94 54 90 30 74 20Z" fill="#cdeefb"/>` +
    `<rect x="22" y="12" width="56" height="9" rx="4.5" fill="#eef9ff"/>` +
    `<path d="M16 32q9-4 17 0t17 0 17 0 17 0" stroke="#7ec8f0" stroke-width="2.5"/>` +
    `<g stroke-width="2.5"><circle cx="30" cy="87" r="4" fill="#8a96b0"/><circle cx="40" cy="89" r="3.5" fill="#e85d9a"/><circle cx="66" cy="88" r="4" fill="#43b04a"/></g>` +
    `<path d="M62 58C70 44 86 42 88 50C84 56 84 60 88 66C86 74 70 72 62 58Z" fill="#ff9f1a"/>` +
    `<path d="M40 47C44 38 54 38 57 48Z" fill="#e8862e"/>` +
    `<ellipse cx="46" cy="58" rx="19" ry="13" fill="#ff9f1a"/>` +
    `<path d="M44 66C46 74 52 76 54 72Z" fill="#e8862e"/>` +
    eye(36, 55, 5, 2.6) +
    `<path d="M27 62q2 1 4-1" stroke-width="2.2"/>` +
    `<circle cx="24" cy="46" r="3" fill="#fff" stroke-width="2"/><circle cx="20" cy="38" r="2.5" fill="#fff" stroke-width="2"/>`,

  박쥐:
    `<path d="M42 48C32 34 18 30 6 36C10 42 10 50 8 58C14 55 19 57 21 63C25 59 31 59 34 65C36 59 40 56 44 58Z" fill="#6a5a8e"/>` +
    `<path d="M58 48C68 34 82 30 94 36C90 42 90 50 92 58C86 55 81 57 79 63C75 59 69 59 66 65C64 59 60 56 56 58Z" fill="#6a5a8e"/>` +
    `<path d="M21 62L20 42M34 64L34 46" stroke="#4d4070" stroke-width="2"/><path d="M79 62L80 42M66 64L66 46" stroke="#4d4070" stroke-width="2"/>` +
    `<ellipse cx="50" cy="60" rx="13" ry="15" fill="#8a78b0"/>` +
    `<ellipse cx="50" cy="64" rx="8" ry="9" fill="#b8aad6" stroke="none"/>` +
    `<path d="M40 38L36 20L48 32Z" fill="#8a78b0"/><path d="M60 38L64 20L52 32Z" fill="#8a78b0"/>` +
    `<circle cx="50" cy="42" r="13" fill="#8a78b0"/>` +
    eye(45, 41, 4.2, 2.3) +
    eye(55, 41, 4.2, 2.3) +
    `<path d="M46 48q4 3 8 0" stroke-width="2.2"/>` +
    cheeks(47, 9) +
    `<path d="M45 75v4M55 75v4" stroke-width="3"/>`,

  도마뱀:
    tube('M50 64C52 78 44 88 30 90C22 90 18 86 20 82', '#5fc24a', 7) +
    tube('M44 40L32 34L28 26', '#5fc24a', 6) +
    tube('M56 40L68 34L72 26', '#5fc24a', 6) +
    tube('M44 58L32 64L28 72', '#5fc24a', 6) +
    tube('M56 58L68 64L72 72', '#5fc24a', 6) +
    `<g fill="#5fc24a" stroke-width="2.5"><circle cx="27" cy="24" r="3.5"/><circle cx="73" cy="24" r="3.5"/><circle cx="27" cy="74" r="3.5"/><circle cx="73" cy="74" r="3.5"/></g>` +
    `<ellipse cx="50" cy="48" rx="12" ry="19" fill="#5fc24a"/>` +
    `<g fill="#3a9e47" stroke="none"><circle cx="46" cy="42" r="2.8"/><circle cx="54" cy="48" r="2.8"/><circle cx="46" cy="55" r="2.8"/><circle cx="54" cy="61" r="2.5"/></g>` +
    `<ellipse cx="50" cy="22" rx="12" ry="13" fill="#5fc24a"/>` +
    eye(44, 18, 4.5, 2.4) +
    eye(56, 18, 4.5, 2.4) +
    `<path d="M45 28q5 4 10 0" stroke-width="2.5"/>`,

  두꺼비:
    `<ellipse cx="20" cy="80" rx="14" ry="8" fill="#8a6438"/><ellipse cx="80" cy="80" rx="14" ry="8" fill="#8a6438"/>` +
    `<ellipse cx="50" cy="60" rx="36" ry="26" fill="#a8804e"/>` +
    `<circle cx="33" cy="38" r="11" fill="#a8804e"/><circle cx="67" cy="38" r="11" fill="#a8804e"/>` +
    `<path d="M26 44Q50 52 74 44" stroke="#a8804e" stroke-width="6"/>` +
    `<ellipse cx="50" cy="72" rx="20" ry="12" fill="#e8d2a0"/>` +
    `<g fill="#6b4a26" stroke="none"><circle cx="22" cy="58" r="3.8"/><circle cx="28" cy="68" r="3"/><circle cx="78" cy="58" r="3.8"/><circle cx="72" cy="68" r="3"/><circle cx="18" cy="68" r="2.8"/><circle cx="82" cy="68" r="2.8"/><circle cx="40" cy="50" r="2.8"/><circle cx="60" cy="50" r="2.8"/><circle cx="50" cy="44" r="2.8"/></g>` +
    eye(33, 37, 6.5, 3.4) +
    eye(67, 37, 6.5, 3.4) +
    `<path d="M34 58Q50 66 66 58"/>` +
    `<ellipse cx="36" cy="86" rx="8" ry="4" fill="#a8804e"/><ellipse cx="64" cy="86" rx="8" ry="4" fill="#a8804e"/>`,

  홍학:
    tube('M48 62V90', '#ff7aa8', 3) +
    tube('M52 62L64 72L52 76', '#ff7aa8', 3) +
    `<path d="M42 92H56" stroke="#ff7aa8" stroke-width="4"/>` +
    `<path d="M26 50L14 44L20 58Z" fill="#ff6f9c"/>` +
    `<ellipse cx="44" cy="52" rx="21" ry="13" fill="#ff8fb0"/>` +
    `<path d="M30 48C40 43 54 45 60 52C52 58 38 58 30 48Z" fill="#ff6f9c"/>` +
    tube('M58 46C68 36 60 28 58 20C56 12 64 8 70 10', '#ff8fb0', 7) +
    `<circle cx="70" cy="13" r="7.5" fill="#ff8fb0"/>` +
    `<path d="M76 10C84 12 88 18 86 26C84 22 80 18 74 17Z" fill="#fff"/>` +
    `<path d="M85 19C87 22 87 25 86 26C84 24 83 22 81 21Z" fill="${INK}"/>` +
    dot(70, 12, 2.2),

  칠면조:
    fan(50, 62, 7, 20, 10, 22, '#9a5b2e', '#f2e3c8') +
    fan(50, 62, 7, 14, 7, 16, '#e8862e', '#e8553d') +
    `<path d="M42 92l2-8M44 84l-2 8M46 92l-2-8M58 92l-2-8M56 84l2 8M54 92l2-8" stroke="#ff9f1a" stroke-width="3"/>` +
    `<ellipse cx="50" cy="68" rx="18" ry="18" fill="#6b3e26"/>` +
    `<path d="M40 62q5 4 10 0q5 4 10 0M40 72q5 4 10 0q5 4 10 0" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="44" rx="9" ry="11" fill="#9ec0e8"/>` +
    `<path d="M52 50C57 54 57 61 52 63C50 59 50 54 52 50Z" fill="#e8553d"/>` +
    `<path d="M50 34C52 38 51 44 49 46C47 42 47 38 50 34Z" fill="#e8553d"/>` +
    `<path d="M45 46L49 52L53 46Z" fill="${HL}" stroke-width="2.5"/>` +
    dot(45, 41, 2.4) +
    dot(55, 41, 2.4),

  공작:
    `<path d="M6 68A44 44 0 0 1 94 68Z" fill="#43b04a"/>` +
    `<path d="M50 68L14 44M50 68L28 30M50 68L50 25M50 68L72 30M50 68L86 44" stroke="#2a7a35" stroke-width="2"/>` +
    [-165, -140, -115, -90, -65, -40, -15]
      .map((a) => peaEye(...pt(50, 68, 36, a)))
      .join('') +
    [-150, -120, -60, -30].map((a) => peaEye(...pt(50, 68, 22, a), 0.8)).join('') +
    `<path d="M40 92l2-6M46 92l-2-6M60 92l-2-6M54 92l2-6" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M50 44C58 44 60 56 58 66C56 78 58 86 50 88C42 86 44 78 42 66C40 56 42 44 50 44Z" fill="#3b78e6"/>` +
    `<path d="M50 26V18M45 27L41 20M55 27L59 20" stroke-width="2"/>` +
    dot(50, 17, 2.6, '#3b78e6') +
    dot(41, 19, 2.6, '#3b78e6') +
    dot(59, 19, 2.6, '#3b78e6') +
    `<circle cx="50" cy="36" r="9" fill="#3b78e6"/>` +
    `<ellipse cx="46" cy="35" rx="3.2" ry="2.4" fill="#fff" stroke="none"/><ellipse cx="54" cy="35" rx="3.2" ry="2.4" fill="#fff" stroke="none"/>` +
    dot(46, 35, 1.7) +
    dot(54, 35, 1.7) +
    `<path d="M48 40L50 44L52 40Z" fill="${HL}" stroke-width="2"/>`,

  타조:
    `<g transform="translate(4 0)">` +
    tube('M40 60L38 88', '#f0b8a8', 4) +
    tube('M52 60L56 88', '#f0b8a8', 4) +
    `<path d="M30 91H42M52 91H64" stroke="#f0b8a8" stroke-width="5"/>` +
    blob('#fff', [
      [18, 44, 7],
      [14, 36, 5],
    ]) +
    blob('#3d3530', [
      [30, 50, 10],
      [42, 52, 14],
      [54, 48, 14],
    ]) +
    `<path d="M34 46C40 42 48 44 52 50C46 54 38 52 34 46Z" fill="#fff" stroke-width="2.5"/>` +
    tube('M60 42C64 32 64 22 62 14', '#f0c0b0', 5) +
    `<ellipse cx="64" cy="12" rx="8" ry="6.5" fill="#f0c0b0"/>` +
    `<path d="M71 10L82 13L71 16Z" fill="#f2c14e"/>` +
    eye(64, 10, 3.2, 1.9) +
    `</g>`,

  제비:
    `<path d="M50 60L38 94L50 74L62 94Z" fill="#2a4a8a"/>` +
    `<path d="M44 44C30 32 16 30 6 34C18 40 30 50 44 58Z" fill="#2a4a8a"/>` +
    `<path d="M56 44C70 32 84 30 94 34C82 40 70 50 56 58Z" fill="#2a4a8a"/>` +
    `<ellipse cx="50" cy="52" rx="11" ry="17" fill="#2a4a8a"/>` +
    `<ellipse cx="50" cy="56" rx="7" ry="11" fill="#fff"/>` +
    `<circle cx="50" cy="32" r="11" fill="#2a4a8a"/>` +
    `<path d="M43 37Q50 46 57 37Q50 40 43 37Z" fill="#e8553d"/>` +
    dot(45, 30, 3, '#fff') +
    dot(55, 30, 3, '#fff') +
    dot(45, 30.5, 1.7) +
    dot(55, 30.5, 1.7) +
    `<path d="M48 35L50 38L52 35Z" fill="#3d3530" stroke-width="2"/>`,

  까마귀:
    `<path d="M44 72L42 88M54 72L56 88M36 89H47M51 89H62" stroke-width="3.5"/>` +
    `<path d="M22 58L6 70L12 76L28 66Z" fill="#2e3348"/>` +
    `<ellipse cx="44" cy="58" rx="24" ry="16" fill="#2e3348" transform="rotate(-15 44 58)"/>` +
    `<path d="M26 56C38 48 54 52 60 62C48 68 32 66 26 56Z" fill="#474f70"/>` +
    `<circle cx="64" cy="38" r="15" fill="#2e3348"/>` +
    `<path d="M75 32L95 41L75 47Z" fill="#474f70"/>` +
    `<circle cx="68" cy="34" r="4.5" fill="#fff"/>` +
    dot(69, 34.5, 2.4) +
    `<ellipse cx="56" cy="30" rx="4" ry="2.5" fill="#fff" stroke="none" opacity=".3" transform="rotate(-30 56 30)"/>`,

  갈매기:
    `<path d="M4 80q8-6 16 0t16 0 16 0 16 0 16 0 12 0V92q0 2-2 2H6q-2 0-2-2Z" fill="#4a90e2"/>` +
    `<path d="M14 86q5-3 10 0M50 88q5-3 10 0" stroke="#dff3ff" stroke-width="2.5"/>` +
    `<path d="M46 50C38 36 24 28 6 30C18 36 28 46 36 58Z" fill="#dfe8f5"/>` +
    `<path d="M6 30C11 29.5 15 30 19 31C16 34 14 36 13 36C11 34 8 32 6 30Z" fill="${INK}"/>` +
    `<path d="M54 50C62 36 76 28 94 30C82 36 72 46 64 58Z" fill="#dfe8f5"/>` +
    `<path d="M94 30C89 29.5 85 30 81 31C84 34 86 36 87 36C89 34 92 32 94 30Z" fill="${INK}"/>` +
    `<path d="M34 56L24 52L26 62Z" fill="#fff"/>` +
    `<ellipse cx="48" cy="56" rx="17" ry="9" fill="#fff"/>` +
    `<circle cx="62" cy="48" r="9" fill="#fff"/>` +
    `<path d="M70 46L80 48L70 51Z" fill="${HL}" stroke-width="2.5"/>` +
    dot(64, 46, 2.3),

  올빼미:
    tube('M8 90H92', '#6b3e26', 6) +
    `<ellipse cx="50" cy="58" rx="30" ry="31" fill="#9a6a3e"/>` +
    `<path d="M50 34C38 24 20 30 22 46C24 60 38 62 50 56C62 62 76 60 78 46C80 30 62 24 50 34Z" fill="#f2e3c8"/>` +
    `<path d="M22 58C14 70 18 82 30 86C28 76 28 66 24 58Z" fill="#6b3e26"/><path d="M78 58C86 70 82 82 70 86C72 76 72 66 76 58Z" fill="#6b3e26"/>` +
    `<path d="M40 70l4 4 4-4M52 70l4 4 4-4M46 79l4 4 4-4" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<circle cx="38" cy="44" r="9.5" fill="${HL}"/><circle cx="62" cy="44" r="9.5" fill="${HL}"/>` +
    dot(38, 44, 5) +
    dot(62, 44, 5) +
    dot(40, 42, 1.6, '#fff') +
    dot(64, 42, 1.6, '#fff') +
    `<path d="M46 52L54 52L50 60Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<ellipse cx="42" cy="88" rx="5" ry="3" fill="#ff9f1a" stroke-width="2.5"/><ellipse cx="58" cy="88" rx="5" ry="3" fill="#ff9f1a" stroke-width="2.5"/>`,

  비버:
    `<ellipse cx="76" cy="78" rx="16" ry="9" fill="#5a3b24" transform="rotate(-20 76 78)"/>` +
    `<path d="M66 76l14-6M70 84l16-8M68 72l6 12M78 70l6 10" stroke="#3a2616" stroke-width="2"/>` +
    `<ellipse cx="44" cy="66" rx="23" ry="24" fill="#9a5b2e"/>` +
    `<ellipse cx="44" cy="72" rx="13" ry="15" fill="#c08850" stroke="none"/>` +
    `<ellipse cx="32" cy="90" rx="8" ry="4" fill="#5a3b24"/><ellipse cx="56" cy="90" rx="8" ry="4" fill="#5a3b24"/>` +
    `<circle cx="29" cy="20" r="5.5" fill="#9a5b2e"/><circle cx="59" cy="20" r="5.5" fill="#9a5b2e"/>` +
    `<circle cx="44" cy="34" r="18" fill="#9a5b2e"/>` +
    `<ellipse cx="44" cy="42" rx="11" ry="7.5" fill="#e0b080"/>` +
    `<rect x="39.5" y="45" width="9" height="10" rx="1.5" fill="#fff"/><path d="M44 45v10" stroke-width="2"/>` +
    `<ellipse cx="44" cy="38" rx="4.5" ry="3.2" fill="${INK}"/>` +
    dot(36, 29) +
    dot(52, 29) +
    `<ellipse cx="34" cy="58" rx="5.5" ry="4.5" fill="#6b3e26"/><ellipse cx="54" cy="58" rx="5.5" ry="4.5" fill="#6b3e26"/>`,

  사슴벌레:
    `<path d="M36 46L22 40L18 32M36 56L20 58L14 54M38 66L26 76L24 84M64 46L78 40L82 32M64 56L80 58L86 54M62 66L74 76L76 84" stroke-width="3.5"/>` +
    `<path d="M44 30C32 24 26 14 30 5C33 11 37 15 41 15C39 12 39 10 41 8C46 14 49 22 49 29Z" fill="#6b3e26"/>` +
    `<path d="M56 30C68 24 74 14 70 5C67 11 63 15 59 15C61 12 61 10 59 8C54 14 51 22 51 29Z" fill="#6b3e26"/>` +
    `<ellipse cx="50" cy="68" rx="16" ry="21" fill="#7a4a2a"/>` +
    `<path d="M50 50V88"/>` +
    `<path d="M41 58C40 64 40 70 42 76" stroke="#c08850" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="45" rx="15" ry="8" fill="#5a3b24"/>` +
    `<ellipse cx="50" cy="33" rx="13" ry="7" fill="#5a3b24"/>` +
    dot(41, 32, 2.2, '#fff') +
    dot(59, 32, 2.2, '#fff'),

  풍뎅이:
    `<path d="M30 50L16 44L12 36M28 62L12 64L8 58M32 76L20 86L20 92M70 50L84 44L88 36M72 62L88 64L92 58M68 76L80 86L80 92" stroke-width="3.5"/>` +
    `<path d="M46 18C44 12 40 10 36 10M54 18C56 12 60 10 64 10" stroke-width="2.5"/>` +
    `<circle cx="50" cy="62" r="27" fill="#43b04a"/>` +
    `<path d="M50 40V89"/>` +
    `<path d="M34 50C31 56 31 64 34 70" stroke="#c6f0a0" stroke-width="3.5"/>` +
    `<ellipse cx="50" cy="37" rx="18" ry="9" fill="#2e8a3a"/>` +
    `<ellipse cx="50" cy="24" rx="10" ry="7" fill="#256e30"/>` +
    dot(45, 23, 2.2, '#fff') +
    dot(55, 23, 2.2, '#fff'),

  송아지:
    legs([24, 34, 50, 60], 60, 8, 22, '#d9a066', '#6b3e26') +
    `<path d="M18 50C12 54 12 62 14 66"/><path d="M11 64L14 72L17 64Z" fill="#6b3e26"/>` +
    `<rect x="16" y="42" width="56" height="26" rx="13" fill="#d9a066"/>` +
    `<ellipse cx="36" cy="52" rx="9" ry="7" fill="#fff" stroke="none"/><ellipse cx="24" cy="60" rx="5" ry="4" fill="#fff" stroke="none"/>` +
    `<ellipse cx="52" cy="30" rx="9" ry="5" fill="#d9a066" transform="rotate(-25 52 30)"/>` +
    `<ellipse cx="88" cy="30" rx="9" ry="5" fill="#d9a066" transform="rotate(25 88 30)"/>` +
    `<circle cx="70" cy="37" r="18" fill="#d9a066"/>` +
    `<path d="M70 20C66 26 67 32 70 34C73 32 74 26 70 20Z" fill="#fff" stroke="none"/>` +
    `<circle cx="63" cy="20" r="3" fill="#f2e3c8"/><circle cx="77" cy="20" r="3" fill="#f2e3c8"/>` +
    `<ellipse cx="70" cy="48" rx="12" ry="8" fill="#ffc8b8"/>` +
    dot(66, 48, 1.8) +
    dot(74, 48, 1.8) +
    dot(62, 34) +
    dot(78, 34) +
    `<circle cx="70" cy="60" r="4.5" fill="${HL}" stroke-width="2.5"/>`,

  망아지:
    `<path d="M24 42C14 44 12 54 14 62C18 54 20 50 26 46Z" fill="#6b3e26"/>` +
    legs([24, 33, 50, 59], 48, 7, 40, '#c9894a', '#6b3e26') +
    `<ellipse cx="42" cy="47" rx="22" ry="11" fill="#c9894a"/>` +
    `<path d="M54 46L60 28L74 30L66 50Z" fill="#c9894a"/>` +
    `<path d="M64 16L63 5L72 13Z" fill="#c9894a"/>` +
    `<path d="M62 16C56 22 54 32 56 42L62 32Z" fill="#6b3e26"/>` +
    `<ellipse cx="72" cy="26" rx="14" ry="12" fill="#c9894a"/>` +
    `<ellipse cx="83" cy="31" rx="8" ry="6.5" fill="#e0b080"/>` +
    `<path d="M68 16l2 5 2-5z" fill="#fff" stroke="none"/>` +
    dot(86, 30, 1.8) +
    eye(72, 23, 4.2, 2.5) +
    `<path d="M68 18l-2-2M71 17l0-3" stroke-width="1.8"/>`,

  미어캣:
    `<ellipse cx="50" cy="91" rx="32" ry="5" fill="#e0b080"/>` +
    tube('M60 84C72 84 78 78 78 68', '#c9a070', 4) +
    `<path d="M37 88C33 70 37 50 43 40H57C63 50 67 70 63 88Z" fill="#d9b27c"/>` +
    `<path d="M44 86C42 72 44 58 50 50C56 58 58 72 56 86Z" fill="#f2e3c8" stroke="none"/>` +
    `<ellipse cx="44" cy="54" rx="4.5" ry="7" fill="#d9b27c"/><ellipse cx="56" cy="54" rx="4.5" ry="7" fill="#d9b27c"/>` +
    `<ellipse cx="42" cy="89" rx="6" ry="3" fill="#d9b27c"/><ellipse cx="58" cy="89" rx="6" ry="3" fill="#d9b27c"/>` +
    `<circle cx="38.5" cy="24" r="4" fill="#6b3e26"/><circle cx="61.5" cy="24" r="4" fill="#6b3e26"/>` +
    `<path d="M38 26C38 14 44 12 50 12S62 14 62 26C62 34 56 42 50 42S38 34 38 26Z" fill="#d9b27c"/>` +
    `<ellipse cx="44.5" cy="26" rx="4.5" ry="5" fill="#3d3530" stroke="none"/><ellipse cx="55.5" cy="26" rx="4.5" ry="5" fill="#3d3530" stroke="none"/>` +
    dot(45, 25, 1.6, '#fff') +
    dot(56, 25, 1.6, '#fff') +
    dot(50, 36, 2.4) +
    `<path d="M47 39q3 2 6 0" stroke-width="2"/>`,

  알파카:
    legs([28, 38, 54, 64], 64, 8, 24, '#e8c896', '#9a5b2e') +
    blob('#f2d9a8', [
      [32, 58, 12],
      [44, 54, 13],
      [58, 56, 12],
      [68, 62, 10],
      [52, 66, 12],
      [36, 66, 11],
      [22, 56, 6],
    ]) +
    tube('M66 58V28', '#f2d9a8', 13) +
    `<ellipse cx="59" cy="10" rx="3.5" ry="7" fill="#f2d9a8" transform="rotate(-15 59 10)"/><ellipse cx="77" cy="10" rx="3.5" ry="7" fill="#f2d9a8" transform="rotate(15 77 10)"/>` +
    `<ellipse cx="68" cy="25" rx="10.5" ry="10" fill="#f2d9a8"/>` +
    blob('#f2d9a8', [
      [62, 16, 5],
      [68, 14, 5.5],
      [74, 16, 5],
    ]) +
    `<ellipse cx="68" cy="31" rx="6" ry="4" fill="#e8c896"/>` +
    dot(63, 24, 2.5) +
    dot(73, 24, 2.5) +
    `<path d="M66 32q2 1.5 4 0" stroke-width="2"/>` +
    `<path d="M60 46h12" stroke="#e85d9a" stroke-width="3"/>`,

  카멜레온:
    tube('M6 70C30 68 60 72 94 68', '#9a5b2e', 6) +
    tube('M30 58C16 60 10 70 14 80C18 88 30 88 32 80C33 74 26 72 24 76', '#5fc24a', 6) +
    tube('M40 60L38 70', '#5fc24a', 5) +
    tube('M66 58L70 68', '#5fc24a', 5) +
    `<path d="M26 58C28 40 44 30 60 34C72 36 78 44 78 54C70 62 40 64 26 58Z" fill="#5fc24a"/>` +
    `<path d="M32 44l2-6 4 4 3-7 4 5 4-7 3 6 5-5 2 6" stroke="#3a9e47" stroke-width="2.5"/>` +
    `<path d="M40 46C42 50 44 54 46 58M52 42C54 48 54 54 56 60" stroke="#3a9e47" stroke-width="2.5"/>` +
    `<path d="M70 38L92 48C94 54 88 58 78 58Z" fill="#6fcc58"/>` +
    `<path d="M80 55L91 51" stroke-width="2.5"/>` +
    `<circle cx="80" cy="46" r="6.5" fill="#a8e05f"/>` +
    dot(82, 46, 2.5),

  펠리컨:
    `<path d="M42 76V90M52 76V90" stroke="#ff9f1a" stroke-width="4"/>` +
    `<path d="M36 91H46M48 91H58" stroke="#ff9f1a" stroke-width="4"/>` +
    `<path d="M24 62L10 60L18 70Z" fill="#dfe8f5"/>` +
    `<ellipse cx="42" cy="64" rx="22" ry="16" fill="#fff"/>` +
    `<path d="M24 60C34 54 50 56 56 66C44 74 30 72 24 60Z" fill="#dfe8f5"/>` +
    tube('M54 56C60 46 56 36 54 28', '#fff', 9) +
    `<path d="M60 24L94 32C92 46 76 54 64 42Z" fill="#ff9f1a"/>` +
    `<path d="M60 18L94 30L62 28Z" fill="${HL}"/>` +
    `<circle cx="54" cy="22" r="10" fill="#fff"/>` +
    dot(55, 20, 2.5),

  나무늘보:
    tube('M4 20C30 24 70 16 96 22', '#9a5b2e', 7) +
    tube('M38 48L32 24', '#a07a5a', 9) +
    tube('M62 48L68 22', '#a07a5a', 9) +
    `<path d="M28 18q2-5 7-2M31 17q2-5 7-2M64 16q2-5 7-2M67 15q2-5 7-2" stroke-width="3"/>` +
    tube('M42 78L36 88', '#a07a5a', 8) +
    tube('M58 78L64 88', '#a07a5a', 8) +
    `<ellipse cx="50" cy="64" rx="19" ry="21" fill="#a07a5a"/>` +
    `<ellipse cx="50" cy="68" rx="11" ry="12" fill="#c49a76" stroke="none"/>` +
    `<circle cx="50" cy="44" r="16" fill="#a07a5a"/>` +
    `<ellipse cx="50" cy="46" rx="13" ry="10" fill="#f2e3c8"/>` +
    `<ellipse cx="43" cy="44" rx="6" ry="3.5" fill="#6b3e26" stroke="none" transform="rotate(-20 43 44)"/>` +
    `<ellipse cx="57" cy="44" rx="6" ry="3.5" fill="#6b3e26" stroke="none" transform="rotate(20 57 44)"/>` +
    dot(43, 44, 1.8, '#fff') +
    dot(57, 44, 1.8, '#fff') +
    `<ellipse cx="50" cy="49" rx="3" ry="2.2" fill="${INK}"/>` +
    `<path d="M46 53q4 3 8 0" stroke-width="2.2"/>`,

  해마:
    `<circle cx="20" cy="30" r="3.5" fill="#bfe6f7"/><circle cx="16" cy="44" r="2.5" fill="#bfe6f7" stroke-width="2"/><circle cx="82" cy="24" r="3" fill="#bfe6f7"/>` +
    `<g transform="translate(50 50) scale(1.12) translate(-50 -50)">` +
    `<path d="M67 44C76 44 80 50 78 58L67 56Z" fill="#ffd23f"/>` +
    `<path d="M57 14L60 7L64 14Z" fill="#ffb020"/>` +
    `<path d="M30 27L46 24C48 16 58 12 64 16C72 20 72 30 68 36C64 42 70 50 68 58C66 68 62 76 56 82C50 88 40 86 40 78C40 72 48 70 50 74C52 78 56 76 56 72C56 66 50 60 48 52C46 44 50 40 46 34L30 33C27 33 27 27 30 27Z" fill="#ffb020"/>` +
    `<path d="M51 48h6M52 56h7M54 64h6" stroke="#e8862e" stroke-width="2.5"/>` +
    eye(57, 24, 4.5, 2.4) +
    `</g>`,
};
