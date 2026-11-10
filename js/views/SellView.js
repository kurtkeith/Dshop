import View from './View.js';

class SellView extends View {
  _parentElement = document.querySelector('#sell-form');

  _generateMarkup() {
    return `<form class="form-grid" id="new-product-form" novalidate>
      <div class="field"><label for="product-name">Product name *</label><input class="form-control" id="product-name" name="name" maxlength="60" placeholder="e.g. Pre-loved textbook" required></div>
      <div class="field"><label for="product-category">Category *</label><select class="form-control" id="product-category" name="category" required><option value="">Choose category</option><option>Books</option><option>School Supplies</option><option>Gadgets</option><option>Clothing</option><option>Food</option><option>Others</option></select></div>
      <div class="field"><label for="product-price">Price (₱) *</label><input class="form-control" id="product-price" name="price" type="number" min="1" max="100000" step="0.01" placeholder="0.00" required></div>
      <div class="field"><label for="seller-name">Your name *</label><input class="form-control" id="seller-name" name="seller" maxlength="40" placeholder="e.g. Juan D." required></div>
      <div class="field full"><label for="product-description">Description *</label><input class="form-control" id="product-description" name="description" maxlength="160" placeholder="Describe the condition and details..." required></div>
      <div class="field"><label for="product-emoji">Item icon (used if no photo)</label><select class="form-control" id="product-emoji" name="emoji"><option>📦</option><option>📚</option><option>🎧</option><option>👜</option><option>🍪</option><option>🧮</option></select></div>
      <div class="field"><label for="product-photo">Product photo (optional, max 1 MB)</label><input class="form-control" id="product-photo" name="photo" type="file" accept="image/*"><img id="photo-preview" class="product-photo-preview" alt="Selected product preview"></div>
      <div class="field"><label for="meetup-place">Meet-up / pick-up place *</label><input class="form-control" id="meetup-place" name="meetupPlace" maxlength="100" placeholder="e.g. DOrSU Main Gate" required></div>
      <div class="field"><label for="seller-contact">Seller contact *</label><input class="form-control" id="seller-contact" name="contact" maxlength="60" placeholder="Messenger name or contact number" required></div>
      <div class="field"><label for="meetup-date">Available date *</label><input class="form-control" id="meetup-date" name="meetupDate" type="date" required></div>
      <div class="field"><label for="meetup-time">Available time *</label><input class="form-control" id="meetup-time" name="meetupTime" type="time" required></div>
      <div class="form-actions"><button class="btn btn-primary" type="submit">Publish listing</button></div>
      <p id="sell-error" class="form-error field full" aria-live="polite"></p>
    </form>`;
  }

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('change', event => {
      if (event.target.id !== 'product-photo') return;
      const file = event.target.files[0];
      const preview = this._parentElement.querySelector('#photo-preview');
      if (file && file.type.startsWith('image/') && file.size <= 1024 * 1024) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
      } else {
        preview.removeAttribute('src');
        preview.style.display = 'none';
      }
    });
    this._parentElement.addEventListener('submit', event => {
      if (event.target.id !== 'new-product-form') return;
      event.preventDefault();
      const form = event.target;
      const data = Object.fromEntries(new FormData(form));
      const error = this._parentElement.querySelector('#sell-error');
      const photo = form.querySelector('#product-photo').files[0];
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      if (!data.name.trim() || !data.category || !data.seller.trim() || !data.description.trim() ||
          !data.meetupPlace.trim() || !data.contact.trim() || !data.meetupDate || !data.meetupTime) {
        error.textContent = 'Please complete all required product, seller, and meet-up details.';
        return;
      }
      if (data.meetupDate < today) {
        error.textContent = 'Meet-up date cannot be in the past.';
        return;
      }
      if (photo && (!photo.type.startsWith('image/') || photo.size > 1024 * 1024)) {
        error.textContent = 'Choose an image file no larger than 1 MB.';
        return;
      }
      if (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0 || Number(data.price) > 100000) {
        error.textContent = 'Enter a price greater than ₱0 and not above ₱100,000.';
        return;
      }
      error.textContent = '';
      if (photo) {
        const reader = new FileReader();
        reader.onload = () => {
          data.image = reader.result;
          handler(data);
          form.reset();
          const preview = this._parentElement.querySelector('#photo-preview');
          preview.removeAttribute('src');
          preview.style.display = 'none';
        };
        reader.onerror = () => { error.textContent = 'The selected photo could not be read.'; };
        reader.readAsDataURL(photo);
      } else {
        handler(data);
        form.reset();
        const preview = this._parentElement.querySelector('#photo-preview');
        preview.removeAttribute('src');
        preview.style.display = 'none';
      }
    });
  }
}
export default new SellView();
