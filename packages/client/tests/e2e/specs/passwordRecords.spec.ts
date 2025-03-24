import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { createPasswordRecord, viewPasswordRecord, editPasswordRecord, deletePasswordRecord } from '../utils/records';
import { deleteAllPasswordRecords } from '../utils/cleanup';


const smallRandomString = () => Math.random().toString(36).substring(2, 15); // 7-15 characters
const testEmail = `records${smallRandomString()}@example.com`;
const testPassword = 'password123';
const smallUniqueSuffix = smallRandomString().slice(0, 5);
const testDisplayName = 'Records Test User' + smallUniqueSuffix;


const recordTitle = `Test Record ${smallUniqueSuffix}`;
const recordUsername = 'testuser ' + smallUniqueSuffix;
const recordPassword = 'securepassword123';
const recordUrl = 'https://example.com';

const updatedTitle = `Updated Record ${smallUniqueSuffix}`;
const updatedUsername = 'updateduser ' + smallUniqueSuffix;
const updatedPassword = 'updatedsecurepassword123';
const updatedUrl = 'https://updated-example.com';

test.describe('Password Records Management', () => {
  // Setup: Register and login before tests
  test.beforeEach(async ({ page }) => {
    // Try to login, if it fails (first run), register first
    try {
      await login(page, testEmail, testPassword);
    } catch (e) {
      await page.goto('/register');
      await page.fill('input[id="email"]', testEmail);
      await page.fill('input[id="display_name"]', testDisplayName);
      await page.fill('input[id="password"]', testPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL('/passwords');
    }
  });

  // Update the afterAll hook to use the cleanup utility
  test.afterAll(async ({ browser }) => {
    try {
      const page = await browser.newPage();
      await login(page, testEmail, testPassword);
      
      // Clean up all password records for this test user
      await deleteAllPasswordRecords(page);
      
      console.log('Password records tests cleanup complete');
      await page.close();
    } catch (error) {
      console.error('Error during password records tests cleanup:', error);
    }
  });

  test('should allow creating a new password record', async ({ page }) => {
    await createPasswordRecord(page, recordTitle, recordUsername, recordPassword, recordUrl);
    
    await page.goto('/passwords');
    await page.waitForTimeout(5000);
    await expect(page.locator(`h3:has-text("${recordTitle}")`)).toBeVisible();
  });

  test('should display password record details correctly', async ({ page }) => {
    const viewRecordTitle = `View ${smallRandomString()}`; // maximum : 20 characters
    const viewRecordUsername = 'viewUserName ' + smallRandomString();
    const viewRecordPassword = 'viewPassword';
    const viewRecordUrl = 'https://view-example.com';

    await createPasswordRecord(
      page, 
      viewRecordTitle,
      viewRecordUsername,
      viewRecordPassword,
      viewRecordUrl
    );

    
    await page.goto('/passwords');
    await expect(page.locator(`h3:has-text("${viewRecordTitle}")`)).toBeVisible();

    await page.click(`h3:has-text("${viewRecordTitle}")`);
    
    await expect(page.locator(`h1:has-text("${viewRecordTitle}")`)).toBeVisible();
    await expect(page.locator(`text=${viewRecordUsername}`)).toBeVisible();
    await expect(page.locator(`text=${viewRecordPassword}`)).toBeVisible();
    await expect(page.locator(`text=${viewRecordUrl}`)).toBeVisible();
  });

  test('should allow editing a password record', async ({ page }) => {

    const editRecordTitle = `Edit Test Record ${smallRandomString()}`;
    const editRecordUsername = 'edituser ' + smallRandomString();
    const editRecordPassword = 'editpassword';
    const editRecordUrl = 'https://edit-example.com';
    
    // Generate unique strings for the updated values
    const uniqueUpdateSuffix = smallRandomString();
    const localUpdatedTitle = `Updated Record ${uniqueUpdateSuffix}`;
    const localUpdatedUsername = 'updateduser ' + uniqueUpdateSuffix;
    const localUpdatedPassword = 'updated-secure-password-123';
    const localUpdatedUrl = 'https://updated-example.com/' + uniqueUpdateSuffix;
      
    await createPasswordRecord(
      page, 
      editRecordTitle, 
      editRecordUsername, 
      editRecordPassword, 
      editRecordUrl
    );
    

    await editPasswordRecord(
      page,
      editRecordTitle,
      localUpdatedTitle,
      localUpdatedUsername,
      localUpdatedPassword,
      localUpdatedUrl
    );
    
    // Verify the updated record appears in the list
    await page.goto('/passwords');
    await expect(page.locator(`h3:has-text("${localUpdatedTitle}")`)).toBeVisible();
    
    // View the updated record to verify details
    await viewPasswordRecord(page, localUpdatedTitle);
    await expect(page.locator(`text=${localUpdatedUsername}`)).toBeVisible();
    await expect(page.locator(`text=${localUpdatedPassword}`)).toBeVisible();
    await expect(page.locator(`text=${localUpdatedUrl}`)).toBeVisible();
  });

  test('should allow deleting a password record', async ({ page }) => {
    // First create a record to delete
    const deleteRecordTitle = `Delete Test Record ${smallRandomString()}`;
    await createPasswordRecord(
      page, 
      deleteRecordTitle, 
      'deleteuser', 
      'deletepassword', 
      'https://delete-example.com'
    );
    
    // Verify the record exists
    await page.goto('/passwords');
    await expect(page.locator(`h3:has-text("${deleteRecordTitle}")`)).toBeVisible();
    
    // Delete the record
    await deletePasswordRecord(page, deleteRecordTitle);
    
    // Refresh the page to ensure it's gone
    await page.reload();
    
    // Verify the record no longer exists
    await expect(page.locator(`h3:has-text("${deleteRecordTitle}")`)).not.toBeVisible();
  });

  test('should validate required fields when creating a record', async ({ page }) => {
    await page.goto('/passwords/new');
    
    // Submit empty form
    await page.click('button:has-text("Create Password Record")');
    
    // Verify validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Username is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    await expect(page.locator('text=URL is required')).toBeVisible();
  });
}); 