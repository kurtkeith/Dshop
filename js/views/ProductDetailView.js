import View from './View.js';

class ProductDetailView extends View {
  _parentElement = document.body;

  _generateMarkup() {
    const product = this._data;
    const date = new Date(`${product.meetupDate}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    return `<div class="modal-backdrop" data-close-modal>
      <section class="product-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div class="modal-image">${product.image ? `<img src="${product.image}" alt="${this._escape(product.name)}">` : product.emoji}</div>
        <div class="modal-content">
          <div class="modal-top"><div><span class="category">${this._escape(product.category)}</span><h2 id="detail-title">${this._escape(product.name)}</h2><strong class="price">₱${product.price.toFixed(2)}</strong></div><button class="modal-close" data-close-modal aria-label="Close details">×</button></div>
          <p class="description">${this._escape(product.description)}</p>
          <div class="detail-grid">
            <div class="detail-box"><span>Seller</span><strong>${this._escape(product.seller)}</strong></div>
            <div class="detail-box"><span>Contact seller</span><strong>${this._escape(product.contact || 'Ask seller through campus channels')}</strong></div>
            <div class="detail-box"><span>Meet-up / pick-up place</span><strong>${this._escape(product.meetupPlace || 'Arrange with seller')}</strong></div>
            <div class="detail-box"><span>Available date</span><strong>${product.meetupDate ? date : 'To be arranged'}</strong></div>
            <div class="detail-box"><span>Available time</span><strong>${product.meetupTime ? this._escape(this._formatTime(product.meetupTime)) : 'To be arranged'}</strong></div>
          </div>
          <div class="modal-actions"><button class="btn btn-light" data-close-modal>Close</button><button class="btn btn-primary" data-buy-now="${product.id}">Buy now · Add to cart</button></div>
          ${(product.isOwner === true || !['p1','p2','p3','p4','p5','p6'].includes(product.id)) ? `<button class="btn btn-delete-listing modal-delete-listing" data-delete-detail="${product.id}">Delete my listing</button>` : ''}
          <p class="muted" style="margin-top:12px">Demo only: contact the seller to confirm the meet-up before exchanging money or items.</p>
        </div>
      </section>
    </div>`;
  }

  _escape(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  _formatTime(value) {
    const [hour, minute] = value.split(':');
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  addHandlerClose(handler) {
    this._parentElement.addEventListener('click', event => {
      if (event.target.matches('[data-close-modal]')) handler();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this._parentElement.querySelector('.modal-backdrop')) handler();
    });
  }

  addHandlerBuy(handler) {
    this._parentElement.addEventListener('click', event => {
      const button = event.target.closest('[data-buy-now]');
      if (button) handler(button.dataset.buyNow);
    });
  }

  addHandlerDelete(handler) {
    this._parentElement.addEventListener('click', event => {
      const button = event.target.closest('[data-delete-detail]');
      if (button) {
        event.preventDefault();
        event.stopPropagation();
        handler(button.dataset.deleteDetail);
      }
    });
  }

  close() {
    const modal = this._parentElement.querySelector('.modal-backdrop');
    if (modal) modal.remove();
  }
}
export default new ProductDetailView();
