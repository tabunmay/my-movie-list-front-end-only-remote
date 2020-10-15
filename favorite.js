// A宣告變數
const baseURL = 'https://movie-list.alphacamp.io'
const indexURL = baseURL + '/api/v1/movies/'
const posterURL = baseURL + '/posters/'
const movies = []
let filteredMovies = []
const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')
const moviesPerPage = 12
const paginator = document.querySelector('#paginator')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// B請求資料
renderMovieList(favoriteMovies)

// C設計函式
// 1渲染首頁
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${posterURL + item.image}"
              class="card-img-top" alt="movie-poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id = "${item.id}">More</button>
              <button type="button" class="btn btn-danger btn-remove-from-favorite" data-id = "${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

// 7渲染模組
function renderMovieModal(data) {
  const movieModalTITLE = document.querySelector('#movie-modal-title')
  const movieModalDate = document.querySelector('#movie-modal-date')
  const movieModalDescription = document.querySelector('#movie-modal-description')
  const movieModalPoster = document.querySelector('#movie-modal-poster')
  movieModalTITLE.innerText = data.title
  movieModalDate.innerText = data.release_date
  movieModalDescription.innerText = data.description
  movieModalPoster.innerHTML = `
  <img src="${posterURL + data.image}" alt="movie-modal-poster" class="img-fluid">
  `
}

// 8移除最愛
function removeFromFavorite(data) {
  const favoriteMovieIndex = favoriteMovies.findIndex((item) => item.id === data)
  if (favoriteMovieIndex === -1) return
  favoriteMovies.splice(favoriteMovieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies))
  renderMovieList(favoriteMovies)
}

// D設置事件
// 6顯示模組
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    const ID = Number(event.target.dataset.id)
    axios
      .get(indexURL + ID)
      .then((response) => {
        const movie = response.data.results
        renderMovieModal(movie)
      })
  } else if (event.target.matches('.btn-remove-from-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

