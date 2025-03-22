5# End-to-End Tests for Password Manager

This directory contains end-to-end tests for the Password Manager application using Playwright.

## Test Structure

- `auth.spec.ts` - Tests for authentication (login, register, logout)
- `passwordRecords.spec.ts` - Tests for password records management (CRUD operations)
- `sharing.spec.ts` - Tests for sharing password records between users
- `userProfile.spec.ts` - Tests for user profile management

## Running Tests

Make sure you have installed Playwright with:

```bash
npm install -D @playwright/test
npx playwright install
```

To run all tests:

```bash
cd packages/client
npx playwright test
```

To run a specific test file:

```bash
npx playwright test tests/e2e/auth.spec.ts
```

To run tests with UI mode (for debugging):

```bash
npx playwright test --ui
```

## Test Utilities

The utils directory contains helper functions:

- `auth.ts` - Functions for authentication operations
- `records.ts` - Functions for password record operations

## Notes for Maintenance

When updating the application, you may need to update the selectors in the tests if UI elements change. Common selectors used:

- Button: `button:has-text("Button Text")`
- Input: `input[id="input-id"]`
- Text: `text=Exact Text`

Check Playwright documentation for more details: https://playwright.dev/docs/selectors 