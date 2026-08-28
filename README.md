# QA Automation Showcase — RamaLabs

> **Damir Rama** | Playwright & TypeScript test automation specialist

[![Playwright Tests](https://github.com/ramalabs/qa-automation-showcase/actions/workflows/playwright.yml/badge.svg)](https://github.com/ramalabs/qa-automation-showcase/actions/workflows/playwright.yml)

A living portfolio of Playwright end-to-end tests demonstrating industry best practices: Page Object Model, typed fixtures, role-based locators, cross-browser execution, and CI/CD integration.

Uses [SauceDemo](https://www.saucedemo.com/) — a standard demo web app — so the code is immediately understandable to any QA engineer.

---

## What This Shows

| Practice | How It's Demonstrated |
|----------|----------------------|
| **Page Object Model** | `pages/` — each page is a class with typed locators and methods |
| **Typed Test Fixtures** | `fixtures/test-fixtures.ts` — clean dependency injection |
| **Role-Based Locators** | `getByRole`, `getByTestId`, `getByText` — no brittle CSS |
| **Happy Path + Edge Cases** | Login, products, cart, checkout + error states, auth guards, data validation |
| **Global Setup via Project Dependencies** | `auth.setup.ts` logs in once, shares session via `storageState` |
| **Auth-Gated Test Separation** | Login tests run in a separate project without pre-auth session |
| **Cross-Browser CI** | Chromium, Firefox, WebKit in GitHub Actions |
| **Smart Reporting** | HTML report + failure screenshots + video on retries |

---

## Test Coverage

| Spec | Tests | Auth | What It Covers |
|------|-------|------|----------------|
| `login.spec.ts` | 6 | ❌ No (own login) | Standard login, locked out user, empty credentials, wrong password, error dismissal, **logout** |
| `special-users.spec.ts` | 2 | ❌ No (own login) | Performance glitch user, problem user |
| `products.spec.ts` | 6 | ✅ Global setup | Item listing, add/remove cart, 4 sort modes |
| `cart.spec.ts` | 4 | ✅ Global setup | Item persistence, removal, continue shopping, empty cart |
| `checkout.spec.ts` | 7 | ✅ Global setup | Full purchase flow, cancel at 2 stages, 3 field validations, back home |
| `edge-cases.spec.ts` | 2 | ✅ Global setup | Bulk add all items, cart persistence across navigation |
| **Setup** | 1 | — | Authenticates once, saves storage state for all auth-gated tests |
| **Total** | **28** | | |

## Architecture

The suite uses Playwright's **project dependencies** for global authentication:

```
setup ──► chromium (auth) ──► cart, checkout, products, edge-cases
         ├► firefox (auth)
         └► webkit (auth)

chromium-no-auth ──► login, special-users
firefox-no-auth  ──► login, special-users
webkit-no-auth   ──► login, special-users
```

This eliminates repeated login in every test suite — `beforeEach` now only navigates to the inventory page thanks to the pre-authenticated session from `auth.setup.ts`.

---

## Quick Start

```bash
# Install dependencies
npm ci

# Install browsers
npx playwright install

# Run all tests (Chromium by default)
npx playwright test

# Run with specific browser
npx playwright test --project=firefox

# Run in headed mode (see the browser)
npx playwright test --headed

# Open HTML report after run
npx playwright show-report
```

---

## Project Structure

```
├── .github/workflows/playwright.yml        # CI pipeline (3 browsers)
├── playwright/.auth/user.json              # Storage state (gitignored)
├── fixtures/
│   └── test-fixtures.ts                     # Typed fixtures + test data
├── pages/
│   ├── login-page.ts                        # Login page object
│   ├── inventory-page.ts                    # Products page object
│   ├── cart-page.ts                         # Cart page object
│   └── checkout-page.ts                    # Checkout page object
├── tests/
│   ├── auth.setup.ts                        # Global setup: login once, share session
│   ├── login.spec.ts                        # Authentication tests (no auth project)
│   ├── special-users.spec.ts                # Special user tests (no auth project)
│   ├── products.spec.ts                     # Inventory & sorting tests (auth project)
│   ├── cart.spec.ts                         # Shopping cart tests (auth project)
│   ├── checkout.spec.ts                     # Checkout flow tests (auth project)
│   └── edge-cases.spec.ts                   # Bulk add & persistence (auth project)
├── playwright.config.ts                     # Playwright configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## Contact

**RamaLabs** — QA automation services.  
Based in Switzerland. Available for freelance projects.

---

*Built as a portfolio showcase for Upwork and Fiverr clients.*