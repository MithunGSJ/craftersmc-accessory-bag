import { describe, it, expect } from 'vitest';
import { setSoundEnabled, isSoundEnabled, playClickSound, playEquipSound, playUpgradeSound } from './soundEffects.ts';

describe('soundEffects', () => {
  it('should toggle sound enabled state reliably', () => {
    setSoundEnabled(false);
    expect(isSoundEnabled()).toBe(false);

    setSoundEnabled(true);
    expect(isSoundEnabled()).toBe(true);
  });

  it('should not throw errors when invoked in headless or node environment without WebAudio', () => {
    expect(() => playClickSound()).not.toThrow();
    expect(() => playEquipSound()).not.toThrow();
    expect(() => playUpgradeSound()).not.toThrow();
  });
});
