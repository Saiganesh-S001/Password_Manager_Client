import type { Page } from '@playwright/test';
import { login } from './auth';

/**
 * Delete password record by title
 */
export async function deletePasswordRecord(page: Page, title: string): Promise<void> {
  try {
    await page.goto('/passwords');
    
    // Find the record with the given title
    const recordRow = page.locator(`div:has(h3:has-text("${title}"))`).first();
    
    // Set up dialog handler before triggering the action
    page.once('dialog', dialog => dialog.accept());
    
    // Click delete button
    await recordRow.locator('button:has-text("Delete")').click();
    
    // Wait for confirmation or for the record to disappear
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error(`Error deleting password record "${title}":`, error);
  }
}

/**
 * Delete all password records for the current user
 */
export async function deleteAllPasswordRecords(page: Page): Promise<void> {
  try {
    await page.goto('/passwords');
    
    // Set up dialog handler to accept all confirmation dialogs
    page.on('dialog', dialog => dialog.accept());
    
    // Find all delete buttons for records
    const deleteButtons = page.locator('button:has-text("Delete")');
    const count = await deleteButtons.count();
    
    // Click each delete button
    for (let i = 0; i < count; i++) {
      // Note: We always click the first button since the DOM changes after each deletion
      await deleteButtons.first().click();
      await page.waitForTimeout(500); // Brief delay to let the deletion process
    }
    
    // Remove the dialog handler
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error('Error deleting all password records:', error);
  }
}

/**
 * Revoke all shared records
 */
export async function revokeAllSharedRecords(page: Page): Promise<void> {
  try {
    await page.goto('/passwords');
    
    // Look for users with access
    const userItems = page.locator('li:has-text("@example.com")');
    const count = await userItems.count();
    
    for (let i = 0; i < count; i++) {
      const userItem = userItems.nth(i);
      
      // Click the Manage Access dropdown
      await userItem.locator('button:has-text("Manage Access")').click();
      
      // Click "Revoke All Access" button
      await page.locator('button:has-text("Revoke All Access")').click();
      
      // Wait for the revocation to complete
      await page.waitForTimeout(1000);
    }
  } catch (error) {
    console.error('Error revoking shared records:', error);
  }
}

/**
 * Delete test user account if possible
 */
export async function deleteTestAccount(page: Page): Promise<void> {
  try {
    await page.goto('/profile/edit');
    
    // Look for the cancel account button
    const cancelButton = page.locator('button:has-text("Cancel my account")');
    
    if (await cancelButton.isVisible()) {
      // Set up dialog handler for confirmation
      page.once('dialog', dialog => dialog.accept());
      
      // Click the cancel account button
      await cancelButton.click();
      
      // Wait for redirect to login page
      await page.waitForTimeout(2000);
    }
  } catch (error) {
    console.error('Error deleting test account:', error);
  }
}

/**
 * Clean up all test data for a user
 */
export async function cleanupUserTestData(page: Page, email: string, password: string): Promise<void> {
  try {
    // Log in as the user
    await login(page, email, password);
    
    // Delete all password records
    await deleteAllPasswordRecords(page);
    
    // Revoke all shared records
    await revokeAllSharedRecords(page);
    
    // Delete the test account
    await deleteTestAccount(page);
  } catch (error) {
    console.error(`Error cleaning up test data for ${email}:`, error);
  }
} 