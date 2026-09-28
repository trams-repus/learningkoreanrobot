import { describe, expect, it } from 'vitest';
import { voiceScore } from '../src/services/audio';

const pick = (vs: { name: string; localService: boolean }[]) => [...vs].sort((a, b) => voiceScore(b) - voiceScore(a))[0].name;

describe('한국어 음성 고르기 (단어도 기기 음성으로 읽으므로 더 자연스러운 음성 우선)', () => {
  it('신경망·고품질 음성 > Google·Yuna 기본 음성 > 이름 모를 음성', () => {
    expect(pick([{ name: 'Korean', localService: true }, { name: 'Google 한국의', localService: false }])).toBe('Google 한국의');
    expect(pick([{ name: 'Google 한국의', localService: false }, { name: 'Microsoft SunHi Online (Natural) - Korean (Korea)', localService: false }])).toContain('Natural');
    expect(pick([{ name: 'Yuna', localService: true }, { name: 'Yuna (Premium)', localService: true }])).toBe('Yuna (Premium)');
  });
  it('같은 급이면 기기 내장 음성', () => {
    expect(pick([{ name: 'Google 한국의', localService: false }, { name: 'Yuna', localService: true }])).toBe('Yuna');
  });
});
