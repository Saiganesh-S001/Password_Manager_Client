import type { Page } from '@playwright/test';

export async function createPasswordRecord(
  page: Page, 
  title: string, 
  username: string, 
  password: string, 
  url: string
) {
  await page.goto('/passwords/new');
  await page.fill('input[id="title"]', title);
  await page.fill('input[id="username"]', username);
  await page.fill('input[id="password"]', password);
  await page.fill('input[id="url"]', url);
  await page.click('button:has-text("Create Password Record")');
  await page.waitForURL('/');
}

export async function viewPasswordRecord(page: Page, title: string) {
  await page.goto('/passwords');
  await page.click(`h3:has-text("${title}")`);
  await page.waitForSelector(`h1:has-text("${title}")`);
}

export async function editPasswordRecord(
  page: Page, 
  title: string, 
  newTitle: string, 
  newUsername: string, 
  newPassword: string, 
  newUrl: string
) {
    
  await viewPasswordRecord(page, title);
  
  // Click the edit button
  await page.click('button:has-text("Edit this record")');
  
  // Wait for the edit form to be fully loaded
  await page.waitForSelector('input[id="title"]', { state: 'visible' });
  
  // Clear each field first before filling them
  await page.fill('input[id="title"]', '');
  await page.fill('input[id="username"]', '');
  await page.fill('input[id="password"]', '');
  await page.fill('input[id="url"]', '');
  
  // Use a short delay between clearing and filling to ensure stability
  await page.waitForTimeout(300);
  
  // Fill in the new values
  await page.fill('input[id="title"]', newTitle);
  
  // Wait for the title field to have the correct value using a simpler approach
  await page.waitForFunction(`document.querySelector('input[id="title"]')?.value === "${newTitle}"`, {}, { timeout: 5000 });
  
  await page.fill('input[id="username"]', newUsername);
  await page.fill('input[id="password"]', newPassword);
  await page.fill('input[id="url"]', newUrl);
  
  // Ensure all values are filled before submitting using a safer check
  await page.waitForFunction(`
    document.querySelector('input[id="title"]')?.value && 
    document.querySelector('input[id="username"]')?.value && 
    document.querySelector('input[id="password"]')?.value && 
    document.querySelector('input[id="url"]')?.value
  `, {}, { timeout: 5000 });
  
  // Submit the form
  await page.click('button:has-text("Update Password Record")');
  
  // Wait for navigation back to passwords page
  await page.waitForURL('/passwords');
  await page.waitForTimeout(1000); // Additional wait to ensure UI is updated
}

export async function deletePasswordRecord(page: Page, title: string) {
  await page.goto('/passwords');
  
  // Find the record row using a more specific locator
  const recordRow = page.locator(`div:has(h3:has-text("${title}"))`).first();
  
  // Set up dialog handler before triggering the action
  page.once('dialog', dialog => dialog.accept());
  
  // Click delete button
  await recordRow.locator('button:has-text("Delete")').click();
  
  // Wait for confirmation or for the record to disappear
  await page.waitForTimeout(1000);
}

export async function sharePasswordRecord(page: Page, title: string, email: string) {
  // Go to the passwords page where the ShareForm is available
  await page.goto('/passwords');
  
  // Wait for the form to be visible
  await page.waitForSelector('h2:has-text("Share Access")');
  
  // Fill in the email
  await page.fill('input[type="email"]', email);
  
  // Select the record from dropdown
  const dropdown = page.locator('select');
  await dropdown.selectOption({ label: title });
  
  // Submit the form
  await page.click('button:has-text("Share Access")');
  
  // Wait for sharing confirmation
//   await page.waitForSelector('text=sharing...', { timeout: 5000 });
  await page.waitForSelector('text=shared successfully', { timeout: 5000 });
  await page.waitForTimeout(1000);
} 