import View from './View.js';

class CartView extends View {
  _parentElement = document.querySelector('#cart-view');

  _generateMarkup() {
    const { items, total } = this._data;
    if (!items.length) return '<p class="empty">Your cart is empty. Add an item from the marketplace.</p>';
    return `<div class="cart-layout"><div class="cart-items">${items.map(item => `
      <div class="cart-row"><div><strong>${this._escape(item.name)}</strong><small>₱${item.price.toFixed(2)} each · ${this._escape(item.seller)}</small></div>
        <input class="qty" aria-label="Quantity for ${this._escape(item.name)}" type="number" min="0" max="99" value="${item.quantity}" data-quantity="${item.id}">
        <div class="row-total"><strong>₱${item.subtotal.toFixed(2)}</strong><button class="btn btn-danger" data-remove="${item.id}">Remove</button></div></div>`).join('')}</div>
      <aside class="cart-summary"><h3>Order summary</h3><div class="total-line"><span>Items</span><strong>${items.reduce((sum, item) => sum + item.quantity, 0)}</strong></div><div class="total-line final"><span>Total</span><strong>₱${total.toFixed(2)}</strong></div><button class="btn btn-primary" data-checkout>Place demo order</button><p class="muted">No real payment is collected.</p></aside></div>`;
  }

  _escape(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  addHandlerQuantity(handler) {
    this._parentElement.addEventListener('change', event => {
      const input = event.target.closest('[data-quantity]');
      if (input) handler(input.dataset.quantity, Number(input.value));
    });
  }

  addHandlerRemove(handler) {
    this._parentElement.addEventListener('click', event => {
      const button = event.target.closest('[data-remove]');
      if (button) handler(button.dataset.remove);
    });
  }

  addHandlerCheckout(handler) {
    this._parentElement.addEventListener('click', event => {
      if (event.target.closest('[data-checkout]')) handler();
    });
  }
}
export default new CartView();
