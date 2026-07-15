# Testing Capabilities — BookingIncaTrail

**Strict TDD Mode**: disabled
**Detected**: 2026-07-08

### Test Runner

- Command: none (`package.json` has no `test` script).
- Framework: none configured. `playwright` (^1.61.1) and `mongodb-memory-server`
  (^10.2.3) are present as devDependencies, but there is no
  `playwright.config.*`, no test directory, and no `*.test.*`/`*.spec.*` files
  anywhere in the repo. The tooling is installed but unused/unwired.

### Test Layers

| Layer       | Available | Tool |
| ----------- | --------- | ---- |
| Unit        | ❌        | —    |
| Integration | ❌        | mongodb-memory-server installed but not wired into any test suite |
| E2E         | ❌        | playwright installed but not wired (no config, no specs) |

### Coverage

- Available: ❌
- Command: —

### Quality Tools

| Tool         | Available  | Command |
| ------------ | ---------- | ------- |
| Linter       | ⚠️ partial | eslint 9 + eslint-config-next installed as devDependencies, but no `.eslintrc*`/`eslint.config.*` file and no `lint` script in `package.json`. Usable ad hoc via `npx next lint` but not currently wired. |
| Type checker | ❌         | Plain JS project (`jsconfig.json` only, no TypeScript, no `tsconfig.json`). |
| Formatter    | ✅         | `.prettierrc` present at root; no `format` script wired, usable via `npx prettier --write .`. |

**Strict TDD resolution**: no test runner exists -> `strict_tdd: false` per
Decision Gate ("no test runner" -> set disabled and explain unavailable). If
Strict TDD is desired going forward, `playwright` and `mongodb-memory-server`
are already installed and can be wired up with minimal added dependencies
(add `test`/`test:e2e` scripts, a Playwright config, and a first spec).
