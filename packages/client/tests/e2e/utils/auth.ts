import {expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Login to the application with the provided credentials
 * @param page Playwright page object
 * @param email User email
 * @param password User password
 */
export async function login(page: Page, email: string, password: string): Promise<void> {
  // Check if already on passwords page and logged in
  if (page.url().includes('/passwords')) {
    // Check if already logged in
    const isAlreadyLoggedIn = await isAuthenticated(page);
    if (isAlreadyLoggedIn) {
      return; // Already logged in, no need to proceed
    }
  }

  await page.goto('/login');
  
  // Wait for the login form to be visible
  await page.waitForSelector('input#email', { state: 'visible' });
  
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  
  await page.click('button[type="submit"]');
  
  // Wait for redirection to passwords page
  await page.waitForURL('/passwords', { timeout: 10000 });
}

/**
 * Attempt login with invalid credentials to test error handling
 * @param page Playwright page object
 * @param email User email
 * @param password User password
 */
export async function attemptInvalidLogin(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.fill('input#email', email);
  await page.fill('input#password', password);

  await page.click('button[type="submit"]');
  
  // No redirection should happen for invalid login
  await expect(page).toHaveURL('/login');
}

/**
 * Register a new user with the provided details
 * @param page Playwright page object
 * @param displayName User display name
 * @param email User email
 * @param password User password
 */
export async function register(page: Page, displayName: string, email: string, password: string): Promise<void> {
  await page.goto('/register');

  // Check if already on passwords page (already logged in)
  if (page.url().includes('/passwords')) {
    return; // Already logged in, no need to register
  }

  // Wait for the registration form to be visible
  await page.waitForSelector('input#display_name', { state: 'visible' });
  
  // Fill in the form
  await page.fill('input#display_name', displayName);
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  
  // Submit the form and wait for potential redirects or errors
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ timeout: 20000 }).catch(() => {}) // Catch navigation errors
  ]);
  
  // Check for errors first
  const hasErrors = await page.locator('text="Email has already been taken"').count() > 0;
  if (hasErrors) {
    // If email already exists, try to log in instead
    await login(page, email, password);
    return;
  }
  
  // Otherwise, wait for successful registration (redirect to passwords page)
  await page.waitForURL('/passwords', { timeout: 20000 });
}

/**
 * Log out the currently logged in user
 * @param page Playwright page object
 */
export async function logout(page: Page): Promise<void> {
  await page.click('text=Logout');
  
  // Wait for the programmed delay (2 seconds + buffer)
  await page.waitForTimeout(2500);
  // reload the page
  await page.reload();
  
  // Wait for redirect to login page
  await page.waitForURL('/login', { timeout: 5000 });
}

/**
 * Generate a random email for testing
 * @returns A random email string
 */
export function generateRandomEmail(): string {
  return `test${Math.floor(Math.random() * 100000)}@example.com`;
}

/**
 * Check if user is authenticated by looking for Logout button
 * @param page Playwright page object
 * @returns Boolean indicating if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    await page.waitForSelector(':has-text("Logout")', { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
} 

/**
 * Generate a random username for testing
 * @returns A random username string
 */
export function generateRandomUsername(): string {
  return `test${Math.floor(Math.random() * 100000)}`;
}

/**
 * Check if a toast with specific text is visible
 * @param page Playwright page object  
 * @param text Text to look for in toast
 * @returns Promise<boolean> indicating if toast is visible
 */
export async function isToastVisible(page: Page, text: string): Promise<boolean> {
  try {
    // More lenient toast selector that doesn't rely on specific class
    await page.waitForSelector(`div[role="alert"]:has-text("${text}")`, { 
      timeout: 2000,
      state: 'visible'
    });
    return true;
  } catch {
    return false;
  }
}