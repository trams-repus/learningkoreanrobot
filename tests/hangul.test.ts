import { describe, expect, it } from 'vitest';
import { assembleFromSlots, composeSyllable, decomposeSyllable, jamoRole, splitWord, vowelShape } from '../src/hangul/hangul';

describe('자모 → 음절 조합', () => {
  it('받침 없는 음절', () => {
    expect(composeSyllable('ㅍ', 'ㅗ')).toBe('포');
    expect(composeSyllable('ㄴ', 'ㅏ')).toBe('나');
    expect(composeSyllable('ㅍ', 'ㅏ')).toBe('파');
    expect(composeSyllable('ㄷ', 'ㅐ')).toBe('대');
  });
  it('받침 있는 음절', () => {
    expect(composeSyllable('ㄱ', 'ㅓ', 'ㅁ')).toBe('검');
    expect(composeSyllable('ㄱ', 'ㅗ', 'ㅇ')).toBe('공');
    expect(composeSyllable('ㄱ', 'ㅕ', 'ㄱ')).toBe('격');
    expect(composeSyllable('ㄷ', 'ㅏ', 'ㄺ')).toBe('닭');
  });
  it('호환용 자모를 이어 붙이고 normalize 해도 음절이 되지 않음을 확인 (그래서 직접 합성한다)', () => {
    expect('ㅍㅗ'.normalize('NFC')).not.toBe('포');
  });
  it('자리에 맞지 않는 자모는 거부', () => {
    expect(composeSyllable('ㅗ', 'ㅍ')).toBeNull(); // 모음을 초성에
    expect(composeSyllable('ㅍ', 'ㅍ')).toBeNull(); // 자음을 중성에
    expect(composeSyllable('ㄳ', 'ㅏ')).toBeNull(); // 겹받침은 초성이 될 수 없음
    expect(composeSyllable('ㄱ', 'ㅏ', 'ㄸ')).toBeNull(); // ㄸ은 받침 불가
    expect(composeSyllable('ㄱ', 'ㅏ', 'ㅃ')).toBeNull();
    expect(composeSyllable('ㄱ', 'ㅏ', 'ㅏ')).toBeNull();
    expect(composeSyllable('a', 'ㅏ')).toBeNull();
  });
  it('조립기 칸: 초성·중성이 모두 있어야 음절', () => {
    expect(assembleFromSlots({ cho: 'ㅍ' })).toBeNull();
    expect(assembleFromSlots({ jung: 'ㅗ' })).toBeNull();
    expect(assembleFromSlots({ cho: 'ㅍ', jung: 'ㅗ' })).toBe('포');
  });
});

describe('음절 → 자모 분해', () => {
  it('공격 = 공 + 격, 공 = ㄱㅗㅇ, 격 = ㄱㅕㄱ', () => {
    expect(splitWord('공격')).toEqual(['공', '격']);
    expect(decomposeSyllable('공')).toEqual({ cho: 'ㄱ', jung: 'ㅗ', jong: 'ㅇ' });
    expect(decomposeSyllable('격')).toEqual({ cho: 'ㄱ', jung: 'ㅕ', jong: 'ㄱ' });
    expect(decomposeSyllable('포')).toEqual({ cho: 'ㅍ', jung: 'ㅗ', jong: '' });
  });
  it('모든 완성형 음절이 분해 후 다시 같은 음절로 합성됨', () => {
    for (let c = 0xac00; c <= 0xd7a3; c++) {
      const ch = String.fromCharCode(c);
      const j = decomposeSyllable(ch)!;
      expect(composeSyllable(j.cho, j.jung, j.jong)).toBe(ch);
    }
  });
  it('음절이 아닌 글자', () => {
    expect(decomposeSyllable('ㅍ')).toBeNull();
    expect(splitWord('대ㅍ')).toBeNull();
  });
});

describe('모음 배치와 자모 역할', () => {
  it('ㅗ는 아래, ㅏ는 오른쪽', () => {
    expect(vowelShape('ㅗ')).toBe('horizontal');
    expect(vowelShape('ㅏ')).toBe('vertical');
    expect(vowelShape('ㅘ')).toBe('mixed');
  });
  it('자모 역할', () => {
    expect(jamoRole('ㅍ')).toBe('consonant');
    expect(jamoRole('ㅗ')).toBe('vowel');
    expect(jamoRole('포')).toBeNull();
    expect(jamoRole('')).toBeNull();
  });
});
