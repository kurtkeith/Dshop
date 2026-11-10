import View from './View.js';

class ProductView extends View {
  _parentElement = document.querySelector('#product-list');

  _generateMarkup() {
    if (!this._data.products.length) return '<p class="empty">No products found. Try another search or category.</p>';
    return this._data.products.map(product => `
      <article class="product-card" data-open="${product.id}" tabindex="0" role="button" aria-label="View details for ${this._escape(product.name)}">
        <div class="product-visual">${product.image ? `<img src="${product.image}" alt="${this._escape(product.name)}">` : product.emoji}</div>
        <div class="product-info">
          <span class="category">${product.category}</span>
          <h3>${this._escape(product.name)}</h3>
          <p class="description">${this._escape(product.description)}</p>
          <p class="seller">Posted by ${this._escape(product.seller)}</p>
          <div class="product-bottom"><strong class="price">₱${product.price.toFixed(2)}</strong>
            <div class="product-actions"><button class="btn btn-primary" data-add="${product.id}">Add to cart</button>
            ${(product.isOwner === true || !['p1','p2','p3','p4','p5','p6'].includes(product.id)) ? `<button class="btn btn-delete-listing" data-delete="${product.id}" aria-label="Delete ${this._escape(product.name)} listing">Delete listing</button>` : ''}</div></div>
        </div>
      </article>`).join('');
  }

  _escape(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  addHandlerAddToCart(handler) {
    this._parentElement.addEventListener('click', event => {
      const deleteButton = event.target.closest('[data-delete]');
      if (deleteButton) {
        event.stopPropagation();
        this._deleteHandler?.(deleteButton.dataset.delete);
        return;
      }
      const button = event.target.closest('[data-add]');
      if (button) {
        event.stopPropagation();
        handler(button.dataset.add);
        return;
      }
      const card = event.target.closest('[data-open]');
      if (card) this._detailHandler?.(card.dataset.open);
    });
    this._parentElement.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-open]')) {
        event.preventDefault();
        this._detailHandler?.(event.target.dataset.open);
      }
    });
  }

  addHandlerOpenDetails(handler) {
    this._detailHandler = handler;
  }

  addHandlerDelete(handler) {
    this._deleteHandler = handler;
  }

  addHandlerFilter(handler) {
    document.querySelector('#search-input').addEventListener('input', handler);
    document.querySelector('#category-filter').addEventListener('change', handler);
  }
}
export default new ProductView();
