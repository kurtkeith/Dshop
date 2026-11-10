// Controller is the only layer that connects Views and the Model.
import * as model from './model.js';
import productView from './views/ProductView.js';
import sellView from './views/SellView.js';
import cartView from './views/CartView.js';
import statsView from './views/StatsView.js';
import ordersView from './views/OrdersView.js';
import productDetailView from './views/ProductDetailView.js';

function renderAll() {
  const search = document.querySelector('#search-input').value.trim().toLowerCase();
  const category = document.querySelector('#category-filter').value;
  const filtered = model.state.products.filter(product => {
    const matchesText = `${product.name} ${product.description} ${product.seller}`.toLowerCase().includes(search);
    const matchesCategory = category === 'All' || product.category === category;
    return matchesText && matchesCategory;
  });
  productView.render({ products: filtered });
  cartView.render({ items: model.getCartDetails(), total: model.getCartTotal() });
  statsView.render(model.getSummary());
  ordersView.render(model.state.orders);
  document.querySelector('#cart-count').textContent = model.getSummary().cartCount;
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function controlAddToCart(productId) {
  if (model.addToCart(productId)) {
    renderAll();
    showToast('Item added to your cart.');
  }
}

function controlOpenProductDetails(productId) {
  const product = model.state.products.find(item => item.id === productId);
  if (product) productDetailView.render(product);
}

function controlBuyNow(productId) {
  productDetailView.close();
  controlAddToCart(productId);
  document.querySelector('#cart').scrollIntoView({ behavior: 'smooth' });
}

function controlDeleteProduct(productId, closeDetailsAfterDelete = false) {
  const product = model.state.products.find(item => item.id === productId);
  if (!product) return;
  const confirmed = window.confirm(`Delete your listing \"${product.name}\"? This action cannot be undone.`);
  if (!confirmed) return;
  if (model.deleteProduct(productId)) {
    if (closeDetailsAfterDelete) productDetailView.close();
    renderAll();
    showToast('Your product listing has been deleted.');
  } else {
    showToast('This listing cannot be deleted from this account.');
  }
}

function controlAddProduct(data) {
  model.addProduct(data);
  renderAll();
  showToast('Your product listing has been published.');
}

function controlUpdateQuantity(productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 99) {
    showToast('Quantity must be from 0 to 99.');
    renderAll();
    return;
  }
  model.updateCartQuantity(productId, quantity);
  renderAll();
}

function controlRemoveFromCart(productId) {
  model.removeFromCart(productId);
  renderAll();
  showToast('Item removed from cart.');
}

function controlMarkOrderReceived(orderId) {
  if (!window.confirm('Have you collected all item(s) in this order? Mark this order as received?')) return;
  if (model.markOrderReceived(orderId)) {
    renderAll();
    showToast('Order marked as received. Thank you!');
  }
}

function controlCheckout() {
  const order = model.checkout();
  if (!order) return showToast('Your cart is empty.');
  renderAll();
  showToast(`Demo order ${order.id} placed.`);
}

function init() {
  // Render the sell form before attaching its delegated event handlers.
  // Without this call, #sell-form stays empty and students cannot publish items.
  sellView.render({});

  productView.addHandlerAddToCart(controlAddToCart);
  productView.addHandlerOpenDetails(controlOpenProductDetails);
  productView.addHandlerDelete(controlDeleteProduct);
  productView.addHandlerFilter(renderAll);
  productDetailView.addHandlerClose(() => productDetailView.close());
  productDetailView.addHandlerBuy(controlBuyNow);
  productDetailView.addHandlerDelete(productId => controlDeleteProduct(productId, true));
  sellView.addHandlerSubmit(controlAddProduct);
  ordersView.addHandlerMarkReceived(controlMarkOrderReceived);
  cartView.addHandlerQuantity(controlUpdateQuantity);
  cartView.addHandlerRemove(controlRemoveFromCart);
  cartView.addHandlerCheckout(controlCheckout);
  renderAll();
}

init();
