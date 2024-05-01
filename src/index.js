import axios from "axios";
import Notiflix from "notiflix";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '43669043-1815db5c78c0a35e985981082';
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.loadMore');

let page = 1;
let searchvalue = '';

function renderImages(image){
    const markup = image
    .map(({ webformatURL,downloads,comments,views,tags, largeImageURL,likes }) => {
      return`
       <div class="card">
    <img src="${webformatURL}" alt="Avatar" style="width:100%">
          
    <div class="container">
          <p class="flex flex-col items-center">
            <b>Likes</b> 
            ${likes}
          </p>
          <p class="flex flex-col items-center">
            <b>Views</b> 
            ${views}
          </p>
          <p class="flex flex-col items-center">
            <b>Comments</b> 
            ${comments}
          </p>
          <p class="flex flex-col items-center">
            <b>Downloads</b> 
            ${downloads}
          </p>
        </div>
  </div> `
    })
    .join("");

  gallery.insertAdjacentHTML('beforeend',markup);

}

export const fetchImages = async (searchQuery, loadMore =1) => {
	//fetch, decode, execute
  // return fetch(BASE_URL).then((res) => res.json());
  
	let res = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&safesearch=%22true%22&orientation=%22horizontal%22&image_type=photo&pretty=true&per_page=40&page=${loadMore}`);
	console.log(res);
  return res.data;
};

document.getElementById('search-form').addEventListener('submit', async function (event) {
  
  event.preventDefault(); // Prevent the form from submitting normally
  
  // Get the value from the search input
  var searchTerm = document.getElementById('search-input').value.trim();
  console.log(searchTerm);
  
  const hits = await fetchImages(searchTerm)
  
  if (hits.hits.length <= 0) {
    // loadMore.style.display = 'none';
    Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
    return; 
  }
  gallery.innerHTML = '';
  loadMore.style.display = 'block';
  renderImages(hits.hits);

   Notiflix.Notify.success(`✅ Hooray! We found ${hits.totalHits} images.`);
   searchvalue = searchTerm;
    // You can do whatever you want with the search term here, like send it to a server for processing or search through a list of items

    // For now, let's just log it to the console
    console.log('Search term:', searchTerm);
  });

loadMore.addEventListener('click', async function (event) { 
  event.preventDefault(); 

  loadMore.style.display = 'block';
  
  page += 1;
  const hits = await fetchImages(searchvalue, page)
  const totalHits = hits.totalHits
  const perPage = 40;
  const totalPages = Math.ceil(totalHits / perPage);
  if (page > totalPages) {
    loadMore.style.display = 'none';
    Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    return; 
  }
  renderImages(hits.hits);

  
})