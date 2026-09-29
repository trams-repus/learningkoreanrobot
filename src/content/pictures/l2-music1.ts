// 악기와 음악 도구 그림 묶음 (2단계). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(피리·플루트 / 트럼펫·색소폰 / 심벌즈·트라이앵글)는 색·모양을 다르게 했다: 피리는 대나무색 짧은 관+서, 플루트는 은색 긴 관+키.
import { INK, SKIN, dot, tube, sparkle } from '../pictureKit.ts';

/** 음표 한 개 (머리 x,y) — 글자 대신 도형으로 */
const note = (x: number, y: number, fill = INK) =>
  `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.8" fill="${fill}" transform="rotate(-20 ${x} ${y})" stroke-width="2"/>` +
  `<path d="M${x + 4.5} ${y - 1}V${y - 20}q6 3 8 8" stroke-width="2.5"/>`;

export const PICS: Record<string, string> = {
  장구:
    `<path d="M20 20C40 20 42 42 50 42S60 20 80 20V80C60 80 58 58 50 58S40 80 20 80Z" fill="#e8553d"/>` +
    `<path d="M22 26L50 46L78 26M22 74L50 54L78 74M22 38L50 48L78 38M22 62L50 52L78 62" stroke="#3b78e6" stroke-width="2.5"/>` +
    `<ellipse cx="20" cy="50" rx="11" ry="31" fill="#fff2d6"/>` +
    `<ellipse cx="80" cy="50" rx="11" ry="31" fill="#fff2d6"/>` +
    `<ellipse cx="20" cy="50" rx="5" ry="18" stroke="#e8c890" stroke-width="2.5"/>` +
    `<ellipse cx="80" cy="50" rx="5" ry="18" stroke="#e8c890" stroke-width="2.5"/>` +
    tube('M62 6L92 14', '#e8b86a', 3),
  가야금:
    `<g transform="rotate(-20 50 50)">` +
    `<path d="M4 33H86C94 33 97 40 97 50S94 67 86 67H4Z" fill="#c98b4f"/>` +
    `<path d="M5 31V69" stroke="#6b3e26" stroke-width="7"/>` +
    `<path d="M6 38H92M6 44H94M6 50H95M6 56H94M6 62H92" stroke="#fff7e0" stroke-width="1.8"/>` +
    [
      [26, 38],
      [36, 44],
      [46, 50],
      [56, 56],
      [66, 62],
      [52, 38],
      [62, 44],
      [72, 50],
      [80, 56],
      [36, 62],
    ]
      .map(([x, y]) => `<path d="M${x - 4} ${y + 3}L${x} ${y - 4}L${x + 4} ${y + 3}Z" fill="#fff" stroke-width="2"/>`)
      .join('') +
    `</g>`,
  피리:
    `<g transform="rotate(-40 50 50)">` +
    `<rect x="8" y="40" width="72" height="20" rx="8" fill="#e0b060"/>` +
    `<path d="M22 40V60M52 40V60" stroke="#9a5b2e" stroke-width="3.5"/>` +
    [31, 42, 62, 72].map((x) => dot(x, 50, 3.5)).join('') +
    `<path d="M80 43H93C97 43 98 46 98 50S97 57 93 57H80Z" fill="#9a5b2e"/>` +
    `</g>` +
    note(80, 78, '#3b78e6'),
  트럼펫:
    tube('M22 60C22 80 64 80 64 60', '#ffc933', 5) +
    [34, 44, 54].map((x) => `<rect x="${x - 3.5}" y="30" width="7" height="22" rx="2" fill="#ffd23f"/><rect x="${x - 5}" y="24" width="10" height="6" rx="2" fill="#fff2d6" stroke-width="2.5"/>`).join('') +
    `<path d="M4 44L12 47V57L4 60Z" fill="#e0a800"/>` +
    `<rect x="11" y="47" width="58" height="10" rx="2" fill="#ffd23f"/>` +
    `<path d="M66 46C76 44 84 34 92 26V78C84 70 76 60 66 58Z" fill="#ffd23f"/>` +
    `<ellipse cx="92" cy="52" rx="5" ry="26" fill="#e0a800"/>`,
  색소폰:
    `<path d="M40 10C46 8 52 8 54 14" stroke-width="6"/><path d="M40 10C46 8 52 8 54 14" stroke="#e0a800" stroke-width="2.5"/>` +
    `<rect x="32" y="6" width="10" height="8" rx="3" fill="${INK}"/>` +
    `<path d="M50 14L58 16L62 66C62 80 54 88 44 88C32 88 24 80 24 70V64L36 64V70C36 74 40 76 44 76C48 76 50 72 50 66Z" fill="#ffc933"/>` +
    `<path d="M20 62C18 52 26 44 34 44C42 44 46 52 44 62Z" fill="#ffd23f" transform="rotate(8 32 54)"/>` +
    `<ellipse cx="31" cy="50" rx="10" ry="5" fill="#e0a800" transform="rotate(8 31 50)"/>` +
    [26, 36, 46, 56].map((y) => `<circle cx="${57 + (y - 26) * 0.03}" cy="${y}" r="3.6" fill="#fff2d6" stroke-width="2"/>`).join('') +
    `<path d="M62 30H70M62 42H70M62 54H70" stroke-width="2.5"/>` +
    sparkle(80, 22, 6) +
    note(80, 74, '#e8553d'),
  플루트:
    `<g transform="rotate(-28 50 50)">` +
    `<rect x="0" y="43" width="100" height="14" rx="5" fill="#dfe8f5"/>` +
    `<rect x="12" y="39" width="12" height="22" rx="4" fill="#b8c4d8"/>` +
    dot(18, 50, 3) +
    [38, 49, 60, 71, 82].map((x) => `<circle cx="${x}" cy="50" r="4.4" fill="#8a96b0" stroke-width="2"/>`).join('') +
    `</g>` +
    note(24, 82, '#43b04a'),
  첼로:
    `<path d="M50 84V96" stroke-width="4"/>` +
    `<path d="M50 20C64 20 70 26 66 36C64 42 64 46 68 50C80 58 80 80 66 86C58 90 42 90 34 86C20 80 20 58 32 50C36 46 36 42 34 36C30 26 36 20 50 20Z" fill="#9a4e1e"/>` +
    `<path d="M38 56C34 60 38 66 36 70M62 56C66 60 62 66 64 70" stroke-width="2.5"/>` +
    `<rect x="46" y="4" width="8" height="58" rx="2" fill="${INK}"/>` +
    `<circle cx="50" cy="5" r="4.5" fill="#6b3e26"/>` +
    `<rect x="41" y="72" width="18" height="4" rx="1" fill="#f2c14e" stroke-width="2"/>` +
    `<path d="M48 10V74M52 10V74" stroke="#fff" stroke-width="1.2"/>` +
    `<path d="M8 72L92 48" stroke="#9a5b2e" stroke-width="4"/><path d="M10 69L90 46" stroke="#fff2d6" stroke-width="2"/>` +
    `<rect x="4" y="68" width="10" height="7" rx="2" fill="${INK}" transform="rotate(-16 9 72)"/>`,
  오르간:
    [
      [10, 36],
      [20, 24],
      [30, 14],
      [40, 8],
      [52, 8],
      [62, 14],
      [72, 24],
      [82, 36],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x} 56V${y}a4 4 0 0 1 8 0V56Z" fill="#ffd23f"/><path d="M${x + 1} ${y + 8}H${x + 7}" stroke-width="2"/>`,
      )
      .join('') +
    `<rect x="6" y="54" width="88" height="40" rx="3" fill="#9a5b2e"/>` +
    `<rect x="10" y="62" width="80" height="14" fill="#fff"/>` +
    `<path d="M20 62V76M30 62V76M40 62V76M50 62V76M60 62V76M70 62V76M80 62V76" stroke-width="2"/>` +
    [20, 30, 50, 60, 70].map((x) => `<rect x="${x - 3}" y="62" width="6" height="8" fill="${INK}" stroke="none"/>`).join('') +
    `<path d="M14 84H86" stroke="#6b3e26" stroke-width="3"/>`,
  심벌즈:
    `<g transform="rotate(-18 30 52)">` +
    `<ellipse cx="30" cy="52" rx="10" ry="32" fill="#ffc933"/>` +
    `<ellipse cx="27" cy="52" rx="4" ry="10" fill="#e0a800"/>` +
    `<path d="M22 52H12" stroke="#e8553d" stroke-width="5"/>` +
    `</g>` +
    `<g transform="rotate(18 70 52)">` +
    `<ellipse cx="70" cy="52" rx="10" ry="32" fill="#ffc933"/>` +
    `<ellipse cx="73" cy="52" rx="4" ry="10" fill="#e0a800"/>` +
    `<path d="M78 52H88" stroke="#e8553d" stroke-width="5"/>` +
    `</g>` +
    `<path d="M50 14V26M42 18L46 28M58 18L54 28M50 78V90M42 86L46 76M58 86L54 76" stroke="#9aa6c4" stroke-width="3"/>` +
    sparkle(50, 52, 7),
  캐스터네츠:
    `<path d="M16 64C16 84 84 84 84 64Z" fill="#e8553d"/>` +
    `<g transform="rotate(-26 18 60)"><path d="M18 58C18 38 86 38 86 58Z" fill="#3b78e6"/></g>` +
    `<path d="M22 62C26 70 40 74 50 74" stroke="#ff9a8a" stroke-width="3"/>` +
    `<path d="M16 60C4 58 4 72 16 66" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M40 28C46 24 56 28 60 20" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M70 42C78 40 84 44 90 38" stroke="#9aa6c4" stroke-width="3"/>`,
  트라이앵글:
    `<path d="M46 4V16" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M40 22L14 82H82L54 26" stroke-width="10"/><path d="M40 22L14 82H82L54 26" stroke="#dfe8f5" stroke-width="4"/>` +
    `<circle cx="47" cy="17" r="3" fill="#e8553d" stroke-width="2"/>` +
    tube('M92 40L60 66', '#8a96b0', 3) +
    `<circle cx="92" cy="40" r="4" fill="${INK}"/>` +
    `<path d="M22 44L14 40M16 56L8 56M70 48L78 44" stroke="#9aa6c4" stroke-width="3"/>`,
  마라카스:
    tube('M38 58L22 90', '#9a5b2e', 6) +
    `<ellipse cx="44" cy="40" rx="17" ry="22" fill="#e8553d" transform="rotate(26 44 40)"/>` +
    `<path d="M32 30C38 38 48 42 58 42M30 44C36 50 44 54 52 54" stroke="#ffd23f" stroke-width="4"/>` +
    tube('M62 58L78 90', '#9a5b2e', 6) +
    `<ellipse cx="56" cy="40" rx="17" ry="22" fill="#43b04a" transform="rotate(-26 56 40)"/>` +
    `<path d="M46 38C52 36 60 30 66 24M50 50C58 48 66 42 70 36" stroke="#fff" stroke-width="4"/>` +
    dot(56, 24, 2.5, '#ffd23f') +
    `<path d="M12 22q-4 6 0 12M88 22q4 6 0 12" stroke="#9aa6c4" stroke-width="3"/>`,
  지휘봉:
    `<path d="M8 30C24 10 44 10 50 24M14 52C28 38 44 40 46 50" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M14 18L66 64" stroke-width="7"/><path d="M14 18L66 64" stroke="#fff" stroke-width="3"/>` +
    `<path d="M62 56C58 56 56 60 58 64L70 76L78 68L66 58Z" fill="#c98b4f"/>` +
    `<path d="M64 70C60 76 62 86 70 90H86C92 90 94 84 92 78L86 66C82 62 76 62 72 64Z" fill="${SKIN}"/>` +
    `<path d="M70 72C66 70 62 72 64 76L70 80" fill="${SKIN}"/>` +
    `<path d="M68 90V96H90V90" fill="#3b78e6"/>` +
    note(74, 30, '#8e4fc9') +
    note(88, 46, '#e85d9a'),
  악보:
    `<rect x="14" y="8" width="72" height="86" rx="3" fill="#fff"/>` +
    [16, 44, 72]
      .map((y) =>
        `<path d="M20 ${y}H80M20 ${y + 4}H80M20 ${y + 8}H80M20 ${y + 12}H80M20 ${y + 16}H80" stroke="#8a96b0" stroke-width="1.5"/>`,
      )
      .join('') +
    [
      [30, 28],
      [44, 24],
      [58, 20],
      [72, 24],
      [30, 54],
      [44, 58],
      [58, 50],
      [72, 54],
      [36, 82],
      [56, 78],
      [72, 84],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="4" ry="3" fill="${INK}" stroke="none" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 3.5} ${y - 1}V${y - 14}" stroke-width="2"/>`,
      )
      .join(''),
};
