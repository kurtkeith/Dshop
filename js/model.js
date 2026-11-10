const STORAGE_KEY = 'dshop_state_v1';

const starterProducts = [
  { id: 'p1', name: 'Introduction to Programming', category: 'Books', price: 180, seller: 'Mika R.', description: 'Pre-loved programming book, good condition.', emoji: '📚' },
  { id: 'p2', name: 'Scientific Calculator', category: 'School Supplies', price: 350, seller: 'Joshua P.', description: 'Working calculator for math and engineering subjects.', emoji: '🧮' },
  { id: 'p3', name: 'Wireless Earphones', category: 'Gadgets', price: 420, seller: 'Anne C.', description: 'Compact earphones with charging case.', emoji: '🎧' },
  { id: 'p4', name: 'Campus Tote Bag', category: 'Clothing', price: 120, seller: 'Kyle D.', description: 'Reusable tote bag for everyday campus use.', emoji: '👜' },
  { id: 'p5', name: 'Homemade Cookies', category: 'Food', price: 55, seller: 'Bea L.', description: 'Freshly packed snack. Meet-up on campus.', emoji: '🍪' },
  { id: 'p6', name: 'Blue Notebook Set', category: 'School Supplies', price: 75, seller: 'Renz M.', description: 'Set of three unused notebooks.', emoji: '📒' }
];

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.warn('DShop data could not be loaded:', error);
  }
  return { products: starterProducts, cart: [], orders: [] };
}

export const state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addProduct(productData) {
  const product = {
    id: `p${Date.now()}`,
    name: productData.name.trim(),
    category: productData.category,
    price: Number(productData.price),
    seller: productData.seller.trim(),
    description: productData.description.trim(),
    emoji: productData.emoji || '📦',
    image: productData.image || '',
    meetupPlace: productData.meetupPlace.trim(),
    meetupDate: productData.meetupDate,
    meetupTime: productData.meetupTime,
    contact: productData.contact.trim(),
    isOwner: true
  };
  state.products.unshift(product);
  saveState();
  return product;
}


export function deleteProduct(productId) {
  const product = state.products.find(item => item.id === productId);
  if (!product) return false;

  // Only listings created by the current browser user can be removed.
  const starterIds = new Set(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);
  const isUserListing = product.isOwner === true || !starterIds.has(product.id);
  if (!isUserListing) return false;

  state.products = state.products.filter(item => item.id !== productId);
  state.cart = state.cart.filter(item => item.productId !== productId);
  saveState();
  return true;
}

export function addToCart(productId) {
  const product = state.products.find(item => item.id === productId);
  if (!product) return false;
  const existing = state.cart.find(item => item.productId === productId);
  if (existing) existing.quantity += 1;
  else state.cart.push({ productId, quantity: 1 });
  saveState();
  return true;
}

export function updateCartQuantity(productId, quantity) {
  const cartItem = state.cart.find(item => item.productId === productId);
  if (!cartItem) return;
  if (quantity <= 0) state.cart = state.cart.filter(item => item.productId !== productId);
  else cartItem.quantity = Math.min(99, quantity);
  saveState();
}

export function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.productId !== productId);
  saveState();
}

export function getCartDetails() {
  return state.cart.map(cartItem => {
    const product = state.products.find(item => item.id === cartItem.productId);
    return product ? { ...product, quantity: cartItem.quantity, subtotal: product.price * cartItem.quantity } : null;
  }).filter(Boolean);
}

export function getCartTotal() {
  return getCartDetails().reduce((sum, item) => sum + item.subtotal, 0);
}

export function checkout() {
  const items = getCartDetails();
  if (!items.length) return null;
  const order = {
    id: `DS-${Date.now().toString().slice(-7)}`,
    date: new Date().toLocaleString(),
    items: items.map(({ id, name, price, quantity, subtotal }) => ({ id, name, price, quantity, subtotal })),
    total: getCartTotal(),
    status: 'pending',
    receivedAt: null
  };
  state.orders.unshift(order);
  state.cart = [];
  saveState();
  return order;
}

export function markOrderReceived(orderId) {
  const order = state.orders.find(item => item.id === orderId);
  if (!order || order.status === 'received') return false;
  order.status = 'received';
  order.receivedAt = new Date().toLocaleString();
  saveState();
  return true;
}

export function getSummary() {
  return {
    productCount: state.products.length,
    sellerCount: new Set(state.products.map(product => product.seller)).size,
    cartCount: state.cart.reduce((sum, item) => sum + item.quantity, 0)
  };
}

export function resetDemoData() {
  state.products = [...starterProducts];
  state.cart = [];
  state.orders = [];
  saveState();
}
