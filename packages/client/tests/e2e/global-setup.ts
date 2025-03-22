import { chromium, FullConfig } from '@playwright/test';

// Global setup will run once before all tests
async function globalSetup(config: FullConfig) {
  console.log('Starting global setup...');
  
  // You can set up global state here if needed
  // For example, create a shared admin user that will be used across tests
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Global setup complete');
  } catch (error) {
    console.error('Error during global setup:', error);
  } finally {
    await page.close();
    await browser.close();
  }
}

export default globalSetup; 