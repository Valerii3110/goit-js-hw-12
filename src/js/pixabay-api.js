import axios from 'axios';

const API_KEY = '51318694-35374bea804290f3a0783253d';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: encodeURIComponent(query),
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: PER_PAGE,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch images. Please try again later.');
  }
}
