/**
 * A map with an `update()` method that can mutate an existing value, starting from a default value
 * if there isn't an existing value.
 *
 * ```typescript
 * const map = new DefaultingMap(() => 0);
 * map.update('foo', (old) => old + 1);
 * assert map.get('foo') === 1;
 * map.update('foo', (old) => old + 1);
 * assert map.get('foo') === 2;
 * ```
 */
export class DefaultingMap<V> extends Map<string, V> {
  private defaultValueFactory: () => V;
  private getUnsetAsDefualt: boolean;

  /**
   * Create a new `DefaultingMap`.
   *
   * @param defaultValueFactory Function that returns the default value for unset keys
   * @param opts Options
   */
  constructor(
    defaultValueFactory: () => V,
    opts?: { getUnsetAsDefault: boolean },
  ) {
    super();
    this.defaultValueFactory = defaultValueFactory;
    this.getUnsetAsDefualt = opts?.getUnsetAsDefault ?? false;
    return this;
  }

  /**
   * Get a value from the map.
   *
   * @param key Key to get the value for
   * @returns if key is set, returns its value. If unset, returns the default value if
   * `getUnsetAsDefault` is true, or `undefined` if `getUnsetAsDefault` is false
   */
  get(key: string): V | undefined {
    return super.has(key)
      ? super.get(key)
      : this.getUnsetAsDefualt
        ? this.defaultValueFactory()
        : undefined;
  }

  /**
   * Update a value in the map.
   *
   * @param key Key whose value to update
   * @param updater Function taking the current value (if the key is already set) or default value
   * (if there is no current value) and returning a new value
   * @returns the updated map
   */
  update(key: string, updater: (old: V) => V): this {
    const newVal = updater(this.has(key) ? this.get(key) as V : this.defaultValueFactory());
    super.set(key, newVal);
    return this;
  }
}
