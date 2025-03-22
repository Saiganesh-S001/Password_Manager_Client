import { test, expect } from '@playwright/test';
import { login, register } from '../utils/auth';
import { createPasswordRecord, sharePasswordRecord } from '../utils/records';
import { deleteAllPasswordRecords, revokeAllSharedRecords } from '../utils/cleanup';

const smallRandomString = () => {
  return Math.random().toString(36).substring(2, 15);
}

// Base test data
const testPassword = 'password123';

test.describe('Password Records Sharing', () => {
  // Create users before all tests
  let ownerCredentials;
  let collaboratorCredentials;
  
  // Create contexts that can be reused
  let ownerContext;
  let collaboratorContext;
  let ownerPage;
  let collaboratorPage;

  // Setup: Create users and contexts
  test.beforeAll(async ({ browser }) => {
    // Generate unique credentials for owner and collaborator that will be used in all tests
    ownerCredentials = {
      email: `owner_main_${smallRandomString()}@example.com`,
      displayName: `Owner Main ${smallRandomString()}`,
      password: testPassword
    };
    
    collaboratorCredentials = {
      email: `collab_main_${smallRandomString()}@example.com`,
      displayName: `Collab Main ${smallRandomString()}`,
      password: testPassword
    };

    try {
      // Create browser contexts that will be reused across tests
      ownerContext = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: { dir: 'test-results/videos/' }
      });
      
      collaboratorContext = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: { dir: 'test-results/videos/' }
      });
      
      // Create and save pages
      ownerPage = await ownerContext.newPage();
      collaboratorPage = await collaboratorContext.newPage();
      
      // Register both users
      await register(ownerPage, ownerCredentials.displayName, ownerCredentials.email, ownerCredentials.password);
      await register(collaboratorPage, collaboratorCredentials.displayName, collaboratorCredentials.email, collaboratorCredentials.password);
      
      // Log both users in for the tests
      await login(ownerPage, ownerCredentials.email, ownerCredentials.password);
      await login(collaboratorPage, collaboratorCredentials.email, collaboratorCredentials.password);
    } catch (error) {
      console.error('Error in beforeAll setup:', error);
      throw error;
    }
  });
  
  test.afterAll(async () => {
    try {
      // Clean up shared records first
      //await revokeAllSharedRecords(ownerPage);
      
      // Clean up all password records
      // await deleteAllPasswordRecords(ownerPage);
      // await deleteAllPasswordRecords(collaboratorPage);
      
      // Close pages and contexts
      if (ownerPage) await ownerPage.close();
      if (collaboratorPage) await collaboratorPage.close();
      if (ownerContext) await ownerContext.close();
      if (collaboratorContext) await collaboratorContext.close();
      
      console.log('Sharing tests cleanup complete');
    } catch (error) {
      console.error('Error in afterAll cleanup:', error);
    }
  });

  test('should allow sharing a password record with another user', async () => {
    // Generate unique test data for this test
    const uniqueSuffix = smallRandomString();
    const recordTitle = `Shared Record ${uniqueSuffix}`;
    const recordUsername = `shareduser ${uniqueSuffix}`;
    const recordPassword = 'sharedpassword123';
    const recordUrl = 'https://shared-example.com';
    
    try {
      // Navigate to passwords page and create a new record
      await createPasswordRecord(
        ownerPage, 
        recordTitle, 
        recordUsername, 
        recordPassword, 
        recordUrl
      );
      
      await ownerPage.goto('/passwords');
      
      // Wait for the ShareForm to be visible
      await ownerPage.waitForSelector('h2:has-text("Share Access")');
      
      // Share the record with collaborator
      await ownerPage.fill('input[type="email"]', collaboratorCredentials.email);
      
      const dropdown = ownerPage.locator('select');
      await dropdown.selectOption({ label: recordTitle });
      
      await ownerPage.click('button:has-text("Share Access")');
      
      // Verify sharing was successful
      await expect(ownerPage.locator('text=shared successfully')).toBeVisible({ timeout: 5000 });
    } catch (error) {
      console.error('Error in sharing test:', error);
      throw error;
    }
  });

  test('collaborator should see shared records', async () => {
    // Generate unique test data for this test
    const uniqueSuffix = smallRandomString();
    const recordTitle = `Shared Record ${uniqueSuffix}`;
    const recordUsername = `shareduser ${uniqueSuffix}`;
    const recordPassword = 'sharedpassword123';
    const recordUrl = 'https://shared-example.com';

    try {
      // Create a new record
      await createPasswordRecord(
        ownerPage,
        recordTitle, 
        recordUsername, 
        recordPassword, 
        recordUrl
      );

      // Share the record with collaborator
      await sharePasswordRecord(
        ownerPage,
        recordTitle, 
        collaboratorCredentials.email
      );

      // Check that the collaborator can see the shared record
      await collaboratorPage.goto('/passwords');
      
      await expect(collaboratorPage.locator(`h3:has-text("${recordTitle}")`)).toBeVisible({ timeout: 10000 });
      
      // View the record details
      await collaboratorPage.click(`h3:has-text("${recordTitle}")`);
      
      // Verify record details
      await expect(collaboratorPage.locator(`h1:has-text("${recordTitle}")`)).toBeVisible();
      await expect(collaboratorPage.locator(`text=${recordUsername}`)).toBeVisible();
      await expect(collaboratorPage.locator(`text=${recordPassword}`)).toBeVisible();
      await expect(collaboratorPage.locator(`text=${recordUrl}`)).toBeVisible();
    } catch (error) {
      console.error('Error in collaborator view test:', error);
      throw error;
    }
  });

  test('owner should see list of records shared by them', async () => {
    // Generate unique test data for this test
    const uniqueSuffix = smallRandomString();
    const recordTitle = `Shared Record ${uniqueSuffix}`;
    const recordUsername = `shareduser ${uniqueSuffix}`;
    const recordPassword = 'sharedpassword123';
    const recordUrl = 'https://shared-example.com';
    
    try {
      // Create a new record
      await createPasswordRecord(
        ownerPage,
        recordTitle, 
        recordUsername, 
        recordPassword, 
        recordUrl
      );

      // Share the record with collaborator
      await sharePasswordRecord(
        ownerPage,
        recordTitle, 
        collaboratorCredentials.email
      );
      
      // Refresh the page to see the updated list
      await ownerPage.goto('/passwords');
      
      // Wait for the shared records list and verify
      await ownerPage.waitForSelector('h3:has-text("Users with Access")', { timeout: 10000 });
      
      await expect(ownerPage.locator(`text=${collaboratorCredentials.email}`)).toBeVisible();
      await expect(ownerPage.locator(`p:has-text("${recordTitle}")`)).toBeVisible();
    } catch (error) {
      console.error('Error in owner shared list test:', error);
      throw error;
    }
  });

  test('owner should be able to revoke access to shared record', async () => {
    // Generate unique test data for this test
    const uniqueSuffix = smallRandomString();
    const recordTitle = `Shared Record ${uniqueSuffix}`;
    const recordUsername = `shareduser ${uniqueSuffix}`;
    const recordPassword = 'sharedpassword123';
    const recordUrl = 'https://shared-example.com';
    
    try {
      // Create a new record
      await createPasswordRecord(
        ownerPage,
        recordTitle, 
        recordUsername, 
        recordPassword, 
        recordUrl
      );

      // Share the record with collaborator
      await sharePasswordRecord(
        ownerPage,
        recordTitle, 
        collaboratorCredentials.email
      );
      
      // Refresh the page to see the updated list
      await ownerPage.goto('/passwords');
      
      // Find the user with access
      const userItem = ownerPage.locator(`li:has-text("${collaboratorCredentials.email}")`);
      
      // Click the Manage Access dropdown
      await userItem.locator('button:has-text("Manage Access")').click();
      
      // Click to remove the specific record
      await ownerPage.locator(`button:has-text("Remove ${recordTitle}")`).click();

      // Wait for success message
      await ownerPage.waitForSelector('text=Access revoked successfully', { timeout: 10000 });
      
      // Refresh collaborator's view to check access was revoked
      await collaboratorPage.goto('/passwords');
      
      // Verify the record is no longer visible to collaborator
      await expect(collaboratorPage.locator(`h3:has-text("${recordTitle}")`)).not.toBeVisible();
    } catch (error) {
      console.error('Error in revoking access test:', error);
      throw error;
    }
  });
}); 