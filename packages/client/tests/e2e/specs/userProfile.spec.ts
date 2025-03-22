import { test, expect } from '@playwright/test';
import { login, register } from '../utils/auth';
import { cleanupUserTestData, deleteTestAccount } from '../utils/cleanup';

// Test data
const smallRandomString = () => {
  return Math.random().toString(36).substring(2, 15);
}

const uniqueSuffix = smallRandomString()

const testEmail = `profile${uniqueSuffix}@example.com`;
const testPassword = 'password123';
const testDisplayName = 'Test User ' + uniqueSuffix;

// Updated profile data
const updatedDisplayName = 'Updated User ' + uniqueSuffix;
const updatedEmail = `updated-profile${uniqueSuffix}@example.com`;
const newPassword = 'newpassword456';

test.describe('User Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Try to login first, only register if login fails
    try {
      await login(page, testEmail, testPassword);
    } catch (e) {
      // If login fails (first run), register the test user
      await register(page, testDisplayName, testEmail, testPassword);
    }
  });

  test('should display user profile correctly', async ({ page }) => {
    await page.goto('/profile/edit');
    await expect(page.locator('input[id="display_name"]')).toHaveValue(testDisplayName);
    await expect(page.locator('input[id="email"]')).toHaveValue(testEmail);
  });

  test('should allow updating display name', async ({ page }) => {
    await page.goto('/profile/edit');
    await page.fill('input[id="display_name"]', updatedDisplayName);
    await page.fill('input[id="current_password"]', testPassword);
    await page.click('button:has-text("Update")');

    //expect redirect to passwords page
    await expect(page).toHaveURL('/passwords'); 

    //go to profile page and check if the display name is updated
    await page.click('text=My Profile');
    //increase timeout
    await page.waitForTimeout(5000);
    await expect(page.locator('input[id="display_name"]')).toHaveValue(updatedDisplayName);
    await page.fill('input[id="display_name"]', testDisplayName);
    await page.fill('input[id="current_password"]', testPassword);
    await page.click('button:has-text("Update")');
  });

  test('should allow updating email address', async ({ page }) => {
    await page.goto('/profile/edit');
    await page.fill('input[id="email"]', updatedEmail);
    await page.fill('input[id="current_password"]', testPassword);
    await page.click('button:has-text("Update")');
    
    //expect redirect to passwords page
    await expect(page).toHaveURL('/passwords'); 

    //go to profile page and check if the email is updated
    await page.click('text=My Profile');
    await page.waitForTimeout(5000);
    await expect(page.locator('input[id="email"]')).toHaveValue(updatedEmail);

    await page.click('button:has-text("Logout")');
    await login(page, updatedEmail, testPassword);
    
    await expect(page).toHaveURL('/passwords');
    
    // Reset email back
    // await page.goto('/profile/edit');
    // await page.fill('input[id="email"]', testEmail);
    // await page.fill('input[id="current_password"]', testPassword);
    // await page.click('button:has-text("Update")');

    //expect redirect to passwords page
    // await expect(page).toHaveURL('/passwords'); 
  });

  test('should allow changing password', async ({ page }) => {
    // Navigate to profile edit page
    await page.goto('/profile/edit');
    
    // Update password
    await page.fill('input[id="password"]', newPassword);
    await page.fill('input[id="password_confirmation"]', newPassword);
    await page.fill('input[id="current_password"]', testPassword);
    
    // Submit form
    await page.click('button:has-text("Update")');
    
    // Verify success message
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
    
    // Logout and try to login with new password
    await page.click('button:has-text("Logout")');
    await login(page, testEmail, newPassword);
    
    // Verify we can login with new password
    await expect(page).toHaveURL('/passwords');
    
    // Reset password for other tests
    await page.goto('/profile/edit');
    await page.fill('input[id="password"]', testPassword);
    await page.fill('input[id="password_confirmation"]', testPassword);
    await page.fill('input[id="current_password"]', newPassword);
    // await page.click('button:has-text("Update")');
  });

  test('should show validation errors for invalid profile updates', async ({ page }) => {
    await page.goto('/profile/edit');
    await page.fill('input[id="display_name"]', '');
    await page.click('button:has-text("Update")');
    await expect(page.locator('text=Display name is required')).toBeVisible();
    await page.fill('input[id="email"]', 'invalid-email');

    await page.click('button:has-text("Update")');

    await expect(page.locator('text=Invalid email address')).toBeVisible();
    
    await page.fill('input[id="password"]', 'password1');
    await page.fill('input[id="password_confirmation"]', 'password2');
    
    await page.click('button:has-text("Update")');
    
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should require current password for any profile changes', async ({ page }) => {
    // Navigate to profile edit page
    await page.goto('/profile/edit');
    
    // Update display name but don't provide current password
    await page.fill('input[id="display_name"]', 'New Name');
    await page.fill('input[id="current_password"]', ''); // Clear current password
    
    // Submit form
    await page.click('button:has-text("Update")');
    
    // Verify validation error
    await expect(page.locator('text=Current password is required')).toBeVisible();
  });


  // test('should allow account deletion', async ({ page }) => {
  //   // Create a user specifically for deletion
  //   const deleteEmail = `delete${uniqueSuffix}@example.com`;
  //   await page.click('button:has-text("Logout")');
  //   await register(page, deleteEmail, 'Delete User', testPassword);
    
  //   // Navigate to profile edit page
  //   await page.goto('/profile/edit');
    
  //   // Locate and click delete account button
  //   await page.click('button:has-text("Cancel my account")');
    
  //   // Handle confirmation dialog
  //   // increase timeout
  //   await page.waitForTimeout(5000);
  //   page.once('dialog', dialog => dialog.accept());
    
  //   // Verify redirect to login page
  //   await page.waitForURL('/login');
    
  //   // Try to login with the deleted account
  //   await page.fill('input[id="email"]', deleteEmail);
  //   await page.fill('input[id="password"]', testPassword);
  //   await page.click('button[type="submit"]');
    
  //   // Verify login fails
  //   await expect(page.locator('text=Invalid email or password')).toBeVisible();
  // });
});

// Update the afterAll hook
// test.afterAll(async ({ browser }) => {
//   try {
//     const page = await browser.newPage();
    
//     // Try to clean up both test emails (original and updated)
//     try {
//       await login(page, testEmail, testPassword);
//       await cleanupUserTestData(page, testEmail, testPassword);
//     } catch (e) {
//       // If login with original email fails, try the updated email
//       try {
//         await login(page, updatedEmail, testPassword);
//         await cleanupUserTestData(page, updatedEmail, testPassword);
//       } catch (e2) {
//         console.log('Could not log in with either test email for cleanup');
//       }
//     }
    
//     console.log('User profile tests cleanup complete');
//     await page.close();
//   } catch (error) {
//     console.error('Error during user profile tests cleanup:', error);
//   }
// }); 