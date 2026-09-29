// 함께 싸울 캐릭터. 학습 규칙(단어·조합·도움·콤보·피해량·기록)은 모두 공유하고,
// 여기에는 캐릭터마다 달라지는 것(이름, 대사, 대사 목소리, 출제 장치 이름)만 둔다.
// 전투 그림과 효과는 scene/BattleScene.ts가 theme 값으로 고른다.

export type CharacterTheme = 'robot' | 'magicalGirl';

export type LineKey = 'hurry' | 'ready' | 'combo' | 'power' | 'finish' | 'reboot' | 'pick' | 'unlock' | 'ultimate' | 'special';

export interface ThemeDef {
  id: CharacterTheme;
  /** 화면에 보이는 이름 ('남자용/여자용'이 아니라 캐릭터 이름) */
  name: string;
  /** 출제 장치 이름 (부모 화면 안내용) */
  device: string;
  /** 캐릭터별 전투 대사 ID */
  lines: Record<LineKey, string>;
  /** 대사 TTS 설정. 단어 발음에는 쓰지 않는다 (단어는 공통 녹음/또렷한 설정). */
  dialogueVoice: { rate: number; pitch: number };
}

export const THEMES: Record<CharacterTheme, ThemeDef> = {
  robot: {
    id: 'robot',
    name: '로봇',
    device: '암호 수신기',
    lines: { hurry: 'r_hurry', ready: 'r_ready', combo: 'r_combo', power: 'r_power', finish: 'r_finish', reboot: 'r_reboot', pick: 'r_pick', unlock: 'r_unlock', ultimate: 'r_ultimate', special: 'r_special' },
    // 힘 있게, 기계음으로 왜곡하지 않는다
    dialogueVoice: { rate: 1.1, pitch: 0.9 },
  },
  magicalGirl: {
    id: 'magicalGirl',
    name: '마법소녀',
    device: '마법 수정',
    lines: { hurry: 'm_hurry', ready: 'm_ready', combo: 'm_combo', power: 'm_power', finish: 'm_finish', reboot: 'm_reboot', pick: 'm_pick', unlock: 'm_unlock', ultimate: 'm_ultimate', special: 'm_special' },
    // 밝지만 작고 약한 목소리가 되지 않게 너무 높이지 않는다
    dialogueVoice: { rate: 1.1, pitch: 1.25 },
  },
};

export function themeOf(t: CharacterTheme | null | undefined): ThemeDef {
  return THEMES[t ?? 'robot'];
}
