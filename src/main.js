import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  initLightbox,
  refreshLightbox,
} from './js/render-functions';

// Глобальні змінні
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
const perPage = 15;

// Функція для перевірки існування елементів
function getElements() {
  const form = document.querySelector('.form');
  const loadMoreBtn = document.querySelector('.load-more-btn');

  if (!form || !loadMoreBtn) {
    console.error('Critical elements not found in DOM');
    return null;
  }

  return { form, loadMoreBtn };
}

// Ініціалізація додатка
document.addEventListener('DOMContentLoaded', () => {
  const elements = getElements();

  if (!elements) {
    showErrorToast('Failed to initialize app - missing critical elements');
    return;
  }

  initLightbox();
  setupEventListeners(elements);
});

function setupEventListeners({ form, loadMoreBtn }) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const query = e.target.elements.searchQuery.value.trim();
    if (query) {
      await handleSearch(query);
    } else {
      showErrorToast('Please enter a search term!');
    }
  });

  loadMoreBtn.addEventListener('click', async () => {
    await handleLoadMore();
  });
}

async function handleSearch(query) {
  const loader = document.querySelector('.preloader');
  const notification = document.querySelector('.notification');
  const loadMoreBtn = document.querySelector('.load-more-btn');

  try {
    // Показуємо стан завантаження
    loader.classList.remove('is-hidden');
    notification.classList.remove('is-hidden');
    notification.textContent = 'Loading images...';
    loadMoreBtn.classList.add('is-hidden');

    // Оновлюємо стан
    currentQuery = query;
    currentPage = 1;
    clearGallery();

    // Виконуємо запит
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data.hits || data.hits.length === 0) {
      showWarningToast('No images found for your query!');
      return;
    }

    // Оновлюємо інтерфейс
    totalHits = data.totalHits;
    createGallery(data.hits);
    showSuccessToast(`Hooray! We found ${totalHits} images.`);

    // Показуємо кнопку "Load more" якщо є ще зображення
    if (totalHits > perPage) {
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.error('Search error:', error);
    showErrorToast(error.message || 'Failed to load images');
  } finally {
    // Ховаємо індикатори завантаження
    loader.classList.add('is-hidden');
    notification.classList.add('is-hidden');
  }
}

async function handleLoadMore() {
  const loader = document.querySelector('.preloader');
  const notification = document.querySelector('.notification');
  const loadMoreBtn = document.querySelector('.load-more-btn');

  try {
    // Показуємо стан завантаження
    loader.classList.remove('is-hidden');
    notification.classList.remove('is-hidden');
    notification.textContent = 'Loading more images...';

    // Збільшуємо сторінку та робимо запит
    currentPage += 1;
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data.hits || data.hits.length === 0) {
      showInfoToast('No more images available');
      loadMoreBtn.classList.add('is-hidden');
      return;
    }

    // Оновлюємо галерею
    createGallery(data.hits);
    refreshLightbox();

    // Перевіряємо чи досягли кінця колекції
    if (currentPage * perPage >= totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      showInfoToast(
        "We're sorry, but you've reached the end of search results."
      );
    }

    // Плавна прокрутка
    smoothScroll();
  } catch (error) {
    console.error('Load more error:', error);
    showErrorToast(error.message || 'Failed to load more images');
  } finally {
    // Ховаємо індикатори завантаження
    loader.classList.add('is-hidden');
    notification.classList.add('is-hidden');
  }
}

// Допоміжні функції
function smoothScroll() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    const { height } = galleryItems[0].getBoundingClientRect();
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });
  }
}

function showErrorToast(message) {
  iziToast.error({
    title: 'Error',
    message: message,
    position: 'topRight',
  });
}

function showWarningToast(message) {
  iziToast.warning({
    title: 'Warning',
    message: message,
    position: 'topRight',
  });
}

function showInfoToast(message) {
  iziToast.info({
    title: 'Info',
    message: message,
    position: 'topRight',
  });
}

function showSuccessToast(message) {
  iziToast.success({
    title: 'Success',
    message: message,
    position: 'topRight',
  });
}
