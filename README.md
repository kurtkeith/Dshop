# DShop — DOrSU Student Marketplace

DShop is a front-end class-project prototype where Davao Oriental State University students can post items for sale, browse listings, add items to a cart, see the total update, and place a demo order.

## Features
- Browse student listings and search by keyword.
- Click a product card to open its details, including seller name/contact, meet-up place, date, and time.
- Sellers can optionally upload a product photo (maximum 1 MB).
- Filter listings by category.
- Post a product with required-field, price, date, and meet-up validation.
- Add items to a cart, change quantities, remove items, and see totals recalculate.
- Place a demo order and view recent orders.
- Save products, cart, and orders in browser LocalStorage so they remain after reload.

## Design
- Blue and white visual theme.
- Product detail modal shows seller, contact, meet-up location, date, and time.

## Technology and MVC
- HTML5, CSS3, Vanilla JavaScript (ES modules).
- `js/model.js`: owns the exported state, data changes, calculations, and LocalStorage.
- `js/views/View.js`: reusable base View with `render()` and `_clear()`.
- `js/views/*.js`: child views extend `View`; they create markup and expose event-handler methods. They do not import the model.
- `js/controller.js`: imports the model and views, connects handlers, calls model functions, and re-renders views. It does not build HTML.
- `index.html` and `css/style.css`: page structure and styling.

## Run in VS Code
1. Extract `DShop-Student-Marketplace.zip`.
2. Open the extracted `DShop-Student-Marketplace` folder in VS Code (`File > Open Folder`).
3. Install the **Live Server** extension if it is not already installed.
4. In VS Code Explorer, right-click `index.html` and choose **Open with Live Server**.
5. The app opens in your browser. Try adding a listing, adding it to the cart, changing quantity, placing a demo order, and refreshing the page.

Do not double-click `index.html` to run it; ES modules should be served through a local server.

## Important project limitations
- This is a front-end prototype, not a production marketplace.
- There is no real account authentication, backend database, chat, delivery service, or payment processing. The Buy now button adds the item to the local demo cart; it does not charge money or notify the seller.
- LocalStorage is specific to the browser/device. It does not synchronize listings between students or across devices.
- Do not enter sensitive personal information or real payment details.
- Product listings and demo orders are sample/local browser data only.

## Suggested group work split (adapt to your actual group)
- Member 1: `ProductView.js` and marketplace/search/filter controller functions.
- Member 2: `SellView.js` and product validation/add-listing controller function.
- Member 3: `CartView.js` and cart/checkout controller functions.
- If there is a fourth member, assign `StatsView.js` / `OrdersView.js`, testing, or documentation. Every member must make meaningful commits and explain their own code.

## GitHub Pages
1. Create a public GitHub repository named `DShop`.
2. Upload the contents of this folder (not just the ZIP).
3. Go to **Settings > Pages**.
4. Under Build and deployment, select **Deploy from a branch**, choose `main` and `/ (root)`, then Save.
5. Wait for the Pages URL to appear. Test the live link in a private/incognito window.
6. Note: LocalStorage data is stored in each visitor's own browser; students do not share listings.

## AI-use disclosure
This starter code was generated with AI assistance. Your group must read, test, adapt, and understand every line before submitting. Disclose ChatGPT and the files/functions you used or changed in Section 11 of the report. Do not claim code as independently written if AI helped generate it.


### Order receipt confirmation
Recent orders show their purchased items, total, and receipt status. After physically collecting all items in an order, the buyer can select **Mark as received** and confirm. The order then displays a green **Received** status and the confirmation date/time. This is a local front-end demonstration; it does not verify delivery with a seller or courier.


### Manage your own listings
Products posted from the Sell an item form display a **Delete listing** button on their Marketplace card. Select it and confirm to remove the listing. Removing a listing also removes it from the current browser's cart, while completed order history is preserved. Starter/demo products cannot be deleted. Listings are stored in this browser's LocalStorage, so this is a local prototype rather than a shared multi-user marketplace.
