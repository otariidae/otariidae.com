---
title: "A Pitfall in Frontend Component Testing"
lang: en
published: 2025-11-23
gist_url: "https://gist.github.com/otariidae/c4c5bd0ba573e55c6f55fa3829174f41"
---

Frontend testing toolchain is evolving. Vitest Browser Mode, in particular, recently became stable, make testing in a realistic browser environment easier than ever.

In this post, I’m going to share a pitfall I’ve experienced and the solution.

## Leaking State Between Test Cases

Test cases should be isolated, independent, and operate without _hysteresis_ (influence from previous states).
However, it is not uncommon for data or state from a previous test to bleed into and affect the next one.

### The Solution: Explicitly Control State Providers

To fix this, simply wrap your component in a Provider to ensure a fresh state for every test.

### Case 1: SWR

Use `<SWRConfig>`.

```tsx
// Bad
const screen = await render(<YourComponent />);
```

```tsx
// Good
import { SWRConfig } from "swr";

const screen = await render(
  <SWRConfig value={{ provider: () => new Map() }}>
    <YourComponent />
  </SWRConfig>,
);
```

### Case 2: Jotai

Use `<Provider>`.

```tsx
// Bad
const screen = await render(<YourComponent />);
```

```tsx
// Good
import { Provider } from "jotai";

const screen = await render(
  <Provider>
    <YourComponent />
  </Provider>,
);
```

## Wrap Up

Use Providers explicitly to ensure that each test case remains isolated.
Keep your test suites healthy!
