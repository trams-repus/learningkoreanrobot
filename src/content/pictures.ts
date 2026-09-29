// 단어 그림: 들은 단어의 뜻을 보여 주는 그림 (2026-09-28 사용자 요청: "달이면 달그림, 빠르다면 빠른 걸 보여주는 그림").
// - 직접 그린 SVG. 이모지는 휴대폰마다 모양이 달라서 쓰지 않는다.
// - 뜻만 보여 준다: 글자(한글)·자모·철자 순서가 드러나는 요소는 넣지 않는다 (tests/pictures.test.ts가 검사).
// - 단어 데이터(vocab.ts)의 pictureId(p_단어)로 찾는다. 그림이 없는 단어는 그림 칸을 비워 둔다.
// - 어휘 전체(4~6세, 7~8세)에 그림이 있다. 누나·오빠·언니·동생·이모·삼촌·사촌처럼 한 사람만으로는
//   구별되지 않는 가족 호칭은 "누구 옆의 누구"로 그리고 가리키는 사람 뒤에 노란 빛을 둔다.
// 좌표는 모두 viewBox 0 0 100 100 기준.

import { INK, SKIN, HL, blob, ring, dot, drop, cheeks, face, stick, person, halo, torso, moodFace, sparkle, tube, svgFor } from './pictureKit.ts';
import { PICS as L1_ANIMALS } from './pictures/l1-animals.ts';
import { PICS as L1_FOOD } from './pictures/l1-food.ts';
import { PICS as L1_THINGS } from './pictures/l1-things.ts';
import { PICS as L1_PLACES } from './pictures/l1-places.ts';
import { PICS as L1_NATURE } from './pictures/l1-nature.ts';
import { PICS as L1_ACTIONS } from './pictures/l1-actions.ts';
import { REGISTERED_PICS } from './pictureIndex.ts';

const PICTURES: Record<string, string> = {
  수박:
    `<path d="M8 32h84a42 42 0 0 1-84 0z" fill="#3a9e47"/><path d="M15 32h70a35 35 0 0 1-70 0z" fill="#ff5c70" stroke="none"/><path d="M8 32h84"/>` +
    `<g fill="${INK}" stroke="none"><ellipse cx="33" cy="44" rx="2.4" ry="3.8"/><ellipse cx="50" cy="50" rx="2.4" ry="3.8"/><ellipse cx="67" cy="44" rx="2.4" ry="3.8"/><ellipse cx="41" cy="58" rx="2.4" ry="3.8"/><ellipse cx="59" cy="58" rx="2.4" ry="3.8"/></g>`,
  나무:
    `<path d="M44 90L46 56H54L56 90Z" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [50, 32, 22],
      [31, 46, 15],
      [69, 46, 15],
      [50, 52, 17],
    ]),
  바다:
    `<circle cx="78" cy="22" r="10" fill="#ffd23f"/>` +
    `<path d="M50 50V20"/><path d="M53 22L70 46H53Z" fill="#fff"/><path d="M34 50H66L60 60H40Z" fill="#e8553d"/>` +
    `<path d="M0 58q8-7 16 0t17 0t17 0t17 0t17 0t16 0V100H0Z" fill="#3b8fe0"/><path d="M0 74q8-7 16 0t17 0t17 0t17 0t17 0t16 0V100H0Z" fill="#2a6fc4"/>`,
  모자:
    `<ellipse cx="50" cy="66" rx="42" ry="12" fill="#f2c14e"/><path d="M28 64C28 34 72 34 72 64Z" fill="#f2c14e"/>` +
    `<path d="M29 56C40 60 60 60 71 56L72 64C60 68 40 68 28 64Z" fill="#e8553d"/>`,
  오이:
    `<path d="M16 72C8 62 18 52 32 46L70 26C84 20 94 30 86 40C80 48 70 52 60 58L32 74C26 77 20 77 16 72Z" fill="#4caf50"/>` +
    `<path d="M28 58L66 38" stroke="#a5e3a0" stroke-width="3"/><path d="M87 36l7-5"/>` +
    [
      [36, 62],
      [50, 54],
      [64, 46],
      [76, 38],
      [44, 68],
      [58, 60],
      [72, 52],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#2e7d32'))
      .join(''),
  우유:
    `<rect x="44" y="12" width="12" height="8" fill="#fff"/><path d="M30 40L44 20H56L70 40Z" fill="#dfe8f5"/>` +
    `<rect x="30" y="40" width="40" height="48" rx="2" fill="#fff"/><rect x="30" y="54" width="40" height="18" fill="#4a90e2"/>` +
    `<path d="M50 57c-4 5-5 8-5 10a5 5 0 0 0 10 0c0-2-1-5-5-10Z" fill="#fff"/>`,
  가방:
    `<path d="M40 24C40 12 60 12 60 24" stroke-width="5"/><rect x="22" y="22" width="56" height="66" rx="16" fill="#e8553d"/>` +
    `<rect x="31" y="54" width="38" height="26" rx="8" fill="#ff8a65"/><path d="M31 62H69"/><rect x="45" y="58" width="10" height="7" rx="2" fill="#ffd23f"/>`,
  아기:
    `<circle cx="50" cy="54" r="30" fill="${SKIN}"/><path d="M50 25c-8-8 4-16 8-8"/>` +
    dot(40, 52) +
    dot(60, 52) +
    cheeks(62, 18) +
    `<ellipse cx="50" cy="70" rx="11" ry="6" fill="#7ec8f0"/><circle cx="50" cy="80" r="5"/>`,
  엄마:
    `<path d="M18 56C16 24 34 14 50 14S84 24 82 56V86H18Z" fill="#6b3e26"/><path d="M24 96C26 80 38 74 50 74S74 80 76 96Z" fill="#e85d9a"/>` +
    `<circle cx="50" cy="50" r="24" fill="${SKIN}"/><path d="M26 46C28 30 40 24 50 26C62 24 74 32 74 46C66 38 58 36 50 38C44 34 34 38 26 46Z" fill="#6b3e26"/>` +
    dot(41, 51) +
    dot(59, 51) +
    `<path d="M44 62q6 5 12 0"/>` +
    cheeks(58, 15),
  아빠:
    `<path d="M22 96C24 80 38 72 50 72S76 80 78 96Z" fill="#3b78e6"/><path d="M50 74L45 80L50 94L55 80Z" fill="#e8553d"/>` +
    `<circle cx="26" cy="50" r="5" fill="${SKIN}"/><circle cx="74" cy="50" r="5" fill="${SKIN}"/><circle cx="50" cy="48" r="24" fill="${SKIN}"/>` +
    `<path d="M26 44C24 24 38 18 50 18S76 24 74 44C70 34 60 30 50 32S30 34 26 44Z" fill="#2f2a26"/>` +
    dot(41, 49) +
    dot(59, 49) +
    `<path d="M43 60q7 5 14 0"/>`,
  다리:
    `<rect x="32" y="26" width="12" height="56" rx="4" fill="${SKIN}"/><rect x="56" y="26" width="12" height="56" rx="4" fill="${SKIN}"/>` +
    `<path d="M28 6H72L74 30H54L50 22L46 30H26Z" fill="#3b78e6"/>` +
    `<path d="M30 80H46V90H22C22 85 25 80 30 80Z" fill="#e8553d"/><path d="M54 80H70C75 80 78 85 78 90H54Z" fill="#e8553d"/>` +
    ring(50, 56, 30, 26),
  집:
    `<rect x="63" y="20" width="10" height="20" fill="#9a5b2e"/><path d="M12 50L50 16L88 50Z" fill="#e8553d"/>` +
    `<rect x="22" y="48" width="56" height="40" fill="#ffe7a8"/><path d="M44 88V72a6 6 0 0 1 12 0V88" fill="#9a5b2e"/>` +
    `<rect x="28" y="56" width="12" height="12" fill="#8fd3ff"/><rect x="60" y="56" width="12" height="12" fill="#8fd3ff"/><path d="M34 56V68M28 62H40M66 56V68M60 62H72" stroke-width="2"/>`,
  바나나:
    `<path d="M22 22L21 14H29L30 22" fill="#8b5a2b"/>` +
    `<path d="M20 26C18 62 44 84 80 74C85 72 85 66 80 67C52 70 34 56 30 26C29 20 21 20 20 26Z" fill="#ffd23f"/>` +
    `<path d="M26 34C28 56 46 70 72 69" stroke="#e0a800" stroke-width="2.5"/>` +
    dot(82, 70, 2.5, '#8b5a2b'),
  머리: face(ring(50, 50, 40, 40)),
  사자:
    blob(
      '#e8862e',
      Array.from({ length: 12 }, (_, k): [number, number, number] => [
        Math.round(50 + 30 * Math.cos((k * Math.PI) / 6)),
        Math.round(52 + 30 * Math.sin((k * Math.PI) / 6)),
        12,
      ]),
    ) +
    `<circle cx="50" cy="52" r="25" fill="#ffc94d"/>` +
    dot(41, 47) +
    dot(59, 47) +
    `<ellipse cx="50" cy="62" rx="11" ry="8" fill="#fff1c7"/><path d="M45 56h10l-5 5z" fill="${INK}"/><path d="M50 61v3M44 66q6 5 12 0"/>`,
  꼬리:
    `<path d="M72 52C84 46 86 32 80 22" stroke-width="13"/><path d="M72 52C84 46 86 32 80 22" stroke="#c98b4f" stroke-width="6"/>` +
    `<rect x="30" y="62" width="9" height="24" rx="3" fill="#c98b4f"/><rect x="61" y="62" width="9" height="24" rx="3" fill="#c98b4f"/>` +
    `<ellipse cx="50" cy="58" rx="26" ry="14" fill="#c98b4f"/><circle cx="24" cy="44" r="13" fill="#c98b4f"/>` +
    `<path d="M18 34C10 36 10 50 16 52Z" fill="#8a5a30"/>` +
    dot(27, 42, 2.8) +
    dot(12, 46, 3) +
    ring(80, 34, 14, 22),
  나비:
    `<path d="M50 50C40 22 12 18 14 38C16 52 34 56 50 50Z" fill="#ff8ac2"/><path d="M50 50C60 22 88 18 86 38C84 52 66 56 50 50Z" fill="#ff8ac2"/>` +
    `<path d="M50 52C36 56 22 70 32 80C40 86 48 70 50 52Z" fill="#ffc94d"/><path d="M50 52C64 56 78 70 68 80C60 86 52 70 50 52Z" fill="#ffc94d"/>` +
    dot(29, 37, 5, '#fff') +
    dot(71, 37, 5, '#fff') +
    `<rect x="46" y="32" width="8" height="42" rx="4" fill="${INK}"/><path d="M48 34C44 24 38 20 33 18M52 34C56 24 62 20 67 18"/>` +
    dot(33, 18, 3) +
    dot(67, 18, 3),
  개미:
    `<path d="M44 58L32 74M47 58L46 80M50 58L62 76M44 52L30 42M50 52L60 40" stroke-width="4"/>` +
    `<path d="M18 38C14 28 10 26 6 26M24 37C24 26 28 22 32 20"/>` +
    `<circle cx="22" cy="46" r="11" fill="#b8452e"/><circle cx="46" cy="54" r="9" fill="#b8452e"/><ellipse cx="72" cy="58" rx="17" ry="14" fill="#b8452e"/>` +
    dot(19, 44, 2.6, '#fff'),
  자다:
    `<rect x="8" y="46" width="84" height="30" rx="14" fill="#fff"/><circle cx="42" cy="52" r="22" fill="${SKIN}"/>` +
    `<path d="M22 46C22 32 34 28 42 30C52 28 62 34 62 46C56 40 48 38 42 40C36 38 28 40 22 46Z" fill="#5a3b24"/>` +
    `<path d="M32 54q4 4 8 0M46 54q4 4 8 0"/><path d="M8 66H92V88C92 92 88 94 84 94H16C12 94 8 92 8 88Z" fill="#7a8fe0"/>` +
    `<path d="M68 14h10l-10 11h10M84 4h7l-7 8h7" stroke="#3b78e6"/>`,
  크다:
    `<path d="M4 88H96"/><circle cx="18" cy="78" r="9" fill="#8fd3ff"/>` +
    dot(15, 77, 1.8) +
    dot(21, 77, 1.8) +
    `<circle cx="62" cy="54" r="32" fill="#8fd3ff"/>` +
    dot(52, 48, 4) +
    dot(72, 48, 4) +
    `<path d="M50 64q12 10 24 0"/><path d="M62 16V6M56 11l6-6 6 6M96 54h-0" stroke="#e8553d" stroke-width="4"/>`,
  코: face(`<path d="M46 56C44 62 43 65 46 67H54C57 65 56 62 54 56Z" fill="#ffb98a"/>` + ring(50, 61, 13, 11)),
  눈:
    `<path d="M24 34L18 26M38 28L35 19M50 26V17M62 28L65 19M76 34L82 26"/>` +
    `<path d="M10 52C28 26 72 26 90 52C72 78 28 78 10 52Z" fill="#fff"/><circle cx="50" cy="52" r="16" fill="#5aa7e8"/>` +
    dot(50, 52, 8) +
    dot(55, 47, 3.5, '#fff'),
  입:
    `<path d="M14 40C30 48 70 48 86 40C80 74 20 74 14 40Z" fill="#c62f3f"/>` +
    `<path d="M22 45C40 51 60 51 78 45L75 53C60 57 40 57 25 53Z" fill="#fff"/>` +
    `<path d="M36 64C40 56 60 56 64 64C58 68 42 68 36 64Z" fill="#ff8aa0" stroke="none"/>`,
  손:
    `<rect x="30" y="18" width="10" height="32" rx="5" fill="${SKIN}"/><rect x="42" y="10" width="10" height="38" rx="5" fill="${SKIN}"/>` +
    `<rect x="54" y="12" width="10" height="36" rx="5" fill="${SKIN}"/><rect x="66" y="22" width="9" height="28" rx="4.5" fill="${SKIN}"/>` +
    `<path d="M30 60C20 54 12 44 16 39C20 35 28 42 34 50Z" fill="${SKIN}"/>` +
    `<path d="M28 44H76V70C76 84 66 90 52 90S28 82 28 70Z" fill="${SKIN}"/>`,
  발:
    `<path d="M36 34C30 50 30 66 34 80C38 92 58 94 64 82C68 72 64 62 66 50C68 40 64 32 56 30C48 28 40 28 36 34Z" fill="${SKIN}"/>` +
    [
      [38, 20, 7.5],
      [51, 14, 6],
      [61, 17, 5],
      [69, 23, 4.5],
      [74, 31, 4],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>`)
      .join(''),
  포도:
    `<path d="M50 10V22"/><path d="M52 16C60 6 76 8 76 16C68 22 58 20 52 16Z" fill="#43b04a"/>` +
    [
      [38, 28],
      [50, 26],
      [62, 28],
      [32, 40],
      [44, 40],
      [56, 40],
      [68, 40],
      [38, 52],
      [50, 52],
      [62, 52],
      [44, 64],
      [56, 64],
      [50, 76],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7.5" fill="#8e4fc9"/>`)
      .join(''),
  두부:
    `<ellipse cx="50" cy="74" rx="42" ry="13" fill="#8fd3ff"/><path d="M24 44L50 34L76 44L50 54Z" fill="#fffdf2"/>` +
    `<path d="M24 44V64L50 74V54Z" fill="#efe9d6"/><path d="M76 44V64L50 74V54Z" fill="#e2dbc4"/>`,
  고기:
    `<path d="M62 58L78 76" stroke-width="13"/><path d="M62 58L78 76" stroke="#fff" stroke-width="6"/>` +
    `<circle cx="84" cy="72" r="6" fill="#fff"/><circle cx="76" cy="82" r="6" fill="#fff"/>` +
    `<path d="M18 40C18 22 38 12 54 20C70 28 74 50 64 60C54 70 34 66 24 58C18 52 18 46 18 40Z" fill="#b5653a"/>` +
    `<path d="M30 30C34 26 40 24 46 25" stroke="#e8a070" stroke-width="3"/>`,
  밥:
    blob('#fff', [
      [36, 46, 12],
      [50, 38, 14],
      [64, 46, 12],
      [43, 50, 12],
      [57, 50, 12],
    ]) + `<path d="M14 50H86C86 72 70 88 50 88S14 72 14 50Z" fill="#3b78e6"/><path d="M24 64H76" stroke="#8fd3ff"/>`,
  피자:
    `<path d="M50 90L16 26C36 16 64 16 84 26Z" fill="#ffd23f"/><path d="M16 26C36 16 64 16 84 26L80 34C62 26 38 26 20 34Z" fill="#d98c3a"/>` +
    `<circle cx="50" cy="42" r="7" fill="#e8553d"/><circle cx="38" cy="54" r="5.5" fill="#e8553d"/><circle cx="60" cy="58" r="5.5" fill="#e8553d"/><circle cx="50" cy="74" r="4.5" fill="#e8553d"/>`,
  고양이:
    `<path d="M24 42L26 12L46 28Z" fill="#ffab5c"/><path d="M76 42L74 12L54 28Z" fill="#ffab5c"/>` +
    `<ellipse cx="50" cy="55" rx="31" ry="27" fill="#ffab5c"/><path d="M50 30V38M42 31L44 38M58 31L56 38" stroke="#d9772a"/>` +
    `<g fill="${INK}" stroke="none"><ellipse cx="39" cy="50" rx="3.5" ry="5"/><ellipse cx="61" cy="50" rx="3.5" ry="5"/></g>` +
    `<path d="M46 60h8l-4 4z" fill="#ff7a9c"/><path d="M50 64q-4 5-8 2M50 64q4 5 8 2"/><path d="M14 58H32M16 68L32 64M86 58H68M84 68L68 64" stroke-width="2.5"/>`,
  곰:
    `<circle cx="26" cy="30" r="11" fill="#a0653a"/><circle cx="74" cy="30" r="11" fill="#a0653a"/>` +
    dot(26, 30, 5, '#e0a070') +
    dot(74, 30, 5, '#e0a070') +
    `<circle cx="50" cy="55" r="30" fill="#a0653a"/><ellipse cx="50" cy="65" rx="13" ry="10" fill="#e8c49a"/>` +
    `<ellipse cx="50" cy="60" rx="5" ry="3.5" fill="${INK}"/>` +
    dot(39, 48) +
    dot(61, 48) +
    `<path d="M50 63v5M44 69q6 4 12 0"/>`,
  공룡:
    `<path d="M4 74C22 70 32 56 44 52C48 40 56 26 70 22C82 20 94 26 92 36C90 44 82 44 74 44C72 52 68 58 66 64L70 88H60L56 72L46 74L48 88H38L36 72C24 78 12 78 4 74Z" fill="#5cc26b"/>` +
    `<path d="M50 48l2-9 6 6M58 38l2-9 6 5" fill="#3f9a4d"/>` +
    dot(78, 31, 3) +
    `<path d="M80 40H90"/><path d="M64 54l9 4" stroke-width="4"/>`,
  오리:
    `<path d="M26 58L12 46L22 66Z" fill="#ffd23f"/>` +
    blob('#ffd23f', [
      [40, 64, 20],
      [56, 64, 20],
      [48, 68, 20],
      [66, 36, 15],
    ]) +
    `<path d="M78 32C86 30 94 32 96 36C90 40 82 40 77 38Z" fill="#ff8c1a"/>` +
    dot(68, 32, 3) +
    `<path d="M40 62C48 56 62 58 66 66C58 72 46 72 40 62Z" fill="#ffc400"/>`,
  여우:
    `<path d="M22 42L20 10L44 28Z" fill="#f07a2a"/><path d="M78 42L80 10L56 28Z" fill="#f07a2a"/>` +
    `<path d="M16 42C16 30 32 26 50 26S84 30 84 42C84 58 62 78 50 86C38 78 16 58 16 42Z" fill="#f07a2a"/>` +
    `<path d="M19 47C30 52 42 60 50 84C38 76 20 60 19 47ZM81 47C70 52 58 60 50 84C62 76 80 60 81 47Z" fill="#fff" stroke="none"/>` +
    `<path d="M16 42C16 30 32 26 50 26S84 30 84 42C84 58 62 78 50 86C38 78 16 58 16 42Z"/>` +
    dot(38, 48) +
    dot(62, 48) +
    dot(50, 82, 4),
  하마:
    `<circle cx="28" cy="24" r="7" fill="#9d8fc4"/><circle cx="72" cy="24" r="7" fill="#9d8fc4"/>` +
    `<ellipse cx="50" cy="40" rx="27" ry="21" fill="#9d8fc4"/><ellipse cx="50" cy="66" rx="37" ry="23" fill="#b3a6d9"/>` +
    `<g fill="${INK}" stroke="none"><ellipse cx="37" cy="60" rx="4" ry="5"/><ellipse cx="63" cy="60" rx="4" ry="5"/></g>` +
    dot(40, 34) +
    dot(60, 34) +
    `<path d="M28 76q22 10 44 0"/>`,
  공:
    `<circle cx="50" cy="52" r="34" fill="#fff"/><path d="M50 18C36 30 32 70 50 86C30 82 16 68 16 52S30 22 50 18Z" fill="#e8553d"/>` +
    `<path d="M50 18C64 30 68 70 50 86C70 82 84 68 84 52S70 22 50 18Z" fill="#3b78e6"/><circle cx="50" cy="52" r="34"/>` +
    `<path d="M30 32C34 27 39 24 44 23" stroke="#fff" stroke-width="4"/>`,
  책:
    `<path d="M6 28V86C24 82 40 84 50 92C60 84 76 82 94 86V28Z" fill="#3b78e6"/>` +
    `<path d="M50 28C40 20 22 18 10 22V80C22 76 40 78 50 86Z" fill="#fff"/><path d="M50 28C60 20 78 18 90 22V80C78 76 60 78 50 86Z" fill="#fff"/>` +
    `<path d="M18 36C28 34 36 36 42 40M18 48C28 46 36 48 42 52M18 60C28 58 36 60 42 64M58 40C64 36 72 34 82 36M58 52C64 48 72 46 82 48M58 64C64 60 72 58 82 60" stroke="#9fb3d9" stroke-width="3"/>`,
  신발:
    `<path d="M10 70H90C92 76 88 82 82 82H14C10 82 8 76 10 70Z" fill="#fff"/>` +
    `<path d="M12 70C12 56 16 44 24 40H40C44 48 52 52 62 54C76 56 88 60 90 70Z" fill="#e8553d"/>` +
    `<path d="M44 45l6-4M50 49l6-4M56 52l6-4" stroke-width="3"/><path d="M26 62C38 58 52 60 64 66" stroke="#fff" stroke-width="4"/>`,
  우산:
    `<path d="M50 50V80C50 88 38 88 38 80" stroke-width="5"/><path d="M50 14V7"/>` +
    `<path d="M10 50C10 26 30 14 50 14S90 26 90 50C84 44 76 44 70 50C64 44 56 44 50 50C44 44 36 44 30 50C24 44 16 44 10 50Z" fill="#3b78e6"/>` +
    `<path d="M50 14C40 24 34 36 30 50M50 14C60 24 66 36 70 50M50 14V50" stroke-width="2.5"/>`,
  방:
    `<rect x="8" y="10" width="84" height="58" fill="#ffe7a8"/><path d="M8 68H92L96 92H4Z" fill="#c98b4f"/>` +
    `<rect x="60" y="18" width="24" height="22" fill="#8fd3ff"/><path d="M72 18V40M60 29H84" stroke-width="2"/>` +
    `<rect x="12" y="44" width="8" height="36" rx="3" fill="#9a5b2e"/><rect x="18" y="58" width="46" height="18" rx="3" fill="#e8553d"/>` +
    `<rect x="21" y="51" width="16" height="9" rx="4" fill="#fff"/>`,
  해:
    `<g stroke="#ff9f1a" stroke-width="6">` +
    Array.from({ length: 8 }, (_, k) => {
      const a = (k * Math.PI) / 4;
      const p = (r: number) => `${Math.round(50 + r * Math.cos(a))} ${Math.round(50 + r * Math.sin(a))}`;
      return `<path d="M${p(31)}L${p(43)}"/>`;
    }).join('') +
    `</g><circle cx="50" cy="50" r="24" fill="#ffd23f"/>` +
    dot(42, 46) +
    dot(58, 46) +
    `<path d="M42 57q8 6 16 0"/>`,
  별: `<path d="M50 10L61 37L90 39L67 58L75 88L50 71L25 88L33 58L10 39L39 37Z" fill="#ffd23f"/><path d="M42 34L46 26" stroke="#fff4b0" stroke-width="3"/>`,
  물:
    `<path d="M50 10C40 30 24 46 24 62C24 78 36 90 50 90S76 78 76 62C76 46 60 30 50 10Z" fill="#4aa8f0"/>` +
    `<path d="M35 62C35 70 39 76 45 79" stroke="#bfe6ff" stroke-width="4"/>`,
  가다:
    `<path d="M10 30H2M12 42H4M10 54H2" stroke="#9fb3d9" stroke-width="4"/>` +
    stick(30, 24, 'M0 10L-2 34M0 16L-12 26M0 16L12 24M-2 34L-12 56M-2 34L10 54') +
    `<path d="M52 52H90M78 40L90 52L78 64" stroke="#3b78e6" stroke-width="7"/>`,
  보다:
    `<rect x="42" y="38" width="16" height="16" fill="#3b4a6b"/><circle cx="31" cy="56" r="19" fill="#3b4a6b"/><circle cx="69" cy="56" r="19" fill="#3b4a6b"/>` +
    `<circle cx="31" cy="56" r="11" fill="#8fd3ff"/><circle cx="69" cy="56" r="11" fill="#8fd3ff"/>` +
    dot(27, 52, 3, '#fff') +
    dot(65, 52, 3, '#fff') +
    `<path d="M24 26L18 14M50 22V10M76 26L82 14" stroke="${HL}" stroke-width="4"/>`,
  아프다:
    `<circle cx="50" cy="54" r="30" fill="${SKIN}"/><path d="M20 50C19 28 35 22 50 22S81 28 80 50C74 42 62 38 50 38S26 42 20 50Z" fill="#5a3b24"/>` +
    `<rect x="30" y="34" width="40" height="11" rx="3" fill="#fff" transform="rotate(-10 50 40)"/><path d="M50 36v8M46 40h8" stroke="#e8553d" stroke-width="2.5"/>` +
    `<path d="M36 56q4-3 8 0M56 56q4-3 8 0"/><path d="M42 72q8-6 16 0"/>` +
    `<path d="M56 70L82 58" stroke-width="7"/><path d="M56 70L82 58" stroke="#fff" stroke-width="3"/>` +
    dot(83, 58, 4.5, '#e8553d'),
  이마: face(ring(50, 42, 16, 7)),
  허리:
    `<path d="M36 30L22 52M64 30L78 52" stroke-width="5"/><circle cx="50" cy="15" r="10" fill="${SKIN}"/>` +
    `<path d="M36 26H64L62 58H38Z" fill="#3b78e6"/><path d="M38 64H62L64 92H53L50 72L47 92H36Z" fill="#2f3f66"/>` +
    `<rect x="36" y="56" width="28" height="8" fill="#9a5b2e"/><rect x="47" y="57" width="6" height="6" fill="#ffd23f" stroke-width="2"/>` +
    ring(50, 60, 26, 11),
  빵:
    `<path d="M22 46C12 46 12 22 30 20C38 12 62 12 70 20C88 22 88 46 78 46V86H22Z" fill="#c9782f"/>` +
    `<path d="M28 48C20 46 20 28 34 26C40 20 60 20 66 26C80 28 80 46 72 48V80H28Z" fill="#ffe2a8" stroke="none"/>`,
  토마토:
    `<circle cx="50" cy="56" r="32" fill="#e8403a"/><path d="M50 26V16"/>` +
    `<path d="M50 23L56 30L66 28L59 35L63 42L50 37L37 42L41 35L34 28L44 30Z" fill="#43b04a"/>` +
    `<path d="M29 50C31 42 37 36 43 34" stroke="#ff9a8a" stroke-width="4"/>`,
  고구마:
    `<path d="M14 60L4 64M86 52L96 47"/>` +
    `<path d="M12 60C18 42 40 34 60 36C78 38 90 46 88 56C86 66 70 72 50 72C34 72 22 70 12 60Z" fill="#b0476f"/>` +
    `<path d="M34 50l5 2M52 46l5 2M66 56l5 2M42 62l5 1" stroke="#7a2d4c" stroke-width="3"/>`,
  치즈:
    `<path d="M12 46L68 24L90 42Z" fill="#ffe066"/><path d="M12 46L90 42V74L12 80Z" fill="#ffd23f"/>` +
    `<g fill="#e0a800" stroke="none"><ellipse cx="30" cy="60" rx="6" ry="5"/><ellipse cx="56" cy="64" rx="5" ry="4"/><ellipse cx="76" cy="54" rx="4" ry="4"/><ellipse cx="44" cy="72" rx="3" ry="2"/></g>`,
  기린:
    `<path d="M58 14V5M66 13V4"/>` +
    dot(58, 5, 3, '#b5672a') +
    dot(66, 4, 3, '#b5672a') +
    `<path d="M34 96L36 52C36 40 44 24 54 18C60 12 70 12 76 16L84 22C86 26 82 30 78 28H66C58 34 54 44 52 54L54 96Z" fill="#f5c04a"/>` +
    `<g fill="#b5672a" stroke="none"><circle cx="44" cy="78" r="5"/><circle cx="46" cy="62" r="4.5"/><circle cx="48" cy="44" r="4"/><circle cx="56" cy="30" r="3.5"/></g>` +
    dot(70, 20, 2.8),
  코끼리:
    `<ellipse cx="22" cy="46" rx="18" ry="24" fill="#9fb0c8"/><ellipse cx="78" cy="46" rx="18" ry="24" fill="#9fb0c8"/>` +
    `<circle cx="50" cy="44" r="24" fill="#b8c6da"/><path d="M44 58C44 74 46 84 54 88C60 90 64 86 60 82C56 80 56 72 56 58Z" fill="#b8c6da"/>` +
    `<path d="M40 60C37 66 39 71 44 71ZM60 60C63 66 61 71 56 71Z" fill="#fff"/>` +
    dot(42, 40) +
    dot(58, 40),
  개구리:
    `<circle cx="32" cy="32" r="13" fill="#5cc26b"/><circle cx="68" cy="32" r="13" fill="#5cc26b"/><ellipse cx="50" cy="58" rx="38" ry="28" fill="#5cc26b"/>` +
    `<circle cx="32" cy="29" r="7" fill="#fff"/><circle cx="68" cy="29" r="7" fill="#fff"/>` +
    dot(32, 30, 3.5) +
    dot(68, 30, 3.5) +
    `<path d="M24 60C36 72 64 72 76 60"/>` +
    cheeks(58, 30),
  고래:
    `<path d="M40 30C40 22 36 16 30 14M40 30C40 22 44 16 50 14M40 30V14" stroke="#4aa8f0" stroke-width="4"/>` +
    `<path d="M82 56C88 48 92 40 96 36C96 46 94 52 90 56C94 60 96 66 96 74C92 70 88 64 82 60Z" fill="#3b8fe0"/>` +
    `<path d="M8 56C8 36 34 28 56 32C74 36 84 48 84 58C84 72 64 80 42 80C24 80 8 72 8 56Z" fill="#3b8fe0"/>` +
    `<path d="M16 66C28 74 52 76 70 70" stroke="#bfe6ff" stroke-width="4"/>` +
    dot(26, 52, 3) +
    `<path d="M12 60q6 4 12 2"/>`,
  비누:
    `<rect x="14" y="48" width="62" height="34" rx="12" fill="#ff9ec4"/><path d="M24 56H54" stroke="#ffd1e3" stroke-width="4"/>` +
    `<g fill="#e6f6ff" stroke="#7ec8f0" stroke-width="3"><circle cx="72" cy="34" r="10"/><circle cx="87" cy="52" r="6"/><circle cx="58" cy="24" r="6"/><circle cx="86" cy="18" r="5"/></g>`,
  바지:
    `<path d="M28 12H72L78 90H56L50 38L44 90H22Z" fill="#3b6fd9"/><path d="M28 12H72V22H28Z" fill="#2f58b8"/><path d="M50 22V36"/>`,
  양말:
    `<path d="M50 10H72V50L84 58C92 64 88 78 78 78C72 78 66 74 60 70L50 62C47 60 50 56 50 52Z" fill="#8fd3ff"/>` +
    `<path d="M20 16H44V56L58 66C66 72 62 86 52 86C46 86 40 82 34 78L24 70C20 67 20 64 20 60Z" fill="#fff"/>` +
    `<path d="M20 26H44M20 34H44" stroke="#e8553d" stroke-width="4"/>`,
  베개:
    `<path d="M12 30C30 38 70 38 88 30C80 44 80 62 88 76C70 68 30 68 12 76C20 62 20 44 12 30Z" fill="#e7f0ff"/>` +
    `<path d="M30 46q4 4 8 0M50 50q4 4 8 0M40 58q4 4 8 0M62 44q4 4 8 0" stroke="#9fb3d9" stroke-width="3"/>`,
  로봇:
    `<path d="M50 16V9"/>` +
    dot(50, 7, 4.5, '#e8553d') +
    `<path d="M26 58L16 72M74 58L84 72" stroke-width="5"/><rect x="44" y="44" width="12" height="8" fill="#7a8aa6"/>` +
    `<rect x="30" y="16" width="40" height="30" rx="6" fill="#b8c6da"/><circle cx="42" cy="30" r="5" fill="#8fd3ff"/><circle cx="58" cy="30" r="5" fill="#8fd3ff"/><path d="M42 39H58"/>` +
    `<rect x="26" y="50" width="48" height="34" rx="6" fill="#3b78e6"/><rect x="40" y="58" width="20" height="12" rx="3" fill="#ffd23f"/>`,
  길:
    `<rect x="4" y="30" width="92" height="64" fill="#8fd67a" stroke="none"/><path d="M4 30H96"/>` +
    `<path d="M42 30H58L90 94H10Z" fill="#8a8f99"/><path d="M50 36V44M50 52V62M50 72V86" stroke="#fff" stroke-width="4"/>`,
  가게:
    `<rect x="30" y="14" width="40" height="12" rx="3" fill="#fff"/><rect x="14" y="30" width="72" height="58" fill="#ffe7a8"/>` +
    `<path d="M10 30H90L86 44H14Z" fill="#e8553d"/><path d="M26 31L24 43M42 31L41 43M58 31L59 43M74 31L76 43" stroke="#fff" stroke-width="5"/>` +
    `<path d="M14 44q6 7 12 0q6 7 12 0q6 7 12 0q6 7 12 0q6 7 12 0q6 7 12 0" fill="#e8553d"/>` +
    `<rect x="20" y="56" width="30" height="22" fill="#8fd3ff"/><circle cx="29" cy="72" r="4" fill="#e8403a"/><circle cx="40" cy="72" r="4" fill="#ffd23f"/>` +
    `<rect x="58" y="56" width="20" height="32" fill="#9a5b2e"/>`,
  달:
    `<circle cx="50" cy="50" r="42" fill="#23306b"/><circle cx="46" cy="50" r="28" fill="#ffd23f"/><circle cx="60" cy="42" r="24" fill="#23306b"/>`,
  비:
    blob('#c9d3e6', [
      [32, 36, 15],
      [50, 28, 19],
      [68, 38, 15],
      [50, 42, 15],
    ]) +
    drop(30, 62) +
    drop(50, 70) +
    drop(70, 62) +
    drop(40, 82, 0.8) +
    drop(62, 84, 0.8),
  무지개:
    ['#e8403a', '#ff9f1a', '#ffd23f', '#43b04a', '#3b78e6']
      .map((c, i) => {
        const r = 38 - i * 7;
        return `<path d="M${50 - r} 78A${r} ${r} 0 0 1 ${50 + r} 78" stroke="${c}" stroke-width="7.5"/>`;
      })
      .join('') +
    `<path d="M8.5 78A41.5 41.5 0 0 1 91.5 78M43.5 78A6.5 6.5 0 0 1 56.5 78" stroke-width="3"/>` +
    blob('#fff', [
      [12, 80, 9],
      [24, 82, 8],
    ]) +
    blob('#fff', [
      [76, 82, 8],
      [88, 80, 9],
    ]),
  오다:
    stick(76, 24, 'M0 10L0 32M0 16L-10 26M0 16L10 26M0 32L-8 50M0 32L8 50', 0.55) +
    `<path d="M68 48C60 58 52 62 44 64" stroke="#3b78e6" stroke-width="5" stroke-dasharray="6 5"/><path d="M50 56L42 65L53 69" stroke="#3b78e6" stroke-width="5"/>` +
    stick(28, 40, 'M0 10L0 34M0 16L-12 28M0 16L12 26M0 34L-9 54M0 34L9 54', 1.05),
  놀다:
    `<ellipse cx="40" cy="90" rx="14" ry="3" fill="#d0d6e6" stroke="none"/>` +
    stick(40, 22, 'M0 10L0 34M0 16L-13 2M0 16L13 4M0 34L-10 46L-6 56M0 34L10 44L8 56') +
    `<circle cx="74" cy="30" r="11" fill="#e8553d"/><path d="M65 26C70 30 78 30 83 26M74 19V41" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M20 12l-5-5M16 22h-7M60 12l4-5" stroke="${HL}" stroke-width="4"/>`,
  느리다:
    `<path d="M90 82H96" stroke="#9fb3d9" stroke-width="4"/>` +
    `<path d="M14 76C14 66 22 64 30 66L34 72H80C86 72 88 78 84 80H18C16 80 14 78 14 76Z" fill="#b8e07a"/>` +
    `<path d="M22 66C20 58 22 52 26 50M24 52L20 40M28 52L30 40"/>` +
    dot(20, 39, 3) +
    dot(30, 39, 3) +
    `<circle cx="58" cy="52" r="22" fill="#ffab5c"/><path d="M58 52m0-4a4 4 0 1 1-4 4a8 8 0 1 1 8 8a12 12 0 1 1-12-12" stroke-width="3"/>` +
    `<path d="M88 76h2M93 76h2" stroke="#9fb3d9" stroke-width="4"/>`,
  빠르다:
    `<path d="M4 44H22M8 56H24M4 68H20" stroke="#3b78e6" stroke-width="5"/>` +
    `<path d="M26 68C26 58 34 54 44 52L54 42C58 38 66 38 72 40L82 52C90 54 94 60 94 68Z" fill="#e8553d"/>` +
    `<path d="M57 44C61 42 66 42 70 44L76 52H52Z" fill="#8fd3ff"/>` +
    `<circle cx="42" cy="70" r="9" fill="${INK}"/><circle cx="80" cy="70" r="9" fill="${INK}"/>` +
    dot(42, 70, 3.5, '#fff') +
    dot(80, 70, 3.5, '#fff'),
  // ── 가족 호칭: 누구 옆의 누구인지로 보여 준다 (가리키는 사람 뒤에 노란 빛) ──
  누나: halo(64, 94, 1.35) + person(64, 94, 1.35, { hair: '#3a2418', style: 'long', shirt: '#e85d9a' }) + person(26, 94, 0.85, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }),
  오빠: halo(64, 94, 1.35) + person(64, 94, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) + person(26, 94, 0.85, { hair: '#5a3b24', style: 'pony', shirt: '#ffc933' }),
  언니: halo(64, 94, 1.35) + person(64, 94, 1.35, { hair: '#3a2418', style: 'long', shirt: '#8e4fc9' }) + person(26, 94, 0.85, { hair: '#5a3b24', style: 'pony', shirt: '#ffc933' }),
  동생: halo(72, 94, 0.85) + person(32, 94, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) + person(72, 94, 0.85, { hair: '#5a3b24', style: 'short', shirt: '#ff9f1a' }),
  이모:
    person(22, 94, 1.15, { hair: '#6b3e26', style: 'long', shirt: '#e85d9a' }) +
    person(49, 94, 0.72, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    halo(78, 94, 1.15) +
    person(78, 94, 1.15, { hair: '#6b3e26', style: 'long', shirt: '#ff9f1a' }),
  삼촌:
    person(22, 94, 1.15, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    person(49, 94, 0.72, { hair: '#5a3b24', style: 'pony', shirt: '#ffc933' }) +
    halo(78, 94, 1.15) +
    person(78, 94, 1.15, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }),
  사촌:
    person(28, 66, 0.95, { hair: '#6b3e26', style: 'long', shirt: '#e85d9a' }) +
    person(72, 66, 0.95, { hair: '#6b3e26', style: 'long', shirt: '#ff9f1a' }) +
    person(28, 96, 0.8, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    halo(72, 96, 0.8) +
    person(72, 96, 0.8, { hair: '#5a3b24', style: 'pony', shirt: '#43b04a' }),
  가족:
    `<path d="M50 22C46 14 36 16 38 24C40 30 50 34 50 34S60 30 62 24C64 16 54 14 50 22Z" fill="#ff5c70"/>` +
    person(18, 96, 1.1, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    person(82, 96, 1.1, { hair: '#6b3e26', style: 'long', shirt: '#e85d9a' }) +
    person(40, 96, 0.72, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a' }) +
    person(61, 96, 0.72, { hair: '#5a3b24', style: 'pony', shirt: '#ffc933' }),
  친구:
    `<path d="M40 80Q50 72 60 80" stroke-width="10"/><path d="M40 80Q50 72 60 80" stroke="${SKIN}" stroke-width="5"/>` +
    person(30, 96, 1.05, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    person(70, 96, 1.05, { hair: '#5a3b24', style: 'pony', shirt: '#43b04a' }) +
    sparkle(50, 22, 8) +
    sparkle(36, 12, 5) +
    sparkle(64, 12, 5),
  할머니: person(50, 96, 1.7, { hair: '#c9c9d1', style: 'bun', shirt: '#8e4fc9', glasses: true }),
  할아버지:
    tube('M84 96V52C84 44 74 44 74 52', '#9a5b2e', 5) +
    person(46, 96, 1.7, { hair: '#c9c9d1', style: 'bald', shirt: '#6b8e5a', beard: '#eeeef3', glasses: true }),
  아저씨: person(48, 96, 1.7, { hair: '#2f2a26', style: 'short', shirt: '#e8862e', mustache: true, cap: '#3b78e6' }),

  // ── 몸 ──
  어깨: torso(ring(27, 50, 12, 12) + ring(73, 50, 12, 12)),
  가슴: torso(ring(50, 64, 22, 14)),
  얼굴: face(
    `<path d="M14 74C10 64 12 54 20 52C24 56 24 66 22 74Z" fill="${SKIN}"/><path d="M86 74C90 64 88 54 80 52C76 56 76 66 78 74Z" fill="${SKIN}"/>` +
      ring(50, 57, 34, 34),
  ),
  눈썹: face(`<path d="M33 47q7-5 14 0M53 47q7-5 14 0" stroke-width="5"/>` + ring(50, 46, 24, 8)),
  팔:
    `<rect x="4" y="54" width="22" height="24" rx="4" fill="#3b78e6"/>` +
    tube('M26 66H58L66 34', SKIN, 16) +
    `<ellipse cx="44" cy="60" rx="13" ry="9" fill="${SKIN}" stroke="none"/><path d="M34 54C38 48 50 48 54 56"/>` +
    `<circle cx="67" cy="26" r="11" fill="${SKIN}"/><path d="M62 22h8M62 27h8" stroke-width="2.5"/>` +
    ring(50, 50, 32, 34),
  배꼽:
    `<path d="M20 96V58C20 44 32 38 50 38S80 44 80 58V96Z" fill="${SKIN}"/><path d="M20 84H80V96H20Z" fill="#3b78e6"/>` +
    `<path d="M20 60C20 44 32 38 50 38S80 44 80 60L78 62C64 56 36 56 22 62Z" fill="#43b04a"/>` +
    `<circle cx="50" cy="20" r="14" fill="${SKIN}"/><path d="M36 18C36 6 44 4 50 4S64 6 64 18C60 12 56 11 50 11S40 12 36 18Z" fill="#5a3b24"/>` +
    dot(45, 21, 2.2) +
    dot(55, 21, 2.2) +
    `<path d="M46 27q4 3 8 0" stroke-width="2.5"/>` +
    `<path d="M47 72q3-4 6 0q-3 3-6 0" stroke-width="3"/>` +
    ring(50, 72, 12, 9),
  엉덩이:
    `<path d="M36 36L24 56M64 36L76 56" stroke-width="5"/>` +
    `<circle cx="50" cy="18" r="12" fill="#5a3b24"/>` +
    `<path d="M34 32H66L66 60H34Z" fill="#43b04a"/>` +
    `<path d="M32 58H68C74 58 76 66 74 74L70 94H55L51 80L49 80L45 94H30L26 74C24 66 26 58 32 58Z" fill="#3b78e6"/>` +
    `<path d="M50 60V76M50 76C44 82 34 82 30 74M50 76C56 82 66 82 70 74" stroke-width="3"/>` +
    ring(50, 70, 30, 16),

  // ── 음식 ──
  감자:
    `<path d="M16 52C14 34 32 22 52 24C74 26 88 40 84 58C80 74 64 84 46 80C28 78 18 68 16 52Z" fill="#c99a5b"/>` +
    dot(36, 44, 2.6, '#8a6232') +
    dot(60, 38, 2.6, '#8a6232') +
    dot(70, 60, 2.6, '#8a6232') +
    dot(44, 66, 2.6, '#8a6232') +
    `<path d="M28 42C30 36 36 32 42 31" stroke="#e8c894" stroke-width="4"/>`,
  당근:
    `<path d="M26 34C16 24 10 14 14 6C22 12 28 22 32 30Z" fill="#43b04a"/><path d="M33 30C30 18 32 8 40 4C42 14 40 24 37 31Z" fill="#43b04a"/>` +
    `<path d="M24 38C14 36 6 32 4 24C12 24 20 28 27 34Z" fill="#43b04a"/>` +
    `<path d="M22 38C28 28 40 28 46 34L86 84C88 88 84 92 80 90L28 52C20 48 18 42 22 38Z" fill="#ff8c1a"/>` +
    `<path d="M36 48l6-6M52 60l6-5M66 72l5-4" stroke="#d96a00" stroke-width="3"/>`,
  사탕:
    `<path d="M32 50L10 32L14 50L10 68Z" fill="#ff9ec4"/><path d="M68 50L90 32L86 50L90 68Z" fill="#ff9ec4"/>` +
    `<circle cx="50" cy="50" r="21" fill="#ff5c8a"/>` +
    `<path d="M36 36C48 42 52 58 64 64M34 50C42 50 50 58 52 70M48 30C52 40 60 46 70 48" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="50" cy="50" r="21"/>`,
  김치:
    blob('#e8553d', [
      [34, 48, 13],
      [50, 38, 16],
      [66, 48, 13],
      [50, 52, 12],
    ]) +
    `<path d="M36 46q6-9 15-5M54 36q9-2 13 7M44 56q6-4 12 0" stroke="#fff0d0" stroke-width="4"/>` +
    dot(30, 42, 1.6, '#9b1d1d') +
    dot(60, 30, 1.6, '#9b1d1d') +
    dot(70, 52, 1.6, '#9b1d1d') +
    dot(46, 44, 1.6, '#9b1d1d') +
    `<path d="M12 54H88C88 76 72 90 50 90S12 76 12 54Z" fill="#6fb5a0"/><path d="M22 66H78" stroke="#bfe6d8"/>`,
  딸기:
    `<path d="M50 90C30 78 14 60 16 42C18 28 34 24 50 30C66 24 82 28 84 42C86 60 70 78 50 90Z" fill="#e8403a"/>` +
    `<path d="M50 32L36 18L44 30L28 28L42 36L50 40L58 36L72 28L56 30L64 18Z" fill="#43b04a"/><path d="M50 32V16"/>` +
    [
      [36, 48],
      [50, 50],
      [64, 48],
      [42, 62],
      [58, 62],
      [50, 74],
      [28, 44],
      [72, 44],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="2.8" fill="#ffe066" stroke="none"/>`)
      .join(''),
  호박:
    `<path d="M50 30V18C50 12 56 10 60 12" stroke="#6b4a2a" stroke-width="6"/><path d="M54 22C62 12 76 14 78 22C70 26 62 26 54 22Z" fill="#43b04a"/>` +
    `<ellipse cx="30" cy="60" rx="20" ry="27" fill="#ff9f1a"/><ellipse cx="70" cy="60" rx="20" ry="27" fill="#ff9f1a"/><ellipse cx="50" cy="60" rx="20" ry="30" fill="#ffb13d"/>`,
  만두:
    `<ellipse cx="50" cy="80" rx="44" ry="10" fill="#8fd3ff"/>` +
    `<path d="M50 70C50 54 60 44 72 44S94 54 94 70C86 74 58 74 50 70Z" fill="#f5e6c8"/>` +
    `<path d="M8 74C8 52 24 40 40 40S72 52 72 74C62 78 18 78 8 74Z" fill="#fff4e0"/>` +
    `<path d="M26 45q3 6 0 13M40 41v13M54 45q-3 6 0 13M66 48q-2 5 0 10" stroke="#d9c8a8" stroke-width="3"/>`,
  계란:
    `<ellipse cx="28" cy="54" rx="17" ry="23" fill="#fff4e0"/><path d="M20 44C22 38 26 35 30 34" stroke="#fff" stroke-width="4"/>` +
    blob('#fff', [
      [62, 56, 18],
      [78, 62, 12],
      [58, 72, 12],
      [74, 44, 10],
    ]) +
    `<circle cx="66" cy="58" r="10" fill="#ffc933"/><path d="M62 54q3-3 6-2" stroke="#fff4b0" stroke-width="3"/>`,
  고추:
    `<path d="M36 22C44 30 50 50 66 70C74 80 84 86 90 90C74 92 54 84 42 66C32 52 28 36 30 26Z" fill="#e8403a"/>` +
    `<path d="M28 26C30 20 36 18 40 22L36 28Z" fill="#43b04a"/><path d="M33 22C32 14 36 10 42 8" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M16 34C20 42 20 60 30 76C34 82 38 88 40 94C28 92 16 80 12 62C10 50 10 42 12 36Z" fill="#43b04a"/>` +
    `<path d="M10 36C10 30 16 28 18 32L16 38Z" fill="#2f7a34"/>` +
    `<path d="M42 36C46 46 52 56 60 64" stroke="#ff9a8a" stroke-width="3"/>`,
  양파:
    `<path d="M50 14C48 8 50 4 55 2" stroke="#43b04a" stroke-width="5"/>` +
    `<path d="M50 14C46 28 20 38 20 60C20 78 34 88 50 88S80 78 80 60C80 38 54 28 50 14Z" fill="#f0c27a"/>` +
    `<path d="M50 20C40 36 34 60 42 86M50 20C60 36 66 60 58 86M50 22V86" stroke="#c9954a" stroke-width="2.5"/>` +
    `<path d="M44 88l-4 7M50 88v8M56 88l4 7" stroke-width="2.5"/>`,
  햄버거:
    `<path d="M14 72H86C86 82 78 88 68 88H32C22 88 14 82 14 72Z" fill="#e8a24a"/>` +
    `<rect x="12" y="58" width="76" height="14" rx="6" fill="#7a4526"/>` +
    `<path d="M16 58H84L70 66L62 58L50 66Z" fill="#ffd23f"/>` +
    `<path d="M12 54q6-7 12 0t12 0t13 0t13 0t12 0t14 0" stroke="#43b04a" stroke-width="7"/>` +
    `<path d="M14 50C14 28 30 18 50 18S86 28 86 50Z" fill="#e8a24a"/>` +
    `<g fill="#fff" stroke="none"><ellipse cx="36" cy="32" rx="3" ry="1.6"/><ellipse cx="52" cy="28" rx="3" ry="1.6"/><ellipse cx="66" cy="36" rx="3" ry="1.6"/><ellipse cx="44" cy="42" rx="3" ry="1.6"/></g>`,
  김밥: [
    [30, 64],
    [70, 64],
    [50, 32],
  ]
    .map(
      ([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="19" fill="#1f2a24"/><circle cx="${x}" cy="${y}" r="14.5" fill="#fff" stroke="none"/>` +
        `<rect x="${x - 7}" y="${y - 7}" width="6" height="6" fill="#ffd23f" stroke="none"/><rect x="${x + 1}" y="${y - 7}" width="6" height="6" fill="#ff8c1a" stroke="none"/>` +
        `<rect x="${x - 7}" y="${y + 1}" width="6" height="6" fill="#43b04a" stroke="none"/><rect x="${x + 1}" y="${y + 1}" width="6" height="6" fill="#ff7a9c" stroke="none"/>`,
    )
    .join(''),

  // ── 동물 ──
  토끼:
    `<ellipse cx="36" cy="28" rx="9" ry="24" fill="#fff"/><ellipse cx="64" cy="28" rx="9" ry="24" fill="#fff"/>` +
    `<ellipse cx="36" cy="30" rx="4" ry="16" fill="#ffb3c4" stroke="none"/><ellipse cx="64" cy="30" rx="4" ry="16" fill="#ffb3c4" stroke="none"/>` +
    `<circle cx="50" cy="64" r="27" fill="#fff"/>` +
    dot(40, 60) +
    dot(60, 60) +
    `<path d="M46 68h8l-4 4z" fill="#ff7a9c"/><path d="M50 72q-4 5-8 2M50 72q4 5 8 2"/>` +
    cheeks(70, 18),
  거북:
    `<rect x="26" y="62" width="11" height="18" rx="5" fill="#a5d17a"/><rect x="66" y="62" width="11" height="18" rx="5" fill="#a5d17a"/>` +
    `<path d="M84 66L96 70L84 72Z" fill="#a5d17a"/>` +
    `<path d="M20 60C8 60 4 48 12 42C20 38 28 44 30 52Z" fill="#a5d17a"/>` +
    dot(14, 47, 2.8) +
    `<path d="M22 68C22 42 36 30 52 30S84 42 84 68Z" fill="#5c9e4a"/>` +
    `<path d="M38 68L42 50L52 44L62 50L66 68M42 50L28 54M62 50L78 54M52 44V32" stroke="#2f6a2a" stroke-width="3"/>` +
    `<path d="M18 68H88"/>`,
  호랑이:
    `<circle cx="26" cy="30" r="11" fill="#ff9f1a"/><circle cx="74" cy="30" r="11" fill="#ff9f1a"/>` +
    dot(26, 30, 5, '#fff') +
    dot(74, 30, 5, '#fff') +
    `<circle cx="50" cy="56" r="31" fill="#ff9f1a"/>` +
    `<path d="M50 26V36M40 28L43 36M60 28L57 36M19 50h9M20 60h8M81 50h-9M80 60h-8" stroke-width="4.5"/>` +
    `<ellipse cx="50" cy="70" rx="17" ry="12" fill="#fff"/>` +
    dot(39, 50) +
    dot(61, 50) +
    `<path d="M45 62h10l-5 5z" fill="${INK}"/><path d="M50 67v3M43 72q7 5 14 0"/>`,
  강아지:
    `<circle cx="50" cy="54" r="28" fill="#f2d2a0"/>` +
    `<ellipse cx="22" cy="54" rx="10" ry="21" fill="#a0653a" transform="rotate(18 22 54)"/><ellipse cx="78" cy="54" rx="10" ry="21" fill="#a0653a" transform="rotate(-18 78 54)"/>` +
    `<circle cx="61" cy="46" r="9" fill="#c98b4f" stroke="none"/>` +
    dot(40, 48) +
    dot(61, 47) +
    `<ellipse cx="50" cy="61" rx="6" ry="4.5" fill="${INK}"/><path d="M50 65v4M43 70q7 5 14 0"/>` +
    `<path d="M47 71C46 80 54 80 53 71" fill="#ff7a9c"/>`,
  병아리:
    `<path d="M40 84L36 92M40 84L44 92M60 84L56 92M60 84L64 92" stroke="#ff8c1a" stroke-width="4"/>` +
    `<path d="M46 28C44 20 50 18 50 26C52 18 58 20 54 28" fill="#ffe14d"/>` +
    `<circle cx="50" cy="56" r="29" fill="#ffe14d"/>` +
    `<path d="M22 58C14 60 14 70 24 72" fill="#ffd21a"/><path d="M78 58C86 60 86 70 76 72" fill="#ffd21a"/>` +
    dot(40, 50) +
    dot(60, 50) +
    `<path d="M44 57H56L50 65Z" fill="#ff8c1a"/>` +
    cheeks(60, 18),
  사슴:
    `<path d="M38 34C34 24 28 18 22 12M30 24L20 26M28 18L30 8M62 34C66 24 72 18 78 12M70 24L80 26M72 18L70 8" stroke="#8b5a2b" stroke-width="5"/>` +
    `<ellipse cx="24" cy="44" rx="12" ry="6" fill="#c98b4f" transform="rotate(-20 24 44)"/><ellipse cx="76" cy="44" rx="12" ry="6" fill="#c98b4f" transform="rotate(20 76 44)"/>` +
    `<path d="M32 44C32 32 42 30 50 30S68 32 68 44C68 60 60 84 50 86C40 84 32 60 32 44Z" fill="#c98b4f"/>` +
    `<path d="M40 64C44 60 56 60 60 64C60 76 56 84 50 85C44 84 40 76 40 64Z" fill="#f2d7b0" stroke="none"/>` +
    dot(42, 50) +
    dot(58, 50) +
    `<ellipse cx="50" cy="78" rx="5" ry="4" fill="${INK}"/>` +
    dot(38, 38, 2.2, '#fff') +
    dot(60, 36, 2.2, '#fff'),
  너구리:
    `<path d="M22 40L24 16L42 30Z" fill="#9a8f86"/><path d="M78 40L76 16L58 30Z" fill="#9a8f86"/>` +
    `<ellipse cx="50" cy="55" rx="33" ry="29" fill="#9a8f86"/>` +
    `<path d="M20 54C28 40 42 44 50 50C58 44 72 40 80 54C72 64 60 60 50 58C40 60 28 64 20 54Z" fill="#3d3530"/>` +
    dot(38, 52, 3.5, '#fff') +
    dot(62, 52, 3.5, '#fff') +
    `<ellipse cx="50" cy="70" rx="13" ry="10" fill="#eee6dc"/><ellipse cx="50" cy="65" rx="5" ry="3.5" fill="${INK}"/><path d="M50 68v3M45 74q5 3 10 0"/>`,
  오징어:
    [30, 40, 50, 60, 70]
      .map((x, i) => tube(`M${x} 56C${x + (i % 2 ? 6 : -6)} 68 ${x} 76 ${x + (i % 2 ? -4 : 4)} 90`, '#f5a3a3', 5))
      .join('') +
    `<path d="M50 6L80 30L68 34V58H32V34L20 30Z" fill="#f5a3a3"/>` +
    `<circle cx="41" cy="46" r="6" fill="#fff"/><circle cx="59" cy="46" r="6" fill="#fff"/>` +
    dot(42, 47, 3) +
    dot(58, 47, 3),
  달팽이:
    `<path d="M4 88C20 76 60 76 96 86C80 94 24 96 4 88Z" fill="#43b04a"/>` +
    `<path d="M12 80C12 68 18 64 26 64L30 72H78C84 72 86 80 80 82H18C14 82 12 82 12 80Z" fill="#ffd9a0"/>` +
    `<path d="M20 64C18 54 18 46 16 40M26 64C28 54 30 46 32 40"/>` +
    dot(16, 38, 3.5) +
    dot(32, 38, 3.5) +
    `<path d="M16 72q4 3 8 0" stroke-width="2.5"/>` +
    `<circle cx="56" cy="50" r="24" fill="#ff8ac2"/><path d="M56 50m0-5a5 5 0 1 1-5 5a10 10 0 1 1 10 10a15 15 0 1 1-15-15" stroke-width="3"/>`,
  돌고래:
    `<path d="M0 84q8-7 16 0t17 0t17 0t17 0t17 0t16 0V100H0Z" fill="#3b8fe0"/>` +
    `<path d="M20 70L8 64L12 76L6 84L22 78Z" fill="#7ab0d9"/>` +
    `<path d="M48 30L54 14L62 28Z" fill="#7ab0d9"/>` +
    `<path d="M20 74C26 50 44 30 68 26L80 24C86 24 94 28 96 32C90 34 84 34 80 36C76 50 64 60 50 66C40 70 30 72 20 74Z" fill="#7ab0d9"/>` +
    `<path d="M30 66C42 60 56 52 66 42" stroke="#d9ecfa" stroke-width="4"/>` +
    dot(76, 29, 2.8) +
    `<path d="M84 34q-4 3-10 2" stroke-width="2.5"/>`,
  참새:
    `<path d="M24 58L4 50L8 66Z" fill="#8a5a30"/>` +
    `<path d="M44 80V90M54 80V90M40 90h8M50 90h8" stroke-width="3"/>` +
    `<ellipse cx="46" cy="62" rx="26" ry="20" fill="#b07a4a"/><ellipse cx="50" cy="68" rx="18" ry="12" fill="#f2e3c8" stroke="none"/>` +
    `<path d="M30 56C38 50 52 54 56 64C46 68 34 66 30 56Z" fill="#8a5a30"/>` +
    `<circle cx="64" cy="40" r="16" fill="#8a5a30"/><ellipse cx="66" cy="46" rx="9" ry="6" fill="#fff" stroke="none"/>` +
    `<path d="M76 40L88 43L76 47Z" fill="#3d3530"/>` +
    dot(68, 37, 3) +
    `<path d="M70 52C72 56 74 56 76 52Z" fill="${INK}"/>`,
  악어:
    `<path d="M30 70L26 82H36L38 72M62 70L60 82H70L72 70" fill="#4f9a45"/>` +
    `<path d="M4 58L40 54C46 44 56 42 64 44L96 56C98 60 96 64 90 64H60L40 66L4 66C2 62 2 60 4 58Z" fill="#5cb04e"/>` +
    `<path d="M8 58L12 62L16 57L20 61L24 56L28 60L32 55" fill="#fff" stroke-width="2"/>` +
    `<path d="M66 44L70 36L74 46L78 38L82 49L86 42L88 52" fill="#4f9a45"/>` +
    `<circle cx="46" cy="48" r="7" fill="#5cb04e"/>` +
    dot(47, 47, 3) +
    dot(10, 59, 1.6),

  // ── 생활용품 ──
  연필:
    `<g transform="rotate(-38 50 50)"><rect x="20" y="41" width="52" height="18" fill="#ffd23f"/><path d="M20 50H72" stroke="#e0a800" stroke-width="2"/>` +
    `<path d="M72 41L92 50L72 59Z" fill="#f5d6a8"/><path d="M85 47L92 50L85 53Z" fill="${INK}"/>` +
    `<rect x="8" y="41" width="10" height="18" rx="3" fill="#ff9ec4"/><rect x="16" y="41" width="6" height="18" fill="#b8c6da"/></g>`,
  공책:
    `<rect x="24" y="10" width="58" height="82" rx="4" fill="#43b04a"/><rect x="38" y="26" width="34" height="16" rx="3" fill="#fff"/>` +
    [18, 30, 42, 54, 66, 78].map((y) => `<path d="M30 ${y}C18 ${y} 18 ${y + 8} 30 ${y + 8}" stroke-width="3"/>`).join(''),
  시계:
    `<path d="M30 80L22 92M70 80L78 92" stroke-width="5"/>` +
    `<path d="M14 30C12 18 24 10 34 16Z" fill="#ffd23f"/><path d="M86 30C88 18 76 10 66 16Z" fill="#ffd23f"/>` +
    `<circle cx="50" cy="54" r="34" fill="#e8553d"/><circle cx="50" cy="54" r="27" fill="#fff"/>` +
    `<path d="M50 30v5M50 73v5M26 54h5M69 54h5" stroke-width="3"/>` +
    `<path d="M50 54L40 44M50 54L64 42" stroke-width="4"/>` +
    dot(50, 54, 3.5),
  거울:
    tube('M50 70V92', '#e85d9a', 8) +
    `<ellipse cx="50" cy="40" rx="30" ry="34" fill="#e85d9a"/><ellipse cx="50" cy="40" rx="23" ry="27" fill="#cfeeff"/>` +
    `<path d="M36 34L48 22M38 44L56 26" stroke="#fff" stroke-width="4"/>`,
  안경:
    `<path d="M14 46L4 40M86 46L96 40" stroke-width="4"/>` +
    `<circle cx="30" cy="54" r="17" fill="#cfeeff" stroke-width="5"/><circle cx="70" cy="54" r="17" fill="#cfeeff" stroke-width="5"/>` +
    `<path d="M45 50Q50 44 55 50" stroke-width="4"/>` +
    `<path d="M22 50L30 42M62 50L70 42" stroke="#fff" stroke-width="3.5"/>`,
  장갑: [
    'translate(4 0)',
    'translate(96 0) scale(-1 1)',
  ]
    .map(
      (t) =>
        `<g transform="${t}"><path d="M6 60C-2 56 -2 44 6 42C10 42 12 46 12 50Z" fill="#e8403a"/>` +
        `<path d="M10 80V44C10 30 18 22 28 22S46 30 46 44V80Z" fill="#e8403a"/>` +
        `<rect x="8" y="76" width="40" height="14" rx="3" fill="#fff"/><path d="M16 38h14M16 48h14" stroke="#ff9a8a" stroke-width="3"/></g>`,
    )
    .join(''),
  지우개:
    `<path d="M8 86q8-8 16 0t16 0" stroke="#9fb3d9" stroke-width="3"/><path d="M48 86q8-8 16 0" stroke="#9fb3d9" stroke-width="3" stroke-dasharray="3 6"/>` +
    dot(72, 84, 2, '#ffc0d4') +
    dot(80, 88, 2, '#ffc0d4') +
    dot(76, 80, 1.6, '#ffc0d4') +
    `<g transform="rotate(-20 50 44)"><rect x="18" y="30" width="64" height="30" rx="5" fill="#fff"/><rect x="46" y="30" width="36" height="30" fill="#3b78e6"/>` +
    `<path d="M56 38h16M56 46h12" stroke="#fff" stroke-width="3"/></g>`,
  자전거:
    `<circle cx="22" cy="66" r="18" fill="#e7f0ff"/><circle cx="78" cy="66" r="18" fill="#e7f0ff"/>` +
    dot(22, 66, 3) +
    dot(78, 66, 3) +
    `<path d="M22 66L40 42H66L78 66M40 42L50 66L66 42M50 66H22" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M40 42L36 32M30 32H44M66 42L62 28M58 26H70" stroke-width="5"/>` +
    `<circle cx="50" cy="66" r="5" fill="#fff"/>`,
  바구니:
    tube('M22 50C22 12 78 12 78 50', '#b5793a', 5) +
    `<circle cx="36" cy="46" r="10" fill="#e8403a"/><circle cx="54" cy="44" r="10" fill="#ffab5c"/><circle cx="68" cy="48" r="8" fill="#8e4fc9"/>` +
    `<path d="M12 50H88L78 90H22Z" fill="#d9a55b"/>` +
    `<path d="M16 64H84M19 77H81M34 50L38 90M50 50V90M66 50L62 90" stroke="#a8743a" stroke-width="3"/>`,
  장난감:
    `<rect x="10" y="60" width="28" height="28" rx="3" fill="#e8553d"/><rect x="38" y="60" width="28" height="28" rx="3" fill="#3b78e6"/><rect x="24" y="32" width="28" height="28" rx="3" fill="#ffd23f"/>` +
    `<path d="M24 80C18 76 16 72 18 69C20 66 23 67 24 70C25 67 28 66 30 69C32 72 30 76 24 80Z" fill="#fff" stroke="none"/><path d="M52 66L60 80H44Z" fill="#fff" stroke="none"/><path d="M38 38L42 46L50 46L44 51L46 58L38 54L30 58L32 51L26 46L34 46Z" fill="#fff" stroke="none"/>` +
    `<path d="M68 76V66C68 62 72 60 76 60H86C90 60 92 64 94 70V76Z" fill="#43b04a"/>` +
    `<circle cx="74" cy="80" r="5" fill="${INK}"/><circle cx="89" cy="80" r="5" fill="${INK}"/>`,

  // ── 장소 ──
  시장:
    `<path d="M10 38V88M44 38V88M56 38V88M90 38V88" stroke-width="3"/>` +
    `<path d="M6 26H48L46 40H8Z" fill="#e8553d"/><path d="M16 27L15 39M26 27V39M36 27L37 39" stroke="#fff" stroke-width="4"/>` +
    `<path d="M52 26H94L92 40H54Z" fill="#43b04a"/><path d="M62 27L61 39M72 27V39M82 27L83 39" stroke="#fff" stroke-width="4"/>` +
    `<rect x="8" y="66" width="38" height="22" fill="#c98b4f"/><rect x="54" y="66" width="38" height="22" fill="#c98b4f"/>` +
    `<circle cx="17" cy="60" r="6" fill="#e8403a"/><circle cx="28" cy="60" r="6" fill="#ffab5c"/><circle cx="39" cy="60" r="6" fill="#e8403a"/>` +
    `<path d="M58 60C62 54 72 54 76 60C72 66 62 66 58 60ZM76 60L82 55V65Z" fill="#8fb3d9"/><path d="M64 70C66 66 74 66 78 70" stroke="none"/>` +
    dot(63, 59, 1.6),
  학교:
    `<path d="M50 6V18" stroke-width="3"/><path d="M51 6H64L60 10L64 14H51Z" fill="#e8553d"/>` +
    `<rect x="10" y="44" width="80" height="46" fill="#ffe7a8"/>` +
    `<path d="M34 34L50 18L66 34Z" fill="#e8553d"/><rect x="36" y="34" width="28" height="56" fill="#fff4d0"/>` +
    `<circle cx="50" cy="46" r="7" fill="#fff"/><path d="M50 42V46L53 48" stroke-width="2"/>` +
    `<path d="M44 90V68a6 6 0 0 1 12 0V90" fill="#9a5b2e"/>` +
    [16, 70]
      .map(
        (x) =>
          `<rect x="${x}" y="52" width="12" height="10" fill="#8fd3ff" stroke-width="2.5"/><rect x="${x}" y="70" width="12" height="10" fill="#8fd3ff" stroke-width="2.5"/>`,
      )
      .join('') +
    `<path d="M4 90H96"/>`,
  교실:
    `<rect x="8" y="8" width="84" height="42" rx="3" fill="#2f6a4a" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M18 36L26 22L34 36Z" stroke="#fff" stroke-width="2.5"/><path d="M42 30q6-8 12 0t12 0" stroke="#fff" stroke-width="2.5"/><path d="M78 18L80.5 25H87L82 29L84 36L78 32L72 36L74 29L69 25H75.5Z" stroke="#ffd23f" stroke-width="2"/>` +
    [18, 58]
      .map(
        (x) =>
          `<path d="M${x + 4} 72V92M${x + 24} 72V92" stroke-width="3"/><rect x="${x}" y="66" width="28" height="7" rx="2" fill="#c98b4f"/>` +
          `<rect x="${x + 8}" y="80" width="12" height="4" fill="#3b78e6"/><path d="M${x + 10} 84V94M${x + 18} 84V94" stroke-width="2.5"/>`,
      )
      .join(''),
  마을:
    `<path d="M0 70C20 60 40 64 50 68S80 60 100 66V100H0Z" fill="#8fd67a"/>` +
    `<path d="M44 100C46 88 52 80 50 70" stroke="#e8d8a8" stroke-width="6"/>` +
    [
      [18, 56, '#e8553d', '#ffe7a8'],
      [70, 52, '#3b78e6', '#fff4d0'],
      [40, 42, '#8e4fc9', '#ffe7a8'],
    ]
      .map(
        ([x, y, roof, wall]) =>
          `<path d="M${+x - 14} ${+y}L${x} ${+y - 14}L${+x + 14} ${+y}Z" fill="${roof}"/><rect x="${+x - 10}" y="${y}" width="20" height="16" fill="${wall}"/>` +
          `<rect x="${+x - 3}" y="${+y + 6}" width="6" height="10" fill="#9a5b2e" stroke-width="2"/>`,
      )
      .join('') +
    `<path d="M90 76V64" stroke="#9a5b2e" stroke-width="4"/>` +
    blob('#43b04a', [
      [90, 56, 9],
      [86, 62, 7],
      [94, 62, 7],
    ]),
  운동장:
    `<rect x="2" y="30" width="96" height="66" rx="6" fill="#8fd67a"/>` +
    `<ellipse cx="50" cy="64" rx="42" ry="24" stroke="#e07a4a" stroke-width="7"/><ellipse cx="50" cy="64" rx="42" ry="24" stroke="#fff" stroke-width="1.5"/>` +
    `<path d="M50 42V86" stroke="#fff" stroke-width="2"/><circle cx="50" cy="64" r="6" stroke="#fff" stroke-width="2"/>` +
    `<path d="M60 10V30M60 10H74L70 15L74 20H60" fill="#ffd23f"/>` +
    `<circle cx="72" cy="70" r="6" fill="#fff"/>` +
    dot(72, 70, 2),
  우체국:
    `<rect x="10" y="34" width="62" height="56" fill="#fff4d0"/><path d="M6 34L41 12L76 34Z" fill="#e8553d"/>` +
    `<rect x="22" y="42" width="38" height="24" rx="2" fill="#fff"/><path d="M22 42L41 56L60 42" stroke="#e8553d" stroke-width="3"/>` +
    `<rect x="32" y="72" width="18" height="18" fill="#9a5b2e"/>` +
    `<path d="M84 90V76" stroke-width="4"/><rect x="74" y="50" width="20" height="28" rx="8" fill="#e8403a"/><path d="M78 60H90" stroke-width="3"/>` +
    `<path d="M4 90H96"/>`,

  // ── 자연 ──
  하늘:
    `<rect x="4" y="6" width="92" height="88" rx="14" fill="#8fd3ff"/>` +
    `<circle cx="78" cy="24" r="10" fill="#ffd23f"/>` +
    blob('#fff', [
      [26, 64, 9],
      [38, 60, 12],
      [50, 66, 8],
    ]) +
    `<path d="M30 30q5-5 10 0q5-5 10 0M58 46q4-4 8 0q4-4 8 0" stroke-width="3"/>`,
  구름: `<circle cx="50" cy="52" r="44" fill="#bfe6ff" stroke="none"/>` + blob('#fff', [
    [28, 60, 16],
    [46, 44, 22],
    [68, 50, 18],
    [50, 64, 16],
    [74, 64, 12],
  ]),
  바람:
    `<path d="M6 38H56C68 38 72 26 64 20C58 16 50 20 52 28" stroke="#4aa8f0" stroke-width="5"/>` +
    `<path d="M6 56H74C88 56 92 72 82 78C74 82 66 76 70 68" stroke="#4aa8f0" stroke-width="5"/>` +
    `<path d="M16 74H44" stroke="#4aa8f0" stroke-width="5"/>` +
    `<path d="M82 22C90 16 96 22 92 30C88 36 80 32 82 22Z" fill="#43b04a"/><path d="M76 42C84 40 88 48 82 52C76 56 72 48 76 42Z" fill="#ffab5c"/>`,
  여름:
    `<g stroke="#ff9f1a" stroke-width="5">` +
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map((k) => {
        const a = (k * Math.PI) / 4;
        const p = (r: number) => `${Math.round(22 + r * Math.cos(a))} ${Math.round(22 + r * Math.sin(a))}`;
        return `<path d="M${p(19)}L${p(26)}"/>`;
      })
      .join('') +
    `</g><circle cx="22" cy="22" r="14" fill="#ffd23f"/>` +
    `<path d="M0 70q8-6 16 0t17 0t17 0t17 0t17 0t16 0V100H0Z" fill="#3b8fe0"/><path d="M0 86H100V100H0Z" fill="#ffe2a0"/>` +
    `<path d="M72 88L64 40" stroke-width="4"/><path d="M40 46C44 26 70 20 90 34C80 34 76 38 72 42C68 38 58 38 54 44C50 40 44 42 40 46Z" fill="#e8553d"/>`,
  겨울:
    `<ellipse cx="50" cy="90" rx="44" ry="8" fill="#fff"/>` +
    `<circle cx="50" cy="68" r="22" fill="#fff"/><circle cx="50" cy="34" r="15" fill="#fff"/>` +
    `<path d="M38 24H62L58 12H42Z" fill="#3b4a6b"/><path d="M34 24H66"/>` +
    dot(45, 33, 2.4) +
    dot(55, 33, 2.4) +
    `<path d="M50 37L60 40L50 41Z" fill="#ff8c1a"/><path d="M36 48Q50 54 64 48" stroke="#e8403a" stroke-width="6"/>` +
    dot(50, 62, 2.4) +
    dot(50, 72, 2.4) +
    [
      [14, 20],
      [84, 18],
      [86, 52],
      [12, 58],
    ]
      .map(([x, y]) => `<path d="M${x - 5} ${y}h10M${x} ${y - 5}v10M${x - 3.5} ${y - 3.5}l7 7M${x + 3.5} ${y - 3.5}l-7 7" stroke="#7ec8f0" stroke-width="2.5"/>`)
      .join(''),
  봄:
    `<path d="M0 84C30 78 70 78 100 84V100H0Z" fill="#8fd67a"/>` +
    [
      [30, '#ff5c8a'],
      [70, '#ffc933'],
    ]
      .map(
        ([x, c]) =>
          `<path d="M${x} 84V52" stroke="#43b04a" stroke-width="4"/><path d="M${x} 72C${+x - 14} 70 ${+x - 16} 60 ${+x - 12} 58C${+x - 6} 60 ${+x - 2} 66 ${x} 72Z" fill="#43b04a"/>` +
          `<path d="M${+x - 12} 34L${+x - 6} 42L${x} 32L${+x + 6} 42L${+x + 12} 34C${+x + 14} 46 ${+x + 8} 54 ${x} 54S${+x - 14} 46 ${+x - 12} 34Z" fill="${c}"/>`,
      )
      .join('') +
    [
      [50, 18],
      [14, 20],
      [86, 22],
      [52, 44],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#ffb3c4" stroke="none"/>`)
      .join(''),
  가을:
    `<path d="M50 94V70" stroke="#9a5b2e" stroke-width="4"/>` +
    `<path d="M50 72L30 78L34 68L14 62L22 56L10 42L28 44L26 28L40 38L50 14L60 38L74 28L72 44L90 42L78 56L86 62L66 68L70 78Z" fill="#ff8c1a"/>` +
    `<path d="M50 70V30M50 56L30 46M50 56L70 46" stroke="#d9601a" stroke-width="2.5"/>` +
    `<path d="M14 84C12 76 20 72 24 78C28 84 20 90 14 84Z" fill="#e8403a"/><path d="M82 86C80 78 88 74 92 80C96 86 88 92 82 86Z" fill="#ffc933"/>`,
  번개:
    blob('#6b7894', [
      [30, 30, 15],
      [50, 22, 18],
      [70, 32, 15],
      [50, 36, 13],
    ]) + `<path d="M52 42L36 70H50L40 96L70 60H55L64 42Z" fill="#ffd23f"/>`,
  파도:
    `<path d="M4 92V64C4 30 30 12 56 14C76 16 90 30 88 46C86 58 74 62 66 56C58 50 62 38 72 38C66 30 50 30 40 42C30 54 32 74 44 92Z" fill="#3b8fe0"/>` +
    `<path d="M56 14C76 16 90 30 88 46" stroke="#fff" stroke-width="5"/>` +
    `<path d="M4 92H96" stroke="#2a6fc4" stroke-width="6"/><path d="M52 88q10-8 20 0t22 0" stroke="#3b8fe0" stroke-width="5"/>` +
    dot(92, 30, 3, '#bfe6ff') +
    dot(84, 20, 2.4, '#bfe6ff'),
  얼음:
    [
      [34, 60],
      [66, 52],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x - 20} ${y - 8}L${x} ${y - 18}L${x + 20} ${y - 8}L${x} ${y + 2}Z" fill="#e6f6ff"/>` +
          `<path d="M${x - 20} ${y - 8}V${y + 14}L${x} ${y + 26}V${y + 2}Z" fill="#bfe6ff"/><path d="M${x + 20} ${y - 8}V${y + 14}L${x} ${y + 26}V${y + 2}Z" fill="#9fd4f5"/>` +
          `<path d="M${x - 15} ${y - 2}V${y + 8}" stroke="#fff" stroke-width="3"/>`,
      )
      .join('') +
    sparkle(18, 22, 6, '#7ec8f0') +
    sparkle(84, 20, 5, '#7ec8f0'),

  // ── 행동 ──
  달리다:
    `<path d="M4 36H20M2 50H16M6 64H20" stroke="#9fb3d9" stroke-width="4"/>` +
    stick(54, 20, 'M0 10L-6 34M-1 16L14 26L24 18M-1 16L-14 24L-18 36M-6 34L10 42L10 58M-6 34L-18 46L-32 46') +
    `<circle cx="22" cy="80" r="5" fill="#e0e6f2" stroke="none"/><circle cx="14" cy="84" r="3.5" fill="#e0e6f2" stroke="none"/>`,
  그리다:
    `<rect x="6" y="14" width="68" height="76" rx="3" fill="#fff"/>` +
    `<circle cx="24" cy="32" r="8" fill="#ffd23f" stroke="none"/><path d="M20 70L36 54L52 70Z" fill="#e8553d" stroke="none"/><path d="M8 80C24 74 44 74 60 80" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M40 44C48 36 56 46 64 40" stroke="#3b78e6" stroke-width="4"/>` +
    `<g transform="rotate(40 76 40)"><rect x="70" y="4" width="13" height="40" rx="2" fill="#3b78e6"/><path d="M70 44L76.5 56L83 44Z" fill="#f5d6a8"/><path d="M74 50L76.5 56L79 50Z" fill="#3b78e6"/></g>`,
  마시다:
    `<circle cx="32" cy="46" r="24" fill="${SKIN}"/><path d="M8 42C8 24 20 20 32 20S56 24 56 40C50 32 42 30 32 30S14 34 8 42Z" fill="#5a3b24"/>` +
    dot(26, 44) +
    dot(40, 44) +
    cheeks(54, 12, 32) +
    `<path d="M44 56L66 30" stroke="#e8553d" stroke-width="4"/>` +
    `<circle cx="44" cy="57" r="4" fill="#c62f3f"/>` +
    `<path d="M58 44H90L86 92H62Z" fill="#e6f6ff"/><path d="M60 60H88L86 92H62Z" fill="#ffab5c"/>` +
    `<path d="M66 30L72 64" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M50 44l4-4M56 38l4-4" stroke="#ffab5c" stroke-width="3"/>`,
  만들다:
    `<rect x="8" y="64" width="26" height="26" rx="2" fill="#3b78e6"/><rect x="34" y="64" width="26" height="26" rx="2" fill="#e8553d"/>` +
    `<rect x="20" y="38" width="28" height="26" rx="2" fill="#43b04a"/><path d="M16 38L34 20L52 38Z" fill="#ffd23f"/>` +
    `<g transform="rotate(-30 76 40)"><rect x="72" y="36" width="8" height="46" rx="3" fill="#b5793a"/><rect x="62" y="24" width="30" height="14" rx="3" fill="#8a96b0"/></g>` +
    sparkle(58, 20, 6) +
    sparkle(66, 50, 4),
  기다리다:
    `<path d="M76 92V36" stroke-width="4"/><circle cx="76" cy="26" r="12" fill="#3b78e6"/><rect x="70" y="21" width="12" height="9" rx="2" fill="#fff" stroke-width="2"/>` +
    stick(40, 30, 'M0 10V36M0 18L-10 32M0 18L10 32M0 36L-7 56M0 36L7 56') +
    `<circle cx="22" cy="18" r="11" fill="#fff"/><path d="M22 11V18L27 21" stroke-width="2.5"/>` +
    dot(50, 20, 2.4, '#9fb3d9') +
    dot(57, 20, 2.4, '#9fb3d9') +
    dot(64, 20, 2.4, '#9fb3d9'),
  던지다:
    stick(26, 36, 'M0 10L2 34M0 16L-14 8L-20 -4M0 16L14 10L22 4M2 34L-10 54M2 34L14 54') +
    `<path d="M52 36C62 20 76 18 86 30" stroke="#3b78e6" stroke-width="4" stroke-dasharray="6 6"/>` +
    `<circle cx="86" cy="40" r="9" fill="#e8553d"/><path d="M79 38C83 40 89 40 93 38" stroke="#fff" stroke-width="2"/>` +
    `<path d="M42 30l6-4M42 40h7" stroke="${HL}" stroke-width="4"/>`,

  // ── 상태 ──
  기쁘다:
    moodFace(
      `<path d="M34 54q6-8 12 0M54 54q6-8 12 0" stroke-width="4"/>` +
        `<path d="M34 64H66C66 80 34 80 34 64Z" fill="#c62f3f"/><path d="M40 72C44 76 56 76 60 72C56 70 44 70 40 72Z" fill="#ff8aa0" stroke="none"/>` +
        cheeks(66, 22),
    ) +
    sparkle(12, 20, 7) +
    sparkle(88, 18, 7) +
    sparkle(90, 84, 5) +
    sparkle(10, 82, 5),
  예쁘다:
    `<path d="M50 94V60" stroke="#43b04a" stroke-width="4"/><path d="M50 80C38 80 34 70 36 66C44 66 50 72 50 80Z" fill="#43b04a"/>` +
    [0, 1, 2, 3, 4]
      .map((k) => {
        const a = (k * 2 * Math.PI) / 5 - Math.PI / 2;
        return `<circle cx="${Math.round(50 + 16 * Math.cos(a))}" cy="${Math.round(42 + 16 * Math.sin(a))}" r="12" fill="#ff8ac2"/>`;
      })
      .join('') +
    `<circle cx="50" cy="42" r="9" fill="#ffd23f"/>` +
    sparkle(16, 20, 7) +
    sparkle(84, 22, 7) +
    sparkle(84, 72, 5) +
    sparkle(14, 66, 5),
  졸리다: moodFace(
    `<path d="M34 55q6 4 12 0M54 55q6 4 12 0" stroke-width="4"/><path d="M33 51h14M53 51h14" stroke-width="2.5"/>` +
      `<ellipse cx="50" cy="72" rx="7" ry="9" fill="#c62f3f"/>` +
      drop(70, 58, 0.5) +
      `<path d="M72 8h10l-10 11h10M86 22h7l-7 8h7" stroke="#3b78e6"/>`,
  ),
  조용하다:
    moodFace(dot(40, 55) + dot(60, 55) + `<path d="M42 71q8 -4 16 0" stroke-width="3"/>` + `<rect x="46" y="58" width="9" height="30" rx="4.5" fill="${SKIN}"/>`) +
    `<path d="M8 50q4 4 0 8M12 44q8 10 0 20M92 50q-4 4 0 8M88 44q-8 10 0 20" stroke="#9fb3d9" stroke-width="3"/>`,
  뜨겁다:
    `<path d="M34 26C28 18 40 14 34 6M50 26C44 18 56 14 50 6M66 26C60 18 72 14 66 6" stroke="#e8403a" stroke-width="4"/>` +
    `<path d="M14 40H86V64C86 76 76 82 64 82H36C24 82 14 76 14 64Z" fill="#8a96b0"/><path d="M8 44H14M86 44H92" stroke-width="5"/>` +
    `<ellipse cx="50" cy="40" rx="36" ry="5" fill="#ff8c1a"/>` +
    `<path d="M30 96C26 90 32 86 34 84C36 88 40 88 40 84C44 88 46 92 42 96Z" fill="#ff8c1a"/><path d="M50 96C46 90 52 86 54 84C56 88 60 88 60 84C64 88 66 92 62 96Z" fill="#ff8c1a"/><path d="M70 96C66 90 72 86 74 84C76 88 80 88 80 84C84 88 86 92 82 96Z" fill="#ff8c1a"/>`,
};

// L1 묶음 (docs/vocab-plan.md 작업 순서 2~4: 묶음별로 그리고 검수한 뒤 여기 등록)
Object.assign(PICTURES, L1_ANIMALS, L1_FOOD, L1_THINGS, L1_PLACES, L1_NATURE, L1_ACTIONS);
// 그 뒤 묶음은 scripts/register-words.mjs가 등록한다 (pictureIndex.ts 자동 생성)
Object.assign(PICTURES, REGISTERED_PICS);

/** 그림이 있는 단어 목록 (그린 순서) */
export const PICTURED_WORDS = Object.keys(PICTURES);

/** 그림 ID(p_단어)의 SVG. 그림이 없으면 null (그림 칸을 비운다). */
export function pictureSvg(pictureId: string): string | null {
  const inner = PICTURES[pictureId.replace(/^p_/, '')];
  return inner ? svgFor(inner) : null;
}
