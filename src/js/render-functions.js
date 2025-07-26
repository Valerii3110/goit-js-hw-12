import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

export function initLightbox() {
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
}

export function refreshLightbox() {
  if (lightbox) {
    lightbox.refresh();
  }
}

export function createGallery(images) {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  const markup = images
    .map(
      image => `
    <li class="gallery-item">
      <a class="gallery-link" href="${image.largeImageURL}">
        <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
        <div class="image-info">
          <p><b>Likes</b> ${image.likes}</p>
          <p><b>Views</b> ${image.views}</p>
          <p><b>Comments</b> ${image.comments}</p>
          <p><b>Downloads</b> ${image.downloads}</p>
        </div>
      </a>
    </li>
  `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  refreshLightbox();
}

export function clearGallery() {
  const gallery = document.querySelector('.gallery');
  if (gallery) gallery.innerHTML = '';
}
