import { chromium, FullConfig } from '@playwright/test';
import { cleanupUserTestData } from './utils/cleanup';

// List of test users to clean up - you may want to generate this dynamically
// or store in an environment variable or file
const TEST_USERS = [
  { email: 'testuser_fixed@example.com', password: 'Password123!' },
  // Add more users that are consistently used in tests
];

// Global teardown will run once after all tests
async function globalTeardown(config: FullConfig) {
  console.log('Starting global teardown...');
  
  const browser = await chromium.launch();
  
  try {
    // Clean up each test user
    for (const user of TEST_USERS) {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      try {
        await cleanupUserTestData(page, user.email, user.password);
      } catch (error) {
        console.error(`Error cleaning up test user ${user.email}:`, error);
      } finally {
        await context.close();
      }
    }
    
    // Additional global cleanup logic
    console.log('Global teardown complete');
  } catch (error) {
    console.error('Error during global teardown:', error);
  } finally {
    await browser.close();
  }
}

export default globalTeardown; 