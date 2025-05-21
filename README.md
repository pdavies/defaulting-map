# DefaultingMap

[![CI](https://github.com/pdavies/defaulting-map/actions/workflows/ci.yml/badge.svg)](https://github.com/pdavies/defaulting-map/actions/workflows/ci.yml)

A tiny dependency-free extension to the native `Map`, with defaults and updates perfect for reducing data into buckets.

## Installation

```bash
npm install defaulting-map
```

## Why DefaultingMap?

Turn this:

```typescript
if (!map.has(key)) {
    map.set(key, 0);
}
map.set(key, map.get(key) + 1);
```

Into this:

```typescript
map.update(key, (value) => value + 1);
```

## Examples

```typescript
const wordCounts = new DefaultingMap(() => 0);
const text = "foo bar foo baz";

for (const word of words.split(' ')) {
  wordCounts.update(word, (count) => count + 1);
}

console.log([...wordCounts.entries()]); // [ [ 'foo', 2 ], [ 'bar', 1 ], [ 'baz', 1 ] ]
```

```typescript
const lists = new DefaultingMap(() => new Set<string>());

const pageViews = [["user1", "home"], ["user2", "about"], ["user1", "contact"], ["user1", "home"]];

for (const [user, page] of pageViews) {
    u.update(user, (pages) => pages.add(page));
}

console.log(pageViews.get('user1')); // Set(2) { 'home', 'contact' }
```

## Getting unset values

By default, `.get(key)` returns `undefined` for unset keys (like `Map`). To get the default value instead:

```typescript
const map = new DefaultingMap(() => 0, { getUnsetAsDefault: true });

console.log(map.get('nonexistent')); // 0
```

Even with this setting, `map.keys()`, `map.entries()` etc will continue to behave like `Map` and return data for explicitly set keys.
