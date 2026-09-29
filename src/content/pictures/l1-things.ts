// 그림 묶음: 생활 물건·옷·장난감 (l1). 규칙은 docs/picture-style.md.
import { INK, dot, sparkle, tube } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;

/** 다섯 뿔 별 */
function star5(x: number, y: number, r: number, fill = '#ffd23f', sw = 2): string {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const rr = k % 2 ? r * 0.45 : r;
    return `${r1(x + rr * Math.cos(a))} ${r1(y + rr * Math.sin(a))}`;
  });
  return `<path d="M${pts.join('L')}Z" fill="${fill}" stroke-width="${sw}"/>`;
}

/** 작은 꽃 (꽃잎 다섯 + 노란 가운데) */
function flower(x: number, y: number, petal = '#fff'): string {
  const ps = Array.from({ length: 5 }, (_, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return `<circle cx="${r1(x + 5 * Math.cos(a))}" cy="${r1(y + 5 * Math.sin(a))}" r="4"/>`;
  }).join('');
  return `<g fill="${petal}" stroke-width="1.8">${ps}</g>` + dot(x, y, 3, '#ffd23f');
}

/** 운동화 한 짝 (오른쪽을 봄, 폭 82·높이 50) */
const sneaker = (t: string) =>
  `<g transform="${t}">` +
  `<path d="M26 12C24 2 36 0 38 8L36 18Z" fill="#dfe8f5"/>` +
  `<path d="M4 40V14C4 10 8 8 12 8H24C28 8 30 12 32 16C38 22 48 26 58 28C72 30 80 34 82 40Z" fill="#3b78e6"/>` +
  `<path d="M64 29C74 31 80 35 82 40H66C64 36 64 32 64 29Z" fill="#fff"/>` +
  `<path d="M0 38H82C84 44 80 50 74 50H6C2 50 -1 44 0 38Z" fill="#fff"/><path d="M6 44H76" stroke="#9fb3d9" stroke-width="2.5"/>` +
  `<path d="M33 15L40 22M38 14L35 23M43 19L50 26M48 18L45 27M53 23L59 29M57 22L55 30" stroke="#fff" stroke-width="2.8"/>` +
  `<path d="M8 32C18 26 30 28 40 34" stroke="#ffd23f" stroke-width="4.5"/>` +
  `</g>`;

/** 장화 한 짝 */
const boot = (t: string) =>
  `<g transform="${t}">` +
  `<path d="M0 0H28V50C28 56 32 58 40 60C50 62 56 66 56 74V80H0Z" fill="#ffd23f"/>` +
  `<path d="M-2 78H58V86H-2Z" fill="#e0a800"/>` +
  `<rect x="-3" y="-3" width="34" height="10" rx="3" fill="#f2c14e"/>` +
  `<path d="M7 14V48" stroke="#fff5c0" stroke-width="4"/>` +
  `</g>`;

/** 구두 한 짝 (검정, 굽, 오른쪽을 봄) */
const dressShoe = (t: string) =>
  `<g transform="${t}">` +
  `<path d="M6 32H22V44H8Z" fill="#6b3e26"/>` +
  `<path d="M2 32C2 18 4 8 12 6C20 14 32 16 42 14C58 12 72 20 78 28C80 30 80 32 80 34H2Z" fill="#30354f"/>` +
  `<path d="M12 6C20 14 32 16 42 14C36 6 20 4 12 6Z" fill="#c98b4f"/>` +
  `<path d="M0 32H80C80 36 77 38 72 38H0Z" fill="#6b3e26"/>` +
  `<path d="M50 19C60 19 68 22 73 27" stroke="#fff" stroke-width="4"/><path d="M8 24V16" stroke="#fff" stroke-width="3.5"/>` +
  `</g>`;

/** 색연필 한 자루 (아래 끝이 원점, 위로 뾰족) */
const colorPencil = (t: string, c: string, dark: string) =>
  `<g transform="${t}">` +
  `<rect x="-7" y="-56" width="14" height="56" rx="1.5" fill="${c}"/><path d="M0 -52V-5" stroke="${dark}" stroke-width="2.5"/>` +
  `<path d="M-7 -56L0 -78L7 -56Z" fill="#f5d6a8"/><path d="M-3 -69.2L0 -78L3 -69.2Z" fill="${c}" stroke-width="2"/>` +
  `</g>`;

/** 진주 목걸이 진주 위치 */
const pearls = Array.from({ length: 15 }, (_, k) => {
  const a = (-40 + (k * 260) / 14) * (Math.PI / 180);
  return [r1(50 + 34 * Math.cos(a)), r1(46 + 36 * Math.sin(a))] as const;
});

