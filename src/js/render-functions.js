import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

export function showLoader() {
  const loader = document.querySelector('.preloader');
  if (loader) loader.style.display = 'block';
}

export function hideLoader() {
  const loader = document.querySelector('.preloader');
  if (loader) loader.style.display = 'none';
}

export function showLoadMoreBtn() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) loadMoreBtn.style.display = 'block';
}

export function hideLoadMoreBtn() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

export function showNotification(message, type = 'error') {
  iziToast[type]({
    title: type === 'error' ? 'Error' : 'Info',
    message: message,
    position: 'topRight',
  });
}

export function renderGallery(images, galleryElement) {
  if (!images || images.length === 0) {
    showNotification(
      'Sorry, there are no images matching your search query. Please try again!'
    );
    return;
  }

  const markup = images
    .map(image => {
      return `
        <a href="${image.largeImageURL}" class="gallery-item">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
            <p><b>Likes:</b> ${image.likes}</p>
            <p><b>Views:</b> ${image.views}</p>
            <p><b>Comments:</b> ${image.comments}</p>
            <p><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </a>
      `;
    })
    .join('');

  galleryElement.insertAdjacentHTML('beforeend', markup);
  initLightbox();
}

export function clearGallery(galleryElement) {
  galleryElement.innerHTML = '';
}

function initLightbox() {
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
}
