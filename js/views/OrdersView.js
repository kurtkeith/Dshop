  import View from './View.js';

class OrdersView extends View {
  _parentElement = document.querySelector('#orders-view');

  addHandlerMarkReceived(handler) {
    this._parentElement.addEventListener('click', event => {
      const button = event.target.closest('[data-mark-received]');
      if (!button) return;
      handler(button.dataset.markReceived);
    });
  }

  _generateMarkup() {
    if (!this._data.length) return '<p class="empty">No orders yet. Your purchases will appear here.</p>';

    return this._data.slice(0, 10).map(order => {
      const received = order.status === 'received';
      const itemSummary = (order.items || []).map(item =>
        `<span class="order-item">${item.name} <b>× ${item.quantity}</b></span>`
      ).join('');
      return `
        <article class="order-card ${received ? 'is-received' : ''}">
          <div class="order-main">
            <div class="order-title-row">
              <strong class="order-id">${order.id}</strong>
              <span class="order-status ${received ? 'status-received' : 'status-pending'}">
                ${received ? '✓ Received' : 'Awaiting receipt'}
              </span>
            </div>
            <small class="order-date">Placed ${order.date} · ${(order.items || []).length} product type(s)</small>
            <div class="order-items">${itemSummary}</div>
            ${received ? `<small class="received-date">Marked received: ${order.receivedAt || 'Confirmed'}</small>` : '<small class="receipt-hint">After you have collected your item(s), mark this order as received.</small>'}
          </div>
          <div class="order-side">
            <strong class="order-total">₱${Number(order.total || 0).toFixed(2)}</strong>
            ${received ? '<span class="received-check" aria-label="Order received">✓</span>' : `<button class="btn btn-received" type="button" data-mark-received="${order.id}">Mark as received</button>`}
          </div>
        </article>`;
    }).join('');
  }
}
export default new OrdersView();
