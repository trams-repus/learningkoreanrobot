import { describe, expect, it } from 'vitest';
import { readOptions, RELEASE_OPTIONS } from '../src/game/services';

describe('개발 옵션', () => {
  it('일반 빌드는 URL 개발 옵션을 읽는다', () => {
    expect(readOptions('?dev=1&speed=4&voice=off')).toEqual({ dev: true, speed: 4, voiceOff: true });
    expect(readOptions('')).toEqual({ dev: false, speed: 1, voiceOff: false });
  });
  it('출시 빌드 옵션은 개발 옵션이 모두 꺼져 있다', () => {
    expect(RELEASE_OPTIONS).toEqual({ dev: false, speed: 1, voiceOff: false });
  });
});
