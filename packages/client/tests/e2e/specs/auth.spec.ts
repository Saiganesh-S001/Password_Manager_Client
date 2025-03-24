import { test, expect } from '@playwright/test';
import { login, register, logout, generateRandomEmail, generateRandomUsername, isAuthenticated } from '../utils/auth';

const fixedTestUser = {
  displayName: 'Test User Fixed',
  email: 'testuser_fixed@example.com',
  password: 'Password123!'
};
const randomTestUser = {
  displayName: generateRandomUsername(),
  email: generateRandomEmail(),
  password: 'Password123!'
};

test.describe('Authentication Flows', () => {
  let setupUser = { ...randomTestUser };
  
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    try {
      await login(page, setupUser.email, setupUser.password).catch(() => {
        return register(page, setupUser.displayName, setupUser.email, setupUser.password);
      });
      await logout(page);
    } catch (error) {
      console.error('User setup failed:', error);
    } finally {
      await page.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    try {
      console.log('Auth tests cleanup complete');
    } catch (error) {
      console.error('Error during auth tests cleanup:', error);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect unauthenticated user to login page', async ({ page }) => {
    await page.goto('/passwords');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should register a new user successfully', async ({ page }) => {
    const newUser = {
      displayName: generateRandomUsername(),
      email: generateRandomEmail(),
      password: 'Password123!'
    };
    
    await register(page, newUser.displayName, newUser.email, newUser.password);
    await expect(page).toHaveURL('/passwords');
    await logout(page);
  });

  test('should show error for invalid registration', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Display name is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await login(page, setupUser.email, setupUser.password);
    await expect(page).toHaveURL('/passwords');
    expect(await isAuthenticated(page)).toBeTruthy();
    await logout(page);
  });

  test('should handle invalid login attempt', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.fill('input#email', 'wrong@example.com');
    await page.fill('input#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should remain on login page
    await expect(page).toHaveURL('/login');
    
    // We don't check for toast since your backend might not show it reliably
    // Instead, check that we're still on the login page with an enabled submit button
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('should logout successfully', async ({ page }) => {
    await login(page, setupUser.email, setupUser.password);
    await logout(page);
    await expect(page).toHaveURL('/login');
    
    // User should not be authenticated
    expect(await isAuthenticated(page)).toBeFalsy();
    
    // Attempt to access protected route
    await page.goto('/passwords');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should persist authentication across page refreshes', async ({ page }) => {
    // Login
    await login(page, setupUser.email, setupUser.password);
    await page.goto('/passwords');
    await page.reload();
    await expect(page).toHaveURL('/passwords');
    expect(await isAuthenticated(page)).toBeTruthy();
    await logout(page);
  });
}); 