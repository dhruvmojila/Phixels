const auth = "563492ad6f9170000100000105275f90444c4f9b9ec883c2480f4701";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");

let searchValue;

const more = document.querySelector(".more");
let page = 1;
let fetchLink = "";
let currentSearch;

searchInput.addEventListener("input", updateInput);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  console.log(data);
  return data;
}

function generatedPics(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
    <!-- <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original} target="_blank">Download</a>
    </div>
    <img src=${photo.src.large}></img> -->
    <div class="fig">
      <img src=${photo.src.large} />
      <div class="caption gallery-info">
        <h3>${photo.photographer}</h3>
        <h5><a href=${photo.src.original} target="_blank">Download</a></h5>
      </div>
    </div>
    `;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPics() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchApi(fetchLink);
  generatedPics(data);
}

async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);
  generatedPics(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatedPics(data);
}

curatedPics();