export const PICS: Record<string, string> = {
  컵:
    tube('M68 40C88 40 88 70 68 70', '#3b8fe0', 7) +
    `<path d="M18 28H70V74C70 83 63 88 54 88H34C25 88 18 83 18 74Z" fill="#3b8fe0"/>` +
    `<ellipse cx="44" cy="28" rx="26" ry="6" fill="#2a6fc4"/>` +
    `<path d="M26 42V72" stroke="#bfe6ff" stroke-width="4"/>` +
    `<path d="M44 66C36 60 36 52 40 51C42 50 44 52 44 54C44 52 46 50 48 51C52 52 52 60 44 66Z" fill="#fff" stroke="none"/>` +
    `<path d="M34 18c-4-4 4-7 0-11M48 18c-4-4 4-7 0-11" stroke="#9aa6c4" stroke-width="3"/>`,
  숟가락:
    `<g transform="rotate(-35 50 50)">` +
    `<path d="M46 42L44 86C44 94 56 94 56 86L54 42Z" fill="#dfe8f5"/>` +
    `<ellipse cx="50" cy="26" rx="16" ry="21" fill="#dfe8f5"/><ellipse cx="50" cy="25" rx="9.5" ry="14" fill="#b8c6da" stroke="none"/>` +
    `<path d="M43 18C44 14 46 12 49 11" stroke="#fff" stroke-width="3"/><path d="M50 50V82" stroke="#fff" stroke-width="3"/>` +
    `</g>`,
  젓가락:
    `<path d="M17.2 11.4L26.8 8.6L47.9 89.4L44.1 90.6Z" fill="#d9a55b"/><path d="M17.2 11.4L26.8 8.6L30.6 23.1L22 25.7Z" fill="#e8553d"/>` +
    `<path d="M82.8 11.4L73.2 8.6L52.1 89.4L55.9 90.6Z" fill="#d9a55b"/><path d="M82.8 11.4L73.2 8.6L69.4 23.1L78 25.7Z" fill="#e8553d"/>`,
  포크:
    `<g transform="rotate(15 50 50)">` +
    `<rect x="44" y="56" width="12" height="36" rx="6" fill="#dfe8f5"/>` +
    [26, 40, 54, 68].map((x) => `<rect x="${x}" y="8" width="6" height="36" rx="3" fill="#dfe8f5"/>`).join('') +
    `<path d="M26 38H74V44C74 57 63 62 56 62H44C37 62 26 57 26 44Z" fill="#dfe8f5"/>` +
    `<path d="M50 66V86" stroke="#fff" stroke-width="3"/>` +
    `</g>`,
  접시:
    `<ellipse cx="50" cy="63" rx="42" ry="24" fill="#dfe8f5"/>` +
    `<ellipse cx="50" cy="58" rx="44" ry="26" fill="#fff"/>` +
    `<ellipse cx="50" cy="58" rx="36" ry="20" stroke="#ff9aa8" stroke-width="3"/>` +
    `<ellipse cx="50" cy="60" rx="25" ry="12" fill="#f2f5fb" stroke="#b8c6da" stroke-width="2.5"/>`,
  그릇:
    `<path d="M36 80H64L62 90H38Z" fill="#fff"/>` +
    `<path d="M12 40C12 68 30 84 50 84S88 68 88 40Z" fill="#fff"/>` +
    `<path d="M20 60q5-5 10 0t10 0t10 0t10 0t10 0t10 0" stroke="#3b78e6" stroke-width="3.5"/>` +
    `<ellipse cx="50" cy="40" rx="38" ry="11" fill="#dfe8f5"/>` +
    `<path d="M24 52C26 62 30 68 36 72" stroke="#dfe8f5" stroke-width="3" opacity=".6"/>`,
  냄비:
    `<rect x="5" y="50" width="18" height="10" rx="5" fill="#3b4a6b"/><rect x="77" y="50" width="18" height="10" rx="5" fill="#3b4a6b"/>` +
    `<path d="M18 46H82V78C82 86 76 90 68 90H32C24 90 18 86 18 78Z" fill="#e8553d"/>` +
    `<path d="M26 56V78" stroke="#ff9a8a" stroke-width="4"/>` +
    `<path d="M14 46C14 32 30 26 50 26S86 32 86 46Z" fill="#ff8a65"/>` +
    `<rect x="12" y="42" width="76" height="8" rx="4" fill="#ff8a65"/>` +
    `<rect x="41" y="16" width="18" height="11" rx="4" fill="#3b4a6b"/>`,
  가위:
    tube('M50 52L34 70', '#e8553d', 7) +
    tube('M50 52L66 70', '#e8553d', 7) +
    `<ellipse cx="29" cy="77" rx="15" ry="13" fill="#e8553d"/><ellipse cx="29" cy="77" rx="7" ry="5.5" fill="#fff7e0"/>` +
    `<ellipse cx="71" cy="77" rx="15" ry="13" fill="#e8553d"/><ellipse cx="71" cy="77" rx="7" ry="5.5" fill="#fff7e0"/>` +
    `<path d="M55 54L40 12C38 7 32 8 33 14L44 54Z" fill="#dfe8f5"/>` +
    `<path d="M45 54L60 12C62 7 68 8 67 14L56 54Z" fill="#dfe8f5"/>` +
    `<circle cx="50" cy="51" r="4" fill="#8a96b0"/>`,
  테이프:
    `<path d="M66 40H80V88L76.5 84L73 88L69.5 84L66 88Z" fill="#bfe6ff"/>` +
    `<circle cx="46" cy="46" r="34" fill="#bfe6ff"/>` +
    `<circle cx="46" cy="46" r="20" fill="#f5d6a8"/>` +
    `<circle cx="46" cy="46" r="13" fill="#fff7e0"/>` +
    `<path d="M20 36C23 27 29 21 37 17" stroke="#fff" stroke-width="4"/>`,
  크레파스: (
    [
      [14, 24, '#e8553d'],
      [29, 16, '#ff9f1a'],
      [44, 20, '#ffd23f'],
      [59, 12, '#43b04a'],
      [74, 22, '#3b78e6'],
    ] as const
  )
    .map(
      ([x, t, c]) =>
        `<path d="M${x} ${t + 14}L${x + 3} ${t}H${x + 9}L${x + 12} ${t + 14}Z" fill="${c}"/>` +
        `<rect x="${x}" y="${t + 14}" width="12" height="${74 - t}" rx="2" fill="${c}"/>` +
        `<path d="M${x + 1} ${t + 24}H${x + 11}M${x + 1} ${t + 30}H${x + 11}M${x + 1} ${82}H${x + 11}" stroke="${INK}" stroke-width="2.5"/>`,
    )
    .join(''),
  색연필:
    colorPencil('translate(40 90) rotate(-22)', '#e8553d', '#b83a26') +
    colorPencil('translate(60 90) rotate(22)', '#3b78e6', '#2a58b0') +
    colorPencil('translate(50 88)', '#43b04a', '#2e7d32'),
  칫솔:
    `<g transform="rotate(-15 50 50)">` +
    `<rect x="6" y="56" width="62" height="12" rx="6" fill="#3b8fe0"/><path d="M14 62H40" stroke="#bfe6ff" stroke-width="3"/>` +
    `<rect x="58" y="54" width="36" height="14" rx="5" fill="#3b8fe0"/>` +
    `<rect x="62" y="40" width="30" height="14" rx="2" fill="#bfe6ff"/>` +
    `<path d="M69 43V52M77 43V52M85 43V52" stroke="#7ea6d9" stroke-width="2.5"/>` +
    `<path d="M62 40C58 32 66 26 71 31C72 22 83 22 84 29C89 26 95 32 92 40Z" fill="#fff"/>` +
    `<path d="M67 36C73 33 80 32 88 35" stroke="#43b04a" stroke-width="3"/>` +
    `</g>`,
  치약:
    `<g transform="rotate(-30 50 50)">` +
    `<path d="M12 28H22L66 40V60L22 72H12Z" fill="#fff"/>` +
    `<path d="M32 30.7L50 35.6V64.4L32 69.3Z" fill="#3b8fe0"/>` +
    `<path d="M36 50q3-4 6 0t6 0" stroke="#fff" stroke-width="3"/>` +
    `<rect x="7" y="25" width="10" height="50" rx="2" fill="#3b8fe0"/><path d="M12 30V70" stroke="#bfe6ff" stroke-width="2.5"/>` +
    `<rect x="66" y="43" width="10" height="14" fill="#fff"/>` +
    `<rect x="76" y="40" width="14" height="20" rx="3" fill="#3b8fe0"/>` +
    `</g>`,
  수건:
    tube('M14 22H86', '#b8c6da', 5) +
    dot(12, 22, 5, '#8a96b0') +
    dot(88, 22, 5, '#8a96b0') +
    `<path d="M40 22H78V78H40Z" fill="#4a90e2"/>` +
    `<path d="M22 24C22 13 70 13 70 24V86H22Z" fill="#7ec8f0"/>` +
    `<path d="M22 68H70M22 76H70" stroke="#fff" stroke-width="4"/>` +
    `<path d="M26 87V93M34 87V93M42 87V93M50 87V93M58 87V93M66 87V93" stroke-width="3"/>`,
  빗:
    `<g transform="rotate(-12 50 50)">` +
    [16, 27, 38, 49, 60, 71, 82].map((x) => `<rect x="${x}" y="40" width="5" height="36" rx="2.5" fill="#e85d9a"/>`).join('') +
    `<path d="M10 46C10 30 22 24 50 24S90 30 90 46Z" fill="#e85d9a"/>` +
    `<path d="M22 36C30 31 40 30 50 30" stroke="#ffc0d8" stroke-width="3.5"/>` +
    `</g>`,
  이불:
    `<path d="M16 20C28 16 40 24 52 20S76 16 86 20C90 22 92 26 92 30V60L68 84C56 86 44 80 32 84S12 84 10 80C6 70 10 60 8 50S6 26 16 20Z" fill="#ff9aa8"/>` +
    `<path d="M92 60L68 84C66 70 74 62 92 60Z" fill="#fff"/>` +
    `<path d="M16 28C28 25 40 31 52 28S74 25 84 28V56M16 28C18 42 14 60 18 76C28 74 44 78 62 76" stroke="#e85d9a" stroke-width="2.5" stroke-dasharray="4 4"/>` +
    flower(32, 42) +
    flower(62, 42) +
    flower(44, 64) +
    flower(76, 50, '#fff1b8'),
  침대:
    `<path d="M8 88V32C8 22 24 22 24 32V88Z" fill="#9a5b2e"/>` +
    `<path d="M78 88V52C78 45 92 45 92 52V88Z" fill="#9a5b2e"/>` +
    `<rect x="20" y="70" width="62" height="10" fill="#6b3e26"/>` +
    `<rect x="20" y="54" width="62" height="16" rx="3" fill="#fff"/>` +
    `<rect x="24" y="40" width="20" height="15" rx="6" fill="#fff"/>` +
    `<path d="M44 50H82V74H44C40 74 40 50 44 50Z" fill="#3b78e6"/><path d="M44 50H82V57H43Z" fill="#7ec8f0"/>`,
  의자:
    `<rect x="28" y="10" width="9" height="80" rx="3" fill="#b5793a"/><rect x="63" y="10" width="9" height="80" rx="3" fill="#b5793a"/>` +
    `<rect x="33" y="16" width="34" height="10" rx="2" fill="#e0a060"/><rect x="33" y="31" width="34" height="8" rx="2" fill="#e0a060"/>` +
    `<path d="M22 50H78L86 60H14Z" fill="#e0a060"/><rect x="14" y="60" width="72" height="7" fill="#9a5b2e"/>` +
    `<rect x="17" y="67" width="9" height="26" rx="3" fill="#b5793a"/><rect x="74" y="67" width="9" height="26" rx="3" fill="#b5793a"/>`,
  책상:
    `<path d="M27 40V30M27 30L36 16" stroke-width="5"/><path d="M28 12L46 12L42 24L32 22Z" fill="#43b04a"/><ellipse cx="27" cy="41" rx="8" ry="3" fill="#43b04a"/>` +
    `<rect x="56" y="30" width="26" height="6" rx="1" fill="#e8553d"/><rect x="58" y="24" width="22" height="6" rx="1" fill="#3b78e6"/>` +
    `<rect x="12" y="50" width="9" height="40" fill="#9a5b2e"/>` +
    `<rect x="56" y="50" width="32" height="40" fill="#c98b4f"/><path d="M56 70H88" stroke-width="3"/>` +
    `<rect x="66" y="57" width="12" height="5" rx="2.5" fill="#ffd23f" stroke-width="2.5"/><rect x="66" y="77" width="12" height="5" rx="2.5" fill="#ffd23f" stroke-width="2.5"/>` +
    `<rect x="6" y="42" width="88" height="9" rx="2" fill="#e0a060"/>`,
  소파:
    `<rect x="18" y="80" width="7" height="10" fill="#6b3e26"/><rect x="75" y="80" width="7" height="10" fill="#6b3e26"/>` +
    `<rect x="18" y="24" width="64" height="38" rx="12" fill="#4a90e2"/>` +
    `<rect x="12" y="62" width="76" height="20" rx="4" fill="#3b78e6"/>` +
    `<rect x="22" y="52" width="28" height="14" rx="5" fill="#7ec8f0"/><rect x="50" y="52" width="28" height="14" rx="5" fill="#7ec8f0"/>` +
    `<rect x="6" y="42" width="18" height="40" rx="8" fill="#4a90e2"/><rect x="76" y="42" width="18" height="40" rx="8" fill="#4a90e2"/>`,
  전화:
    `<path d="M20 30C14 38 14 50 20 58M12 24C4 36 4 52 12 64M80 30C86 38 86 50 80 58M88 24C96 36 96 52 88 64" stroke="${'#ff9f1a'}" stroke-width="4"/>` +
    `<rect x="30" y="8" width="40" height="84" rx="8" fill="#3b4a6b"/>` +
    `<rect x="35" y="18" width="30" height="60" rx="2" fill="#7ec8f0"/>` +
    `<path d="M45 13H55" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="85" r="3.5" fill="#8a96b0" stroke-width="2"/>` +
    `<g stroke-width="2"><rect x="39" y="24" width="9" height="9" rx="2" fill="#ffd23f"/><rect x="52" y="24" width="9" height="9" rx="2" fill="#e8553d"/>` +
    `<rect x="39" y="38" width="9" height="9" rx="2" fill="#43b04a"/><rect x="52" y="38" width="9" height="9" rx="2" fill="#fff"/>` +
    `<rect x="39" y="52" width="9" height="9" rx="2" fill="#e85d9a"/><rect x="52" y="52" width="9" height="9" rx="2" fill="#8e4fc9"/></g>`,
  컴퓨터:
    `<rect x="44" y="58" width="12" height="10" fill="#8a96b0"/><path d="M34 70C34 66 66 66 66 70Z" fill="#8a96b0"/>` +
    `<rect x="12" y="8" width="76" height="52" rx="5" fill="#3b4a6b"/>` +
    `<rect x="18" y="14" width="64" height="40" rx="2" fill="#7ec8f0"/>` +
    `<path d="M18 54L36 36L50 48L60 40L82 54Z" fill="#5fc24a"/><circle cx="68" cy="26" r="6" fill="#ffd23f"/>` +
    `<rect x="10" y="76" width="66" height="16" rx="3" fill="#dfe8f5"/>` +
    `<path d="M16 82H70M16 87H26M32 87H56M62 87H70" stroke="#8a96b0" stroke-width="3" stroke-dasharray="4 2.5"/>` +
    `<ellipse cx="86" cy="84" rx="6" ry="8" fill="#dfe8f5"/>`,
  냉장고:
    `<rect x="28" y="88" width="8" height="6" fill="#8a96b0"/><rect x="64" y="88" width="8" height="6" fill="#8a96b0"/>` +
    `<rect x="24" y="6" width="52" height="84" rx="7" fill="#dff1ff"/>` +
    `<path d="M24 36H76"/>` +
    `<rect x="31" y="15" width="5" height="14" rx="2.5" fill="#8a96b0" stroke-width="2.5"/><rect x="31" y="44" width="5" height="22" rx="2.5" fill="#8a96b0" stroke-width="2.5"/>` +
    `<circle cx="58" cy="52" r="5" fill="#e8553d" stroke-width="2.5"/><rect x="60" y="62" width="10" height="8" rx="2" fill="#43b04a" stroke-width="2.5"/>` +
    star5(64, 22, 6, '#ffd23f', 2.5),
  열쇠:
    `<g transform="rotate(-35 50 50)">` +
    `<rect x="66" y="52" width="9" height="15" fill="#ffd23f"/><rect x="80" y="52" width="8" height="11" fill="#ffd23f"/>` +
    `<rect x="36" y="44" width="54" height="12" rx="2" fill="#ffd23f"/>` +
    `<circle cx="26" cy="50" r="18" fill="#ffd23f"/><circle cx="26" cy="50" r="7" fill="#fff7e0"/>` +
    `<path d="M14 40C16 36 19 34 22 33" stroke="#fff5c0" stroke-width="3"/>` +
    `</g>`,
  문:
    `<path d="M8 94H92" stroke-width="4"/>` +
    `<path d="M18 94V6H82V94Z" fill="#6b3e26"/>` +
    `<rect x="25" y="12" width="50" height="82" fill="#c98b4f"/>` +
    `<rect x="31" y="18" width="30" height="26" rx="2" fill="#b5793a"/><rect x="31" y="52" width="30" height="34" rx="2" fill="#b5793a"/>` +
    `<circle cx="68" cy="52" r="4.5" fill="#ffd23f"/>`,
  창문:
    `<rect x="10" y="10" width="80" height="74" rx="3" fill="#fff"/>` +
    `<rect x="17" y="17" width="66" height="60" fill="#8fd3ff"/>` +
    `<circle cx="68" cy="32" r="8" fill="#ffd23f"/>` +
    `<g fill="#fff"><circle cx="30" cy="56" r="7" stroke-width="6"/><circle cx="40" cy="51" r="9" stroke-width="6"/><circle cx="51" cy="56" r="7" stroke-width="6"/>` +
    `<circle cx="30" cy="56" r="7" stroke="none"/><circle cx="40" cy="51" r="9" stroke="none"/><circle cx="51" cy="56" r="7" stroke="none"/></g>` +
    `<path d="M50 17V77M17 47H83" stroke="#fff" stroke-width="8"/><path d="M50 17V77M17 47H83" stroke-width="2"/>` +
    `<rect x="17" y="17" width="66" height="60"/>` +
    `<rect x="4" y="84" width="92" height="8" rx="2" fill="#c98b4f"/>`,
  상자:
    `<path d="M12 40L38 24H88L62 40Z" fill="#e8b86a"/>` +
    `<path d="M12 40H62V88H12Z" fill="#d9a55b"/>` +
    `<path d="M62 40L88 24V72L62 88Z" fill="#b5793a"/>` +
    `<path d="M32 40L58 24H68L42 40Z" fill="#f5e6c8"/><path d="M32 40H42V56H32Z" fill="#f5e6c8"/>`,
  풍선:
    `<path d="M50 72C44 80 56 84 50 92" stroke-width="2.5"/>` +
    `<path d="M50 66L45 74H55Z" fill="#c9412e"/>` +
    `<ellipse cx="50" cy="38" rx="27" ry="31" fill="#e8553d"/>` +
    `<path d="M34 24C37 18 42 15 47 14" stroke="#fff" stroke-width="4"/>`,
  인형:
    `<circle cx="31" cy="20" r="10" fill="#c98b4f"/><circle cx="69" cy="20" r="10" fill="#c98b4f"/>` +
    `<circle cx="31" cy="20" r="5" fill="#f5d6a8" stroke="none"/><circle cx="69" cy="20" r="5" fill="#f5d6a8" stroke="none"/>` +
    `<ellipse cx="22" cy="66" rx="9" ry="12" fill="#c98b4f" transform="rotate(30 22 66)"/><ellipse cx="78" cy="66" rx="9" ry="12" fill="#c98b4f" transform="rotate(-30 78 66)"/>` +
    `<ellipse cx="50" cy="70" rx="23" ry="20" fill="#c98b4f"/>` +
    `<circle cx="35" cy="86" r="9" fill="#c98b4f"/><circle cx="65" cy="86" r="9" fill="#c98b4f"/>` +
    `<circle cx="35" cy="87" r="4.5" fill="#f5d6a8" stroke="none"/><circle cx="65" cy="87" r="4.5" fill="#f5d6a8" stroke="none"/>` +
    `<rect x="52" y="62" width="14" height="14" rx="2" fill="#7ec8f0" stroke-width="2.5"/><path d="M52 62l14 14M66 62l-14 14" stroke="#fff" stroke-width="2" stroke-dasharray="2.5 2.5"/>` +
    `<path d="M40 64V84" stroke="#8a5a2a" stroke-width="2" stroke-dasharray="3 3"/>` +
    `<circle cx="50" cy="36" r="21" fill="#c98b4f"/>` +
    `<ellipse cx="50" cy="44" rx="10" ry="8" fill="#f5d6a8"/>` +
    dot(50, 40, 3.2) +
    `<path d="M50 42V46M46 48q4 2 8 0" stroke-width="2.5"/>` +
    `<circle cx="41" cy="32" r="4" fill="${INK}" stroke="none"/><circle cx="59" cy="32" r="4" fill="${INK}" stroke="none"/>` +
    dot(42, 31, 1.3, '#fff') +
    dot(60, 31, 1.3, '#fff') +
    `<path d="M50 56L40 51V61Z" fill="#e8553d" stroke-width="2.5"/><path d="M50 56L60 51V61Z" fill="#e8553d" stroke-width="2.5"/>` +
    dot(50, 56, 3, '#e8553d'),
  퍼즐:
    `<path d="M14 14H50V27A6.5 6.5 0 1 1 50 37V50H37A6.5 6.5 0 1 1 27 50H14Z" fill="#e8553d" transform="translate(-3 -3)"/>` +
    `<path d="M50 14H86V50H73A6.5 6.5 0 1 0 63 50H50V37A6.5 6.5 0 1 0 50 27Z" fill="#3b78e6" transform="translate(3 -3)"/>` +
    `<path d="M14 50H27A6.5 6.5 0 1 0 37 50H50V63A6.5 6.5 0 1 0 50 73V86H14Z" fill="#ffd23f" transform="translate(-3 3)"/>` +
    `<path d="M50 50H63A6.5 6.5 0 1 1 73 50H86V86H50V73A6.5 6.5 0 1 1 50 63Z" fill="#43b04a" transform="translate(3 3)"/>`,
  북:
    `<path d="M14 42V78C14 94 86 94 86 78V42Z" fill="#e8553d"/>` +
    `<path d="M16 50L28 80L40 52L50 84L60 52L72 80L84 50" stroke="#ffd23f" stroke-width="3.5"/>` +
    `<ellipse cx="50" cy="42" rx="36" ry="12" fill="#fff2d6"/>` +
    tube('M10 8L34 34', '#c98b4f', 5) +
    `<circle cx="36" cy="36" r="5.5" fill="#fff"/>` +
    tube('M90 8L66 34', '#c98b4f', 5) +
    `<circle cx="64" cy="36" r="5.5" fill="#fff"/>`,
  피아노:
    `<rect x="6" y="14" width="88" height="24" rx="4" fill="#3b4a6b"/>` +
    `<rect x="8" y="36" width="84" height="50" rx="2" fill="#fff"/>` +
    `<path d="M20 36V86M32 36V86M44 36V86M56 36V86M68 36V86M80 36V86" stroke-width="2.5"/>` +
    [20, 32, 56, 68, 80].map((x) => `<rect x="${x - 4}" y="36" width="8" height="28" rx="1.5" fill="${INK}" stroke-width="2"/>`).join('') +
    `<path d="M14 24H86" stroke="#8a96b0" stroke-width="3"/>`,
  기타:
    `<g transform="rotate(35 50 50) translate(0 1)">` +
    `<rect x="46" y="12" width="8" height="40" fill="#9a5b2e"/>` +
    `<rect x="42" y="3" width="16" height="14" rx="3" fill="#6b3e26"/>` +
    `<g fill="#e8862e"><circle cx="50" cy="54" r="14" stroke-width="7"/><circle cx="50" cy="74" r="18" stroke-width="7"/><circle cx="50" cy="54" r="14" stroke="none"/><circle cx="50" cy="74" r="18" stroke="none"/></g>` +
    `<rect x="46" y="40" width="8" height="18" fill="#9a5b2e"/>` +
    dot(50, 62, 6, INK) +
    `<rect x="41" y="78" width="18" height="5" rx="2" fill="#6b3e26" stroke-width="2.5"/>` +
    `<path d="M48 8V80M52 8V80" stroke="#fff7e0" stroke-width="1.5"/>` +
    `</g>`,
  나팔:
    tube('M26 56C26 76 60 76 60 56', '#ffd23f', 6) +
    `<rect x="31" y="34" width="7" height="14" rx="2" fill="#ffd23f"/><rect x="43" y="34" width="7" height="14" rx="2" fill="#ffd23f"/>` +
    `<path d="M8 44L18 47V55L8 58Z" fill="#f2c14e"/>` +
    `<rect x="16" y="46" width="48" height="10" rx="2" fill="#ffd23f"/>` +
    `<path d="M60 45C70 43 78 32 86 22V80C78 70 70 59 60 57Z" fill="#ffd23f"/>` +
    `<ellipse cx="86" cy="51" rx="6" ry="29" fill="#f2c14e"/>` +
    `<path d="M66 50C72 47 76 42 80 36" stroke="#fff5c0" stroke-width="3"/>`,
  옷:
    `<path d="M34 14L20 20L6 38L19 50L27 42V88H73V42L81 50L94 38L80 20L66 14C62 22 38 22 34 14Z" fill="#43b04a"/>` +
    `<path d="M34 14C38 22 62 22 66 14" stroke-width="4"/>` +
    `<path d="M27 58H73" stroke="#ffd23f" stroke-width="7"/>`,
  치마:
    `<path d="M30 28H70L88 80C64 88 36 88 12 80Z" fill="#e85d9a"/>` +
    `<path d="M40 30L32 84M50 30V86M60 30L68 84" stroke="#ff9aa8" stroke-width="3.5"/>` +
    `<rect x="28" y="18" width="44" height="12" rx="3" fill="#c23f7c"/>`,
  단추:
    `<circle cx="33" cy="42" r="24" fill="#3b78e6"/><circle cx="33" cy="42" r="17" stroke="#2a58b0" stroke-width="3"/>` +
    dot(27, 36, 3.5) +
    dot(39, 36, 3.5) +
    dot(27, 48, 3.5) +
    dot(39, 48, 3.5) +
    `<circle cx="68" cy="66" r="20" fill="#ffd23f"/><circle cx="68" cy="66" r="14" stroke="#e0a800" stroke-width="3"/>` +
    dot(63, 66, 3.5) +
    dot(73, 66, 3.5) +
    `<path d="M63 66H73" stroke="#e8553d" stroke-width="3"/>`,
  목도리:
    `<rect x="26" y="44" width="18" height="38" fill="#e8553d"/><path d="M26 58H44M26 70H44" stroke="#fff" stroke-width="5"/>` +
    `<path d="M29 83V90M35 83V90M41 83V90" stroke-width="3"/>` +
    `<path d="M14 34C14 20 86 20 86 34C86 50 68 56 50 56S14 50 14 34Z" fill="#e8553d"/>` +
    `<path d="M28 32C28 26 72 26 72 32C72 38 62 40 50 40S28 38 28 32Z" fill="#fff7e0"/>` +
    `<path d="M34 42L32 54M66 42L68 54" stroke="#fff" stroke-width="5"/>` +
    `<rect x="54" y="46" width="20" height="38" fill="#e8553d" transform="rotate(-8 64 46)"/>` +
    `<path d="M54 60H74M54 72H74" stroke="#fff" stroke-width="5" transform="rotate(-8 64 46)"/>` +
    `<path d="M57 85V92M63 85V92M69 85V92" stroke-width="3" transform="rotate(-8 64 46)"/>`,
  잠옷:
    `<path d="M32 52H68L72 94H54L50 66L46 94H28Z" fill="#8fb3f0"/>` +
    `<path d="M36 8L22 14L8 46L20 50L28 34V60H72V34L80 50L92 46L78 14L64 8C60 16 40 16 36 8Z" fill="#8fb3f0"/>` +
    `<path d="M36 8L44 18L50 12L56 18L64 8" fill="#fff" stroke-width="3"/>` +
    `<path d="M50 14V60" stroke-width="2.5"/>` +
    dot(50, 28, 2.3, '#fff') +
    dot(50, 40, 2.3, '#fff') +
    dot(50, 52, 2.3, '#fff') +
    star5(38, 32, 6) +
    star5(62, 44, 6) +
    star5(20, 40, 4.5) +
    star5(37, 78, 5) +
    star5(62, 82, 5) +
    `<path d="M68 22A7 7 0 1 0 74 32A5.5 5.5 0 1 1 68 22Z" fill="#ffd23f" stroke-width="2"/>`,
  운동화: sneaker('translate(18 8) scale(.85)') + sneaker('translate(5 42) scale(.95)'),
  장화: boot('translate(42 8) scale(.9)') + boot('translate(12 14) scale(.9)'),
  구두: dressShoe('translate(20 22) scale(.85)') + dressShoe('translate(6 50)'),
  반지:
    `<ellipse cx="50" cy="64" rx="28" ry="24" fill="#ffd23f"/><ellipse cx="50" cy="66" rx="19" ry="15" fill="#fff7e0"/>` +
    `<path d="M42 40H58L56 46H44Z" fill="#f2c14e"/>` +
    `<path d="M34 26L42 14H58L66 26L50 44Z" fill="#7ec8f0"/><path d="M34 26H66M42 14L50 44M58 14L50 44" stroke-width="2"/>` +
    `<path d="M44 18L41 23" stroke="#fff" stroke-width="3"/>` +
    sparkle(20, 22, 7) +
    sparkle(82, 30, 6),
  목걸이:
    `<path d="M${pearls[0][0]} ${pearls[0][1]}L50 8L${pearls[14][0]} ${pearls[14][1]}" stroke-width="2.5"/>` +
    pearls.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#fff" stroke-width="2.5"/>`).join('') +
    `<path d="M50 82C42 72 42 66 45 64C47 62 50 64 50 66C50 64 53 62 55 64C58 66 58 72 50 82Z" fill="#ff9aa8" stroke-width="2.5"/>`,
  왕관:
    `<path d="M14 76L16 30L33 50L50 22L67 50L84 30L86 76Z" fill="#ffd23f"/>` +
    `<rect x="12" y="68" width="76" height="16" rx="3" fill="#f2c14e"/>` +
    `<circle cx="16" cy="28" r="5" fill="#ffd23f"/><circle cx="50" cy="19" r="5" fill="#ffd23f"/><circle cx="84" cy="28" r="5" fill="#ffd23f"/>` +
    `<circle cx="50" cy="76" r="5" fill="#e8553d" stroke-width="2.5"/><circle cx="30" cy="76" r="4" fill="#3b78e6" stroke-width="2.5"/><circle cx="70" cy="76" r="4" fill="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M50 40L55 50L50 60L45 50Z" fill="#e8553d" stroke-width="2.5"/>`,
  리본:
    `<path d="M45 54L32 86L40 82L44 90L53 58Z" fill="#e85d9a"/><path d="M55 54L68 86L60 82L56 90L47 58Z" fill="#e85d9a"/>` +
    `<path d="M50 48C36 26 8 24 8 48C8 72 36 70 50 48Z" fill="#ff9aa8"/>` +
    `<path d="M50 48C64 26 92 24 92 48C92 72 64 70 50 48Z" fill="#ff9aa8"/>` +
    `<path d="M40 44C32 36 22 36 18 42M60 44C68 36 78 36 82 42" stroke="#e85d9a" stroke-width="3"/>` +
    `<rect x="42" y="39" width="16" height="18" rx="6" fill="#e85d9a"/>`,
  그네:
    `<path d="M6 94H94" stroke="#43b04a" stroke-width="5"/>` +
    `<path d="M38 18V64M62 18V64" stroke-width="3"/>` +
    tube('M16 14L7 92M16 14L27 92', '#3b78e6', 5) +
    tube('M84 14L73 92M84 14L93 92', '#3b78e6', 5) +
    tube('M14 14H86', '#3b78e6', 5) +
    `<rect x="30" y="62" width="40" height="9" rx="3" fill="#e8553d"/>`,
  미끄럼틀:
    `<path d="M6 94H94" stroke="#43b04a" stroke-width="5"/>` +
    tube('M16 92L24 26M34 92L40 26', '#3b78e6', 4) +
    `<path d="M18 78H33M20 62H35M22 46H37" stroke-width="4"/>` +
    tube('M64 60V92', '#3b78e6', 4) +
    `<path d="M22 24H42C62 24 64 74 92 78V88C56 84 54 34 40 34H22Z" fill="#ffd23f"/>` +
    `<path d="M42 30C58 30 62 72 91 83" stroke="#fff5c0" stroke-width="3"/>` +
    tube('M22 24V12H40V24', '#e8553d', 4),
};
