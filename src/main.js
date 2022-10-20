import './css/common.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GetRequestService from './get-request';
import galleryTpl from './templates/gallery.hbs';
import Notiflix from 'notiflix';
import Scrollbar from 'smooth-scrollbar';

Scrollbar.init(document.querySelector('#my-scrollbar'));

export const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('input'),
  submitBtn: document.querySelector('button'),
  trigger: document.querySelector('.trigger'),
};

refs.form.addEventListener('submit', createGallery);
refs.form.addEventListener('input', allowToSearch);
refs.submitBtn.setAttribute('disabled', true);

const getRequestService = new GetRequestService();

const options = {
  root: null,
  rootMargin: '100px',
  treshold: 1,
};
const observer = new IntersectionObserver(onLoading, options);

async function onLoading(entries) {
  await entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadingImages();
    }
  });
}

function allowToSearch() {
  if (refs.input.value !== '') {
    refs.submitBtn.removeAttribute('disabled');
  } else refs.submitBtn.setAttribute('disabled', true);
}

async function loadingImages() {
  await getRequestService.getCards().then(renderCards).catch(console.log);
  if (getRequestService.length >= getRequestService.total) {
    return Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

async function renderCards(images) {
  let cardTpl = await galleryTpl(images);
  refs.gallery.insertAdjacentHTML('beforeend', cardTpl);
  let simplelightbox = new SimpleLightbox('.gallery a');
  simplelightbox.refresh();
}

function clearContainer() {
  refs.gallery.innerHTML = '';
}

async function getImages() {
  clearContainer();
  getRequestService.resetPage();
  getRequestService.val = refs.input.value;
  return (images = await getRequestService.getCards());
}

async function createGallery(e) {
  e.preventDefault();
  await getImages().then(renderCards).catch(console.log);
  if (getRequestService.arrLength > 0) {
    Notiflix.Notify.success(
      `Wow, you have got the ${getRequestService.total} results!!!`
    );
  }
  observer.observe(refs.trigger);
}
