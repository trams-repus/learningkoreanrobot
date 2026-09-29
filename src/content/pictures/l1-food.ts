// 음식 그림 묶음 (1단계 어휘). 규칙은 docs/picture-style.md.
// 비슷한 말끼리(귤·감·레몬·망고·참외 / 국·떡국·수프·라면·국수 / 소금·설탕 / 떡·떡볶이·떡국)는 색·그릇·실루엣을 다르게 했다.
import { INK, HL, dot, blob, sparkle, tube } from '../pictureKit.ts';

/** 그릇 (위에서 조금 내려다본 모양): 국물 면(surface) + 속 재료(inner) + 그릇 몸통 + 굽 */
function bowl(cy: number, soup: string, body: string, inner = '', band = ''): string {
  const k = (0.55 * 11).toFixed(1);
  return (
    `<path d="M38 ${cy + 36}L36 ${cy + 44}H64L62 ${cy + 36}" fill="${body}"/>` +
    `<ellipse cx="50" cy="${cy}" rx="38" ry="11" fill="${soup}"/>` +
    inner +
    `<path d="M12 ${cy}C12 ${cy + 26} 30 ${cy + 40} 50 ${cy + 40}S88 ${cy + 26} 88 ${cy}C88 ${cy + Number(k)} 71 ${cy + 11} 50 ${cy + 11}S12 ${cy + Number(k)} 12 ${cy}Z" fill="${body}"/>` +
    (band ? `<path d="M19 ${cy + 20}Q50 ${cy + 30} 81 ${cy + 20}" stroke="${band}" stroke-width="4"/>` : '')
  );
}

const steam = (y: number) =>
  `<path d="M36 ${y}c-5-5 5-9 0-15M50 ${y - 2}c-5-5 5-9 0-15M64 ${y}c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`;

export const PICS: Record<string, string> = {
  사과:
    `<path d="M50 30C50 22 52 16 57 11" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M50 30C38 20 14 24 14 50C14 74 30 90 43 88C46 87 48 86 50 86S54 87 57 88C70 90 86 74 86 50C86 24 62 20 50 30Z" fill="#e8553d"/>` +
    `<path d="M55 22C61 10 77 10 81 16C73 24 63 26 55 22Z" fill="#43b04a"/>` +
    `<path d="M26 44C27 38 31 34 36 33" stroke="#ff9a8a" stroke-width="4"/>`,
  귤:
    `<ellipse cx="50" cy="57" rx="36" ry="31" fill="#ff9f1a"/>` +
    `<path d="M50 27C54 15 68 12 76 17C70 27 58 30 50 27Z" fill="#43b04a"/><circle cx="50" cy="27" r="4" fill="#3a9e47"/>` +
    `<path d="M26 50C27 43 32 38 38 36" stroke="#ffc97a" stroke-width="4"/>` +
    [
      [36, 62],
      [48, 70],
      [62, 64],
      [70, 50],
      [56, 48],
      [42, 78],
      [60, 80],
      [74, 70],
    ]
      .map(([x, y]) => dot(x, y, 1.6, '#e8862e'))
      .join(''),
  감:
    `<path d="M12 56C12 38 30 32 50 32S88 38 88 56C88 76 72 86 50 86S12 76 12 56Z" fill="#f2661e"/>` +
    `<path d="M50 38V82" stroke="#d24e14" stroke-width="3"/>` +
    `<path d="M24 58C24 50 28 46 34 44" stroke="#ff9a6a" stroke-width="4"/>` +
    `<path d="M50 24Q58 34 80 36Q60 42 50 50Q40 42 20 36Q42 34 50 24Z" fill="#3a9e47"/>` +
    `<rect x="46" y="28" width="8" height="10" rx="3" fill="#6b3e26"/>`,
  떡:
    `<ellipse cx="50" cy="78" rx="44" ry="12" fill="#6fb5a0"/>` +
    `<rect x="12" y="58" width="26" height="18" rx="9" fill="#fff"/><rect x="37" y="58" width="26" height="18" rx="9" fill="#ff9aa8"/><rect x="62" y="58" width="26" height="18" rx="9" fill="#fff"/>` +
    `<rect x="24" y="41" width="26" height="18" rx="9" fill="#ff9aa8"/><rect x="50" y="41" width="26" height="18" rx="9" fill="#fff"/>` +
    `<rect x="37" y="24" width="26" height="18" rx="9" fill="#fff"/>` +
    `<path d="M42 29h8M55 46h8M17 63h8M67 63h8" stroke="#fff" stroke-width="3"/><path d="M29 46h8M42 63h8" stroke="#ffd0d6" stroke-width="3"/>`,
  국:
    steam(28) +
    bowl(
      48,
      '#e0a050',
      '#4a90e2',
      `<rect x="30" y="42" width="9" height="9" rx="1.5" fill="#fffdf2" stroke-width="2.5"/><rect x="58" y="44" width="9" height="9" rx="1.5" fill="#fffdf2" stroke-width="2.5"/>` +
        `<circle cx="47" cy="47" r="3.5" fill="#7cc242" stroke-width="2"/><circle cx="72" cy="43" r="3.5" fill="#7cc242" stroke-width="2"/><circle cx="24" cy="48" r="3" fill="#7cc242" stroke-width="2"/>`,
      '#8fd3ff',
    ),
  라면:
    tube('M12 56H4', '#8a96b0', 5) +
    tube('M88 56H96', '#8a96b0', 5) +
    `<path d="M14 44V74C14 84 26 90 50 90S86 84 86 74V44Z" fill="#f2c14e"/>` +
    `<ellipse cx="50" cy="44" rx="36" ry="12" fill="#f08a3a"/>` +
    `<path d="M22 44q4-6 8 0t8 0t8 0t8 0t8 0t8 0t8 0M26 38q4-6 8 0t8 0t8 0t8 0t8 0t8 0M28 50q4-6 8 0t8 0t8 0t8 0t8 0t8 0" stroke="#ffe7a0" stroke-width="3.5"/>` +
    `<ellipse cx="64" cy="40" rx="10" ry="7" fill="#fff"/><circle cx="64" cy="40" r="4" fill="${HL}" stroke-width="2.5"/>` +
    `<circle cx="34" cy="41" r="3" fill="#43b04a" stroke-width="2"/>` +
    `<path d="M22 60H78" stroke="#e0a800" stroke-width="3"/>`,
  국수:
    `<path d="M92 10L50 36M86 4L46 32" stroke="#9a5b2e" stroke-width="5"/>` +
    bowl(
      56,
      '#f5e6c8',
      '#e8553d',
      `<path d="M44 32C40 42 38 50 30 56H66C60 50 56 42 52 32Z" fill="#fff4d0"/>` +
        `<path d="M46 34C44 44 42 50 38 56M49 34V56M51 34C53 44 56 50 60 56" stroke="#e0c890" stroke-width="2.5"/>` +
        `<path d="M24 58q6-4 12 0t12 0t12 0t12 0" stroke="#fff4d0" stroke-width="3"/>`,
      '#ffd23f',
    ) +
    `<path d="M92 10L50 36" stroke="#c98b4f" stroke-width="2"/>`,
  쿠키:
    `<path d="M50 14C70 14 86 30 86 46C80 44 74 50 76 56C70 56 66 62 70 68C64 80 58 86 50 86C30 86 14 70 14 50S30 14 50 14Z" fill="#e0a458"/>` +
    [
      [36, 34, 5],
      [56, 28, 4.5],
      [30, 56, 5],
      [48, 50, 5.5],
      [44, 72, 4.5],
      [62, 42, 4],
      [60, 70, 4],
    ]
      .map(([x, y, r]) => `<path d="M${x - r} ${y}L${x} ${y - r}L${x + r} ${y + 1}L${x - 1} ${y + r}Z" fill="#5a3b24" stroke-width="2"/>`)
      .join(''),
  케이크:
    `<ellipse cx="50" cy="84" rx="42" ry="10" fill="#8fd3ff"/>` +
    `<path d="M18 50V78C18 86 82 86 82 78V50Z" fill="#fff"/>` +
    `<path d="M18 64C18 70 82 70 82 64" stroke="#ff9aa8" stroke-width="6"/>` +
    `<ellipse cx="50" cy="50" rx="32" ry="10" fill="#fffaf0"/>` +
    `<rect x="46" y="20" width="8" height="28" rx="2" fill="#7ec8f0"/><path d="M46 28L54 24M46 36L54 32M46 44L54 40" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M50 6C44 13 45 18 50 18S56 13 50 6Z" fill="#ff9f1a"/>` +
    [
      [30, 50],
      [70, 50],
      [40, 56],
      [60, 56],
    ]
      .map(([x, y]) => `<path d="M${x} ${y + 7}C${x - 8} ${y + 2} ${x - 7} ${y - 5} ${x} ${y - 4}C${x + 7} ${y - 5} ${x + 8} ${y + 2} ${x} ${y + 7}Z" fill="#e8403a" stroke-width="2.5"/>`)
      .join(''),
  과자:
    `<path d="M14 24L18 18L22 24L26 18L30 24L34 18L38 24L42 18L46 24L50 18L54 24L58 18L60 24C64 44 64 64 60 84L56 90L52 84L48 90L44 84L40 90L36 84L32 90L28 84L24 90L20 84L16 90L14 84C10 64 10 44 14 24Z" fill="#3b78e6"/>` +
    `<ellipse cx="37" cy="56" rx="14" ry="10" fill="#ffd23f" transform="rotate(-20 37 56)"/><path d="M29 58q8-6 16-4" stroke="#e0a800" stroke-width="2.5"/>` +
    `<path d="M20 30L54 30" stroke="#8fd3ff" stroke-width="3"/>` +
    `<ellipse cx="78" cy="62" rx="12" ry="9" fill="#ffd23f" transform="rotate(-20 78 62)"/>` +
    `<ellipse cx="80" cy="82" rx="12" ry="9" fill="#f2c14e" transform="rotate(15 80 82)"/>` +
    `<ellipse cx="76" cy="40" rx="10" ry="8" fill="#ffd23f" transform="rotate(30 76 40)"/>`,
  주스:
    `<path d="M58 44L66 12H80" stroke-width="10"/><path d="M58 44L66 12H80" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M24 26L32 90H68L76 26Z" fill="#f4fbff"/>` +
    `<path d="M27 40L33 86H67L73 40Z" fill="#ff9f1a" stroke="none"/><path d="M27 40H73"/>` +
    `<path d="M24 26L32 90H68L76 26Z"/>` +
    `<path d="M37 50L40 76" stroke="#ffc97a" stroke-width="4"/>` +
    `<circle cx="76" cy="28" r="13" fill="#ffd23f"/><circle cx="76" cy="28" r="8" fill="#ffb13d" stroke-width="2"/><path d="M76 20V36M68 28H84" stroke="#ffd23f" stroke-width="2"/>`,
  달걀:
    `<path d="M80 74L94 88" stroke-width="12"/><path d="M80 74L94 88" stroke="#5a3b24" stroke-width="5"/>` +
    `<circle cx="58" cy="56" r="30" fill="#4a5068"/><circle cx="58" cy="56" r="24" fill="#6a7390" stroke="none"/>` +
    blob('#fff', [
      [58, 56, 15],
      [68, 62, 10],
      [52, 66, 9],
      [66, 46, 9],
    ]) +
    `<circle cx="58" cy="56" r="8" fill="${HL}"/><path d="M55 53q2-2 4-2" stroke="#fff4b0" stroke-width="2.5"/>` +
    `<ellipse cx="22" cy="62" rx="14" ry="19" fill="#fff"/><path d="M16 54C17 50 20 48 23 47" stroke="#dfe8f5" stroke-width="3"/>`,
  참외:
    `<g transform="rotate(-20 50 54)">` +
    `<path d="M12 54C12 36 30 24 50 24S88 36 88 54S70 84 50 84S12 72 12 54Z" fill="#ffd23f"/>` +
    `<path d="M13 52C28 28 72 28 87 52M12 54C30 42 70 42 88 54M12 55C30 68 70 68 88 55M13 57C28 82 72 82 87 57" stroke="#fffbe0" stroke-width="5"/>` +
    `<path d="M12 54C12 36 30 24 50 24S88 36 88 54S70 84 50 84S12 72 12 54Z"/>` +
    `<path d="M88 54h6" stroke="#6b3e26" stroke-width="5"/></g>` +
    `<path d="M88 34C86 22 76 16 68 18C70 28 78 34 88 34Z" fill="#43b04a"/>`,
  복숭아:
    `<path d="M50 30C36 18 12 26 14 52C16 76 34 88 50 88S84 76 86 52C88 26 64 18 50 30Z" fill="#ffb3a7"/>` +
    `<path d="M50 30C44 44 44 70 50 86" stroke="#e8707a" stroke-width="3"/>` +
    `<path d="M22 60C24 72 34 80 44 82" stroke="#ff8a8e" stroke-width="6" opacity=".6"/><path d="M78 60C76 72 66 80 56 82" stroke="#ff8a8e" stroke-width="6" opacity=".6"/>` +
    `<path d="M50 30C52 20 56 16 60 14" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M54 22C58 10 72 6 80 12C74 22 62 26 54 22Z" fill="#43b04a"/><path d="M47 24C42 14 30 12 24 17C30 25 40 27 47 24Z" fill="#5fc24a"/>`,
  자두:
    `<path d="M50 20C52 14 56 10 60 8" stroke="#6b3e26" stroke-width="4"/>` +
    `<circle cx="50" cy="56" r="34" fill="#8e2f6b"/>` +
    `<path d="M50 24C42 38 42 70 48 88" stroke="#6a1f50" stroke-width="3"/>` +
    `<path d="M30 42C32 36 36 32 40 30" stroke="#d98ab8" stroke-width="5"/>` +
    `<path d="M56 18C62 8 76 8 82 14C74 22 64 22 56 18Z" fill="#43b04a"/>`,
  레몬:
    `<path d="M14 56C10 54 10 50 14 48C18 30 40 20 60 24C72 26 82 34 86 44C90 46 90 50 86 52C82 70 60 80 40 76C28 74 18 66 14 56Z" fill="#ffe14d"/>` +
    `<path d="M28 44C32 36 40 32 48 31" stroke="#fff6b0" stroke-width="4"/>` +
    `<path d="M50 24C54 16 64 12 72 16C66 24 58 26 50 24Z" fill="#43b04a"/>` +
    dot(26, 60, 1.5, '#e0b800') +
    dot(60, 64, 1.5, '#e0b800') +
    dot(72, 48, 1.5, '#e0b800'),
  체리:
    `<path d="M32 60C34 40 46 22 62 12M70 64C68 44 66 26 62 12" stroke="#5a8a2e" stroke-width="4"/>` +
    `<path d="M62 12C68 4 82 4 88 10C80 18 68 18 62 12Z" fill="#43b04a"/>` +
    `<circle cx="30" cy="70" r="18" fill="#d9203a"/><circle cx="70" cy="72" r="18" fill="#e8403a"/>` +
    `<path d="M20 66C21 62 24 59 27 58M60 68C61 64 64 61 67 60" stroke="#ff9a9a" stroke-width="4"/>`,
  키위:
    `<circle cx="50" cy="52" r="38" fill="#8a5a30"/><circle cx="50" cy="52" r="32" fill="#7cc242" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="52" rx="11" ry="9" fill="#f0f5c8" stroke="none"/>` +
    Array.from({ length: 12 }, (_, k) => {
      const a = (k * Math.PI) / 6;
      const x = Math.round((50 + 17 * Math.cos(a)) * 10) / 10;
      const y = Math.round((52 + 15 * Math.sin(a)) * 10) / 10;
      const deg = Math.round((a * 180) / Math.PI);
      return `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.8" fill="${INK}" stroke="none" transform="rotate(${deg} ${x} ${y})"/>`;
    }).join('') +
    Array.from({ length: 12 }, (_, k) => {
      const a = ((k + 0.5) * Math.PI) / 6;
      const x1 = Math.round((50 + 22 * Math.cos(a)) * 10) / 10;
      const y1 = Math.round((52 + 20 * Math.sin(a)) * 10) / 10;
      const x2 = Math.round((50 + 29 * Math.cos(a)) * 10) / 10;
      const y2 = Math.round((52 + 28 * Math.sin(a)) * 10) / 10;
      return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#b5e07a" stroke-width="2.5"/>`;
    }).join(''),
  망고:
    `<path d="M28 22C48 10 80 22 86 48C92 74 72 90 50 88C32 86 22 74 24 60C26 50 20 44 18 36C16 28 22 24 28 22Z" fill="#ffc933"/>` +
    `<path d="M50 88C32 86 22 74 24 60C26 50 20 44 18 36C24 50 40 58 52 60C66 62 76 70 80 78C72 86 62 90 50 88Z" fill="#ff8c1a" stroke="none"/>` +
    `<path d="M28 22C48 10 80 22 86 48C92 74 72 90 50 88C32 86 22 74 24 60C26 50 20 44 18 36C16 28 22 24 28 22Z"/>` +
    `<path d="M60 26C68 28 76 36 78 44" stroke="#fff0a0" stroke-width="4"/>` +
    `<path d="M26 22C24 16 24 12 26 8" stroke="#6b3e26" stroke-width="4"/><path d="M27 12C34 2 50 2 54 8C46 16 34 16 27 12Z" fill="#43b04a"/>`,
  옥수수:
    `<path d="M50 14C66 14 70 40 68 60C66 74 60 82 50 82S34 74 32 60C30 40 34 14 50 14Z" fill="#ffd23f"/>` +
    `<path d="M40 20C36 40 36 62 42 80M60 20C64 40 64 62 58 80M50 14V82" stroke="#e0a800" stroke-width="2.5"/>` +
    `<path d="M34 28H66M32 40H68M32 52H68M33 64H67M38 74H62" stroke="#e0a800" stroke-width="2.5"/>` +
    `<path d="M50 90C36 88 22 70 20 40C28 54 38 64 50 72Z" fill="#43b04a"/>` +
    `<path d="M50 90C64 88 78 70 80 40C72 54 62 64 50 72Z" fill="#5fc24a"/>` +
    `<path d="M46 90L44 96H56L54 90" fill="#3a9e47"/>`,
  버섯:
    `<path d="M38 50C36 64 34 78 36 86C42 90 58 90 64 86C66 78 64 64 62 50Z" fill="#fff4e0"/>` +
    `<path d="M10 54C10 30 30 12 50 12S90 30 90 54C80 58 20 58 10 54Z" fill="#e8403a"/>` +
    `<circle cx="32" cy="36" r="6" fill="#fff" stroke-width="2.5"/><circle cx="54" cy="26" r="7" fill="#fff" stroke-width="2.5"/><circle cx="72" cy="42" r="5.5" fill="#fff" stroke-width="2.5"/><circle cx="50" cy="45" r="4" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M42 64V78" stroke="#e8d6b0" stroke-width="3"/>`,
  콩:
    `<path d="M8 60C20 40 50 30 80 30C90 30 94 36 90 40C76 56 50 70 22 72C12 72 6 66 8 60Z" fill="#5fc24a"/>` +
    `<path d="M14 62C28 50 56 40 84 36C80 46 60 60 24 66Z" fill="#b5e07a"/>` +
    `<circle cx="28" cy="60" r="8.5" fill="#43b04a"/><circle cx="46" cy="53" r="9" fill="#43b04a"/><circle cx="64" cy="46" r="8.5" fill="#43b04a"/><circle cx="80" cy="40" r="6" fill="#43b04a"/>` +
    `<path d="M25 57q2-2 5-2M43 50q2-2 5-2M61 43q2-2 5-2" stroke="#b5f0a0" stroke-width="2.5"/>` +
    `<path d="M90 40C94 36 96 32 96 28" stroke="#3a9e47" stroke-width="3.5"/>`,
  배추:
    `<path d="M34 92C26 80 24 60 30 40H70C76 60 74 80 66 92Z" fill="#f5f0c8"/>` +
    `<path d="M42 92C38 78 38 60 42 44M58 92C62 78 62 60 58 44M50 92V46" stroke="#e0d8a0" stroke-width="3"/>` +
    blob('#5fc24a', [
      [36, 36, 14],
      [50, 26, 16],
      [64, 36, 14],
      [30, 50, 9],
      [70, 50, 9],
    ]) +
    `<path d="M36 50C38 40 44 30 50 20M64 50C62 40 56 30 50 20M50 20V44" stroke="#b5e07a" stroke-width="3"/>`,
  무:
    `<path d="M40 30C30 18 28 8 32 4C40 8 44 18 44 28Z" fill="#43b04a"/><path d="M50 28C48 16 50 6 56 2C60 10 58 20 54 30Z" fill="#5fc24a"/><path d="M60 30C66 20 74 14 80 16C78 24 70 30 62 34Z" fill="#43b04a"/>` +
    `<path d="M34 36C34 28 66 28 66 36C68 60 60 82 52 94C50 96 48 96 46 94C40 82 32 60 34 36Z" fill="#fff"/>` +
    `<path d="M34 36C34 28 66 28 66 36C67 44 66 50 66 52C56 56 44 56 34 52C34 48 34 42 34 36Z" fill="#c8e6a0"/>` +
    `<path d="M40 64h6M54 72h6M44 82h5" stroke="#dfe8f5" stroke-width="3"/>`,
  가지:
    `<path d="M26 22C22 34 26 48 36 60C48 76 64 90 80 88C92 86 94 72 86 62C76 50 62 44 52 34C44 26 40 18 34 16C30 16 28 18 26 22Z" fill="#8e4fc9"/>` +
    `<path d="M20 30C22 22 28 14 38 14C44 18 46 24 44 30C38 26 30 26 20 30Z" fill="#43b04a"/>` +
    `<path d="M32 14C30 10 30 6 32 2" stroke="#3a9e47" stroke-width="5"/>` +
    `<path d="M40 50C46 60 56 70 66 76" stroke="#c9a0f0" stroke-width="4"/>`,
  떡볶이:
    `<ellipse cx="50" cy="60" rx="44" ry="26" fill="#fff"/><ellipse cx="50" cy="58" rx="34" ry="18" fill="#e8553d" stroke="none"/>` +
    [
      [30, 52, -20],
      [52, 46, 10],
      [70, 56, -30],
      [40, 66, 20],
      [60, 68, -5],
    ]
      .map(
        ([x, y, a]) =>
          `<rect x="${x - 11}" y="${y - 5}" width="22" height="10" rx="5" fill="#ff7a52" transform="rotate(${a} ${x} ${y})"/>` +
          `<path d="M${x - 6} ${y - 1.5}h8" stroke="#ffb49a" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`,
      )
      .join('') +
    `<path d="M24 40l4-3M76 42l3 3M50 76l4 2" stroke="#43b04a" stroke-width="4"/>`,
  소시지:
    `<path d="M20 36C30 24 70 22 82 30" stroke-width="20"/><path d="M20 36C30 24 70 22 82 30" stroke="#f07e7e" stroke-width="13"/>` +
    `<path d="M16 72C28 60 68 58 80 66" stroke-width="20"/><path d="M16 72C28 60 68 58 80 66" stroke="#f07e7e" stroke-width="13"/>` +
    `<path d="M32 28C44 24 58 23 68 25M28 64C40 60 54 59 64 61" stroke="#ffc0b8" stroke-width="3"/>` +
    `<path d="M12 40l-4 3M86 30l5-1M12 76l-4 3M84 66l5-1" stroke-width="4"/>`,
  꿀:
    `<path d="M26 34C14 42 12 60 18 74C24 88 76 88 82 74C88 60 86 42 74 34Z" fill="#e8962e"/>` +
    `<rect x="24" y="24" width="52" height="12" rx="4" fill="#9a5b2e"/>` +
    `<path d="M24 32H76V40C76 44 72 44 72 40V38C70 50 64 50 64 40V38H48C46 54 38 54 38 38H32V44C32 48 28 48 28 44V38Z" fill="${HL}"/>` +
    `<path d="M26 60C28 52 30 48 34 46" stroke="#ffc97a" stroke-width="4"/>` +
    `<path d="M50 66c-4 6-5 9-5 11a5 5 0 0 0 10 0c0-2-1-5-5-11Z" fill="${HL}"/>` +
    `<path d="M80 14c-3 5-4 7-4 9a4 4 0 0 0 8 0c0-2-1-4-4-9Z" fill="${HL}"/>`,
  소금:
    `<g transform="rotate(-35 50 50)">` +
    `<path d="M40 34C36 42 32 52 32 62V84C32 88 36 90 40 90H60C64 90 68 88 68 84V62C68 52 64 42 60 34Z" fill="#fff"/>` +
    `<path d="M36 34C36 18 64 18 64 34Z" fill="#8a96b0"/><rect x="34" y="32" width="32" height="7" rx="3" fill="#8a96b0"/>` +
    dot(44, 27, 2) +
    dot(50, 24, 2) +
    dot(56, 27, 2) +
    `<path d="M40 76H60" stroke="#dfe8f5" stroke-width="4"/></g>` +
    `<path d="M4 94C8 82 26 82 30 94Z" fill="#fff"/>` +
    [
      [22, 26],
      [16, 38],
      [26, 42],
      [12, 52],
      [22, 58],
      [14, 68],
      [22, 76],
    ]
      .map(([x, y]) => `<rect x="${x - 2.5}" y="${y - 2.5}" width="5" height="5" fill="#fff" stroke-width="1.8"/>`)
      .join(''),
  설탕:
    `<path d="M22 50C16 36 34 26 50 26S84 36 78 50Z" fill="#fff" stroke-width="3"/>` +
    sparkle(36, 40, 5, HL) +
    sparkle(60, 34, 4, HL) +
    `<path d="M12 50H88C88 70 72 84 50 84S12 70 12 50Z" fill="#ff9aa8"/><path d="M22 62H78" stroke="#ffd0d6" stroke-width="3"/>` +
    `<path d="M58 44L86 18" stroke-width="8"/><path d="M58 44L86 18" stroke="#dfe8f5" stroke-width="3"/>` +
    [
      [16, 76],
      [74, 78],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x} ${y - 8}L${x + 10} ${y - 12}L${x + 16} ${y - 7}L${x + 6} ${y - 3}Z" fill="#fff"/>` +
          `<path d="M${x} ${y - 8}L${x + 6} ${y - 3}V${y + 9}L${x} ${y + 4}Z" fill="#eef2f8"/>` +
          `<path d="M${x + 6} ${y - 3}L${x + 16} ${y - 7}V${y + 5}L${x + 6} ${y + 9}Z" fill="#dfe8f5"/>`,
      )
      .join(''),
  김:
    `<rect x="26" y="16" width="58" height="58" rx="3" fill="#2a3a30" transform="rotate(10 55 45)"/>` +
    `<rect x="16" y="26" width="58" height="58" rx="3" fill="#1f2a24" transform="rotate(-6 45 55)"/>` +
    `<path d="M24 42C34 38 44 44 54 40M26 58C38 54 48 60 62 56M28 72C40 68 50 74 64 70" stroke="#3f6a4a" stroke-width="3"/>` +
    sparkle(30, 34, 6, '#bfe6d8') +
    sparkle(64, 78, 4, '#bfe6d8'),
  미역:
    `<path d="M30 92C22 76 38 64 28 50C20 38 34 26 28 12C40 24 38 36 42 48C48 62 36 76 42 92Z" fill="#2e7d32"/>` +
    `<path d="M50 92C44 74 60 62 52 46C46 34 56 20 58 8C66 22 62 34 64 46C68 62 56 76 60 92Z" fill="#43b04a"/>` +
    `<path d="M68 92C62 78 76 68 70 54C66 44 76 34 82 26C86 38 80 48 82 58C84 72 74 80 78 92Z" fill="#3a9e47"/>` +
    `<path d="M32 80C30 68 36 58 32 46M56 80C54 66 60 56 56 42M72 82C70 72 76 62 74 52" stroke="#7cc26a" stroke-width="2.5"/>` +
    `<path d="M14 94H86" stroke-width="4"/>` +
    `<circle cx="18" cy="30" r="5" fill="#bfe8ff" stroke-width="2.5"/><circle cx="12" cy="16" r="3.5" fill="#bfe8ff" stroke-width="2.5"/><circle cx="88" cy="16" r="4.5" fill="#bfe8ff" stroke-width="2.5"/>`,
  호떡:
    `<path d="M85 68A40 20 0 1 1 86 50Q76 48 74 55Q68 60 74 65Q76 70 85 68Z" fill="#b8702e"/>` +
    `<path d="M86 44Q76 42 74 49Q68 54 74 59Q76 64 85 62L85 68Q76 70 74 65Q68 60 74 55Q76 48 86 50Z" fill="#5a3b24" stroke="none"/>` +
    `<path d="M85 60A40 20 0 1 1 86 42Q76 40 74 47Q68 52 74 57Q76 62 85 60Z" fill="#d98c3a"/>` +
    `<path d="M74 57Q72 64 73 70a3 3 0 0 0 6 0Q78 64 78 58Z" fill="#6b3e26" stroke-width="2.5"/>` +
    `<path d="M24 46C32 38 44 36 54 37" stroke="#f2b86a" stroke-width="4"/>` +
    `<path d="M34 54C36 58 40 60 44 58M52 44C54 46 58 46 60 44" stroke="#9a5b2e" stroke-width="3"/>`,
  붕어빵:
    `<path d="M76 50L94 34C96 44 96 56 94 66Z" fill="#d98c3a"/>` +
    `<path d="M8 50C16 30 40 22 60 28C70 32 76 42 78 50C76 58 70 68 60 72C40 78 16 70 8 50Z" fill="#e8a24a"/>` +
    `<path d="M34 30C38 38 38 62 34 70" stroke="#b8702e" stroke-width="3"/>` +
    `<path d="M44 42q5 5 10 0M44 54q5 5 10 0M56 48q5 5 10 0M56 60q5 5 10 0M44 66q5 4 10 0M56 36q5 4 10 0" stroke="#b8702e" stroke-width="3"/>` +
    `<circle cx="22" cy="46" r="4" fill="#6b3e26" stroke-width="2"/>` +
    `<path d="M40 76L46 84L52 76" fill="#d98c3a"/><path d="M86 44L92 40M86 56L92 60" stroke="#b8702e" stroke-width="2.5"/>`,
  도넛:
    `<circle cx="50" cy="52" r="38" fill="#e0a458"/>` +
    `<path d="M50 18C66 18 82 28 84 44C84 52 78 50 76 56C74 62 80 66 74 72C68 78 62 72 56 78C50 82 46 76 40 80C32 82 30 74 24 72C16 70 18 62 16 56C12 44 20 24 50 18Z" fill="#ff8ab4"/>` +
    `<circle cx="50" cy="50" r="12" fill="#fff7e0"/>` +
    [
      [34, 32, '#ffd23f', 30],
      [60, 28, '#43b04a', -20],
      [72, 42, '#3b8fe0', 60],
      [28, 50, '#fff', -40],
      [36, 66, '#3b8fe0', 10],
      [66, 64, '#ffd23f', -50],
      [48, 30, '#fff', 80],
    ]
      .map(([x, y, c, a]) => `<rect x="${Number(x) - 4}" y="${Number(y) - 1.8}" width="8" height="3.6" rx="1.8" fill="${c}" stroke-width="1.5" transform="rotate(${a} ${x} ${y})"/>`)
      .join(''),
  팝콘:
    blob('#fffbe8', [
      [30, 34, 12],
      [46, 26, 13],
      [62, 28, 12],
      [74, 38, 10],
      [26, 46, 9],
      [50, 40, 12],
    ]) +
    `<path d="M40 28q4-4 8 0M58 30q3-4 7 0M26 38q3-3 6 0" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M20 44L28 92H72L80 44Z" fill="#fff"/>` +
    `<path d="M31 44L36 92H46L44 44ZM56 44L54 92H64L69 44Z" fill="#e8553d" stroke="none"/>` +
    `<path d="M20 44L28 92H72L80 44Z"/><path d="M18 44H82" stroke-width="5"/>` +
    `<circle cx="86" cy="60" r="6" fill="#fffbe8"/><circle cx="12" cy="68" r="5" fill="#fffbe8"/>`,
  젤리: [
    [26, 56, '#e8403a', -10],
    [50, 46, '#43b04a', 0],
    [74, 56, '#ffc933', 10],
  ]
    .map(
      ([x, y, c, a]) =>
        `<g transform="rotate(${a} ${x} ${y})">` +
        `<circle cx="${Number(x) - 8}" cy="${Number(y) - 24}" r="5" fill="${c}"/><circle cx="${Number(x) + 8}" cy="${Number(y) - 24}" r="5" fill="${c}"/>` +
        `<ellipse cx="${Number(x) - 12}" cy="${Number(y) + 4}" rx="5" ry="6" fill="${c}"/><ellipse cx="${Number(x) + 12}" cy="${Number(y) + 4}" rx="5" ry="6" fill="${c}"/>` +
        `<ellipse cx="${Number(x) - 8}" cy="${Number(y) + 22}" rx="6" ry="5" fill="${c}"/><ellipse cx="${Number(x) + 8}" cy="${Number(y) + 22}" rx="6" ry="5" fill="${c}"/>` +
        `<ellipse cx="${x}" cy="${Number(y) + 10}" rx="12" ry="14" fill="${c}"/>` +
        `<circle cx="${x}" cy="${Number(y) - 14}" r="11" fill="${c}"/>` +
        dot(Number(x) - 4, Number(y) - 15, 1.8) +
        dot(Number(x) + 4, Number(y) - 15, 1.8) +
        `<path d="M${Number(x) - 5} ${Number(y) + 4}q2-5 6-6" stroke="#fff" stroke-width="3" opacity=".6"/>` +
        `</g>`,
    )
    .join(''),
  요구르트:
    `<path d="M56 30L66 6" stroke-width="9"/><path d="M56 30L66 6" stroke="#ff9aa8" stroke-width="3.5"/>` +
    `<path d="M32 30C30 40 36 48 36 56C36 64 30 70 30 80C30 88 36 92 50 92S70 88 70 80C70 70 64 64 64 56C64 48 70 40 68 30Z" fill="#fff"/>` +
    `<path d="M33 66C40 70 60 70 67 66" stroke="#ff9aa8" stroke-width="3"/>` +
    `<ellipse cx="50" cy="30" rx="19" ry="6" fill="#e8553d"/>` +
    `<path d="M42 72C40 78 40 82 42 86" stroke="#dfe8f5" stroke-width="3"/>` +
    sparkle(22, 50, 5) +
    sparkle(80, 44, 4),
  수프:
    `<path d="M62 50L88 16" stroke-width="11"/><path d="M62 50L88 16" stroke="#dfe8f5" stroke-width="4.5"/>` +
    `<path d="M6 54C6 76 28 88 50 88S94 76 94 54Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="54" rx="44" ry="16" fill="#fff"/>` +
    `<ellipse cx="50" cy="55" rx="33" ry="10" fill="#ffd98a"/>` +
    `<ellipse cx="60" cy="54" rx="9" ry="5" fill="#dfe8f5"/>` +
    dot(36, 54, 2.5, '#43b04a') +
    dot(44, 59, 2.2, '#43b04a') +
    dot(30, 58, 2, '#43b04a') +
    `<path d="M14 68C26 80 74 80 86 68" stroke="#8fd3ff" stroke-width="3"/>`,
  샐러드:
    blob('#5fc24a', [
      [28, 48, 12],
      [42, 40, 13],
      [58, 38, 13],
      [72, 46, 12],
      [50, 50, 12],
    ]) +
    `<circle cx="36" cy="46" r="9" fill="#e8403a"/><path d="M36 40V52M30 46H42" stroke="#ff9a8a" stroke-width="2"/>` +
    `<circle cx="62" cy="44" r="8" fill="#b5e07a"/><circle cx="62" cy="44" r="4" fill="#e8f5c8" stroke-width="2"/>` +
    `<circle cx="50" cy="32" r="5" fill="#ffd23f"/>` +
    `<path d="M10 52H90C90 74 72 88 50 88S10 74 10 52Z" fill="#fff"/><path d="M20 64Q50 76 80 64" stroke="#43b04a" stroke-width="3"/>`,
  튀김:
    `<ellipse cx="50" cy="80" rx="42" ry="10" fill="#fff"/><path d="M14 80l6-4 6 4 6-4 6 4 6-4 6 4 6-4 6 4 6-4 6 4 6-4 6 4" stroke="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M76 30L90 18L88 34Z" fill="#ff7a52"/><path d="M78 56L92 50L86 66Z" fill="#ff7a52"/>` +
    blob('#f2b84a', [
      [20, 44, 8],
      [32, 40, 9],
      [46, 36, 9],
      [60, 34, 9],
      [72, 32, 8],
    ]) +
    blob('#ffc94d', [
      [22, 64, 8],
      [36, 62, 9],
      [50, 60, 9],
      [64, 58, 9],
      [76, 56, 7],
    ]) +
    `<path d="M26 42q4-4 8 0M44 34q4-4 8 0M30 62q4-4 8 0M52 58q4-4 8 0" stroke="#fff0b0" stroke-width="3"/>`,
  치킨:
    `<path d="M58 56L78 78" stroke-width="13"/><path d="M58 56L78 78" stroke="#fff" stroke-width="6"/>` +
    `<circle cx="84" cy="76" r="6" fill="#fff"/><circle cx="78" cy="86" r="6" fill="#fff"/>` +
    blob('#e0892e', [
      [34, 36, 18],
      [48, 28, 13],
      [24, 52, 12],
      [50, 46, 16],
      [60, 58, 8],
    ]) +
    `<path d="M26 34q4-4 8 0M42 26q4-4 8 0M30 52q4-4 8 0M48 44q4-4 8 0" stroke="#ffc062" stroke-width="3"/>` +
    dot(38, 44, 1.8, '#9a5b2e') +
    dot(56, 36, 1.8, '#9a5b2e') +
    dot(22, 44, 1.8, '#9a5b2e'),
  아이스크림:
    `<path d="M30 54L50 94L70 54Z" fill="#e0a458"/><path d="M36 60L58 80M46 56L64 72M64 60L42 80M54 56L37 70" stroke="#b8702e" stroke-width="2.5"/>` +
    `<circle cx="50" cy="48" r="18" fill="#7ed6a0"/>` +
    `<circle cx="50" cy="26" r="16" fill="#ff9ec4"/>` +
    `<path d="M32 52C36 58 44 60 50 58C56 60 64 58 68 52" stroke="#7ed6a0" stroke-width="6"/>` +
    `<path d="M40 22C42 17 46 15 50 14M40 44C42 40 45 38 48 37" stroke="#fff" stroke-width="3.5"/>` +
    `<circle cx="50" cy="8" r="4" fill="#e8403a"/>`,
  카레:
    `<ellipse cx="50" cy="58" rx="46" ry="28" fill="#fff"/><path d="M12 64C24 80 76 80 88 64" stroke="#8fd3ff" stroke-width="3"/>` +
    `<path d="M50 34C66 32 84 42 84 56C84 68 70 74 54 74C44 74 42 64 46 56C48 48 42 38 50 34Z" fill="#f2b233"/>` +
    blob('#fff', [
      [26, 52, 12],
      [38, 44, 11],
      [36, 62, 11],
      [46, 52, 9],
    ]) +
    `<rect x="60" y="44" width="9" height="9" rx="2" fill="#ff8c1a" stroke-width="2.5"/><rect x="68" y="60" width="9" height="9" rx="2" fill="#fff0b0" stroke-width="2.5"/><rect x="52" y="60" width="8" height="8" rx="2" fill="#ff8c1a" stroke-width="2.5"/><rect x="72" y="48" width="7" height="7" rx="2" fill="#fff0b0" stroke-width="2.5"/>`,
  떡국:
    steam(26) +
    bowl(
      46,
      '#fff4e0',
      '#fff',
      [
        [30, 46, -15],
        [50, 49, 8],
        [70, 45, 15],
        [40, 38, 5],
        [60, 38, -8],
      ]
        .map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="6" fill="#fff" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`)
        .join('') + `<path d="M46 43h8" stroke="${HL}" stroke-width="4"/><path d="M24 40l5-2M74 52l5-2" stroke="${INK}" stroke-width="3.5"/>`,
      '#3b78e6',
    ),
  볶음밥:
    `<ellipse cx="50" cy="68" rx="46" ry="20" fill="#8fd3ff"/>` +
    `<path d="M16 66C16 40 32 26 50 26S84 40 84 66C74 72 26 72 16 66Z" fill="#f5d27a"/>` +
    [
      [34, 44, '#43b04a'],
      [58, 38, '#43b04a'],
      [46, 58, '#43b04a'],
      [70, 56, '#43b04a'],
      [28, 60, '#43b04a'],
    ]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${c}" stroke-width="2"/>`)
      .join('') +
    [
      [44, 36],
      [66, 46],
      [38, 52],
      [58, 62],
      [24, 52],
    ]
      .map(([x, y]) => `<rect x="${x - 3.5}" y="${y - 3.5}" width="7" height="7" rx="1" fill="#ff8c1a" stroke-width="2"/>`)
      .join('') +
    `<path d="M50 46h6M54 54h6M32 34h5" stroke="#fff4b0" stroke-width="3"/>`,
  멜론:
    `<path d="M50 22V12M44 12H56" stroke="#6b8a2e" stroke-width="5"/>` +
    `<circle cx="50" cy="56" r="36" fill="#9ccf5a"/>` +
    `<path d="M22 36C34 50 36 72 30 86M38 22C48 42 50 70 44 92M58 20C62 40 66 70 62 92M76 30C80 48 80 72 72 86M16 56C32 48 68 48 86 40M18 72C36 62 66 64 84 58M28 84C44 76 60 78 76 76M20 42C36 34 60 30 78 30" stroke="#e8f5c8" stroke-width="2.5"/>` +
    `<circle cx="50" cy="56" r="36"/>`,
  파:
    `<path d="M14 90C12 84 18 82 22 84L60 44L68 52L28 92C26 96 18 96 14 90Z" fill="#fff"/>` +
    `<path d="M16 92l-6 4M14 88l-8 0M18 94l-2 4" stroke-width="2.5"/>` +
    `<path d="M50 54L60 44L68 52L58 62Z" fill="#c8e6a0" stroke="none"/>` +
    `<path d="M60 44L84 8C88 6 92 10 90 14L68 52Z" fill="#43b04a"/>` +
    `<path d="M62 48L94 30C96 34 96 38 92 40L68 52Z" fill="#3a9e47"/>` +
    `<path d="M60 44L74 16C76 12 80 14 78 18L66 48Z" fill="#5fc24a"/>` +
    `<path d="M14 90C12 84 18 82 22 84L60 44L68 52L28 92C26 96 18 96 14 90Z"/>`,
};
