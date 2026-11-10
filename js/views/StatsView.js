import View from './View.js';

class StatsView extends View {
  _parentElement = document.querySelector('#stats');

  _generateMarkup() {
    return `<div class="stat"><strong>${this._data.productCount}</strong><span>ACTIVE LISTINGS</span></div>
      <div class="stat"><strong>${this._data.sellerCount}</strong><span>STUDENT SELLERS</span></div>
      <div class="stat"><strong>${this._data.cartCount}</strong><span>ITEMS IN YOUR CART</span></div>`;
  }
}
export default new StatsView();
