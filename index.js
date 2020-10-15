// A宣告變數
const baseURL = 'https://movie-list.alphacamp.io'
const indexURL = baseURL + '/api/v1/movies/'
const posterURL = baseURL + '/posters/'
const movies = []
let filteredMovies = []
const dataPanel = document.querySelector('#data-panel')
const moviesPerPage = 12
const paginator = document.querySelector('#paginator')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// B請求資料
axios
  .get(indexURL)
  .then((response) => {
    movies.push(...response.data.results)
    console.log(getMoviesByPage(1))
    renderMovieList(getMoviesByPage(1))
    renderPaginator(movies.length)
  })

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
              <button type="button" class="btn btn-info btn-add-to-favorite" data-id = "${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

// 2切分首頁
function getMoviesByPage(data) {
  const moviesPerPage = 12
  const showingMovies = filteredMovies.length ? filteredMovies : movies
  const startIndex = (data - 1) * moviesPerPage
  return showingMovies.slice(startIndex, startIndex + moviesPerPage)
}

// 3渲染分頁器
function renderPaginator(data) {
  const pages = Math.ceil(data / moviesPerPage)
  let rawHTML = ''
  for (let page = 1; page <= pages; page++) {
    rawHTML += ` <li class="page-item"><a class="page-link" href="#"data-page ="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
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

// 8加入最愛
function addToFavorite(data) {
  const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const favoriteMovie = movies.find((item) => item.id === data)
  if (favoriteMovies.some((item) => item.id === data)) {
    return alert('此電影已經在收藏清單中')
  }

  favoriteMovies.push(favoriteMovie)

  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies))
  // const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  // const favoriteMovie = movies.find((item) => item.id === data)
  // console.log(favoriteMovie.id)

  // if (favoriteMovies.some((favoriteMovie) => favoriteMovie.id === data)) {
  //   console.log(favoriteMovie.id)
  //   return alert('此電影已經在收藏清單中')
  // }

  // if (favoriteMovies.some((item) => item.id === data)) {
  //   return alert('此電影已經在收藏清單中')
  // }

  // favoriteMovies.push(favoriteMovie)
  // console.log(favoriteMovies)
  // localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies))
}




// D設置事件
// 4連結分頁
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  console.log(page)
  renderMovieList(getMoviesByPage(page))
})

// 5搜尋首頁
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((item) => item.title.toLowerCase().includes(keyword))
  if (filteredMovies.length === 0) {
    return alert('cannot find:' + keyword)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

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
  } else if (event.target.matches('.btn-add-to-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

