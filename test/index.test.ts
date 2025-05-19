import { describe, it, expect } from 'vitest';
import { DefaultingMap } from '../src/index';

describe('DefaultingMap', () => {
  describe('get', () => {
    it('should return undefined for unset keys when getUnsetAsDefault is false', () => {
      const map = new DefaultingMap(() => 0, { getUnsetAsDefault: false });
      expect(map.get('nonexistent')).toBeUndefined();
    });

    it('should return default value for unset keys when getUnsetAsDefault is true', () => {
      const map = new DefaultingMap(() => 0, { getUnsetAsDefault: true });
      expect(map.get('nonexistent')).toBe(0);
    });

    it('should return set values regardless of getUnsetAsDefault', () => {
      const map = new DefaultingMap(() => 0, { getUnsetAsDefault: false });
      map.set('key', 42);
      expect(map.get('key')).toBe(42);
      const map2 = new DefaultingMap(() => 0, { getUnsetAsDefault: true });
      map2.set('key', 42);
      expect(map2.get('key')).toBe(42);
    });
  });

  describe('update', () => {
    it('should update existing values', () => {
      const map = new DefaultingMap(() => 0);
      map.set('key', 1);
      map.update('key', old => old + 1);
      expect(map.get('key')).toBe(2);
    });

    it('should use default value for unset keys during update', () => {
      const map = new DefaultingMap(() => 0);
      map.update('key', old => old + 1);
      expect(map.get('key')).toBe(1);
    });

    it('should chain update calls', () => {
      const map = new DefaultingMap(() => 0);
      map
        .update('key', old => old + 1)
        .update('key', old => old + 1)
        .update('key', old => old + 1);
      expect(map.get('key')).toBe(3);
    });

    it('should maintain separate values for different keys', () => {
      const map = new DefaultingMap(() => 0);
      map.update('key1', old => old + 1);
      map.update('key2', old => old + 2);
      expect(map.get('key1')).toBe(1);
      expect(map.get('key2')).toBe(2);
    });
  });

  describe('practical use cases', () => {
    it('should work with object default values', () => {
      const map = new DefaultingMap(() => ({ count: 0 }));
      map.update('key', old => ({ count: old.count + 1 }));
      expect(map.get('key')).toEqual({ count: 1 });
    });

    it('should work with array default values', () => {
      const map = new DefaultingMap(() => [] as number[]);
      map.update('key', old => old.concat(1));
      map.update('key', old => old.concat(2));
      expect(map.get('key')).toEqual([1, 2]);
    });
  });
}); 
