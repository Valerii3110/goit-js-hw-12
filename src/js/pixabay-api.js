import axios from 'axios';

export async function fetchImages(query, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = {
    key: '51318694-35374bea804290f3a0783253d',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch images from Pixabay API');
  }
}
