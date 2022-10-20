import axios from 'axios';
import Notiflix from 'notiflix';
export default class GetRequestService {
  constructor() {
    this.value = '';
    this.page = 1;
    this.maxPage = 13;
    this.total = 0;
    this.length = 0;
  }

  async getCards() {
    const response = await axios
      .get(`https://pixabay.com/api/?q=${this.value}&page=${this.page}`, {
        params: {
          key: '30632606-4bd1ef177f7fe01e4c535073d',
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          per_page: 40,
        },
      })
      .then(response => {
        const images = response.data.hits;
        this.total = response.data.totalHits;
        this.page += 1;
        this.length += images.length;
        return images;
      })
      .catch(error => {
        console.log(error);
      });
    return response;
  }

  resetPage() {
    this.page = 1;
  }

  get val() {
    return this.value;
  }
  set val(newValue) {
    this.value = newValue;
  }
}
