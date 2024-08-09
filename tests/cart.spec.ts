const { test, expect } = require('@playwright/test');

// test.describe('Restaurant and DishCard Interaction', () => {
//   test('should load a restaurant card, click on it, and add a dish to the cart', async ({ page }) => {
//     // Navigate to the home page where the restaurant list is displayed
//     await page.goto('http://localhost:3000'); // Adjust the URL as necessary

//     // Wait for the restaurant card to appear
//     await page.waitForSelector('[data-testid="restaurant-card"]');

//     // Click on the first restaurant card
//     await page.click('[data-testid="restaurant-card"]');

//     // Wait for the dish card to appear on the restaurant page
//     await page.waitForSelector('[data-testid="add-to-cart-button"]');

//     // Click on the "Add to Cart" button of the first dish card
//     await page.click('[data-testid="add-to-cart-button"]');
//   });
// });

test.describe('Home Page Static Content', () => {
    test('should display the correct title and description on the home page', async ({ page }) => {
      // Navigate to the home page
      await page.goto('http://localhost:3000'); // Adjust the URL as necessary
  
      // Check if the title is present and correct
      const title = await page.textContent('h1');
      expect(title).toBe("Giuseppe's Pizzeria Collective");
  
      // Check if the introductory paragraph is present and correct
      const description = await page.textContent('p.text-md');
      expect(description).toBe(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.'
      );
    });
  });