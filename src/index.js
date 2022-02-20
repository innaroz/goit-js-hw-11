import './sass/main.scss';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const input = document.querySelector('[name="searchQuery"]');
const button = document.querySelector('.load-more');
let page = 1;
const perPage = 40;
let loadImagesCount = 0;

const imageTemplate = (image) => (
  `
    <a href="${image.largeImageURL}">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${image.likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${image.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${image.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${image.downloads}</span>
        </p>
      </div>
    </a>
  `
);
const gallery = document.querySelector('.gallery');

const lightbox = new SimpleLightbox('.gallery a');

async function getImages(q) {
  try {
    return await axios.get('https://pixabay.com/api', {
      params: {
        key: '25787629-ed447a9ab3acffac507c9cb4f',
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page
      }
    });
  } catch (error) {
    console.log(error)
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  getImages(input.value).then((response) => {
    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      gallery.innerHTML = '';
      return;
    }

    loadImagesCount += images.length;

    Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);

    const list = images.map((image) => {
      const img = document.createElement('div');
      img.classList = ['photo-card'];
      img.innerHTML = imageTemplate(image);
      return img.outerHTML;
    });
    gallery.innerHTML = list.join('');
    lightbox.refresh();
    if (loadImagesCount >= response.data.totalHits) {
      Notiflix.Notify.success("We're sorry, but you've reached the end of search results.");
      button.style.display = 'none';
      return;
    }
    button.style.display = 'flex';
    page += 1;
  });
});

button.addEventListener('click', (e) => {
  button.style.display = 'none';
  getImages(input.value).then((response) => {
    const images = response.data.hits;

    loadImagesCount += images.length;

    const list = images.map((image) => {
      const img = document.createElement('div');
      img.classList = ['photo-card'];
      img.innerHTML = imageTemplate(image);
      return img.outerHTML;
    });
    gallery.innerHTML = gallery.innerHTML + list.join('');
    lightbox.refresh();
    if (loadImagesCount >= response.data.totalHits) {
      Notiflix.Notify.success("We're sorry, but you've reached the end of search results.");
    } else {
      button.style.display = 'flex';
      page += 1;
    }
  });
});
