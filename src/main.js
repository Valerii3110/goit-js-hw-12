import { fetchImages } from './js/pixabay-api.js';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  showNotification,
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

searchForm.addEventListener('submit', async e => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const query = formData.get('searchQuery').trim();

  if (!query) {
    showNotification('Please enter a search term!');
    return;
  }

  currentQuery = query;
  currentPage = 1;

  try {
    showLoader();
    hideLoadMoreBtn();
    clearGallery(gallery);

    const data = await fetchImages(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      showNotification(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    renderGallery(data.hits, gallery);
    showNotification(`Hooray! We found ${totalHits} images.`, 'success');

    if (data.hits.length < 15 || currentPage * 15 >= totalHits) {
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    showNotification(error.message);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;

  try {
    showLoader();
    hideLoadMoreBtn();

    const data = await fetchImages(currentQuery, currentPage);
    renderGallery(data.hits, gallery);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (currentPage * 15 >= totalHits) {
      hideLoadMoreBtn();
      showNotification(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      showLoadMoreBtn();
    }
  } catch (error) {
    showNotification(error.message);
  } finally {
    hideLoader();
  }
});
