// Replace with your TMDB API key
const apiKey = 'b31550cf1a6a31c5eb1fe12f3afc44f0';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS proxy
let currentPage = 1;
let totalPages = 1;
let currentGenre = '';

// Fetch genres from TMDB
async function fetchGenres() {
  const url = `${proxyUrl}https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
  const response = await fetch(url);
  const data = await response.json();
  const genreSelect = document.getElementById('genre-filter');
  data.genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

// Fetch movies from TMDB
async function fetchMovies(page = 1, genre = '') {
  const url = genre
    ? `${proxyUrl}https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${page}&with_genres=${genre}`
    : `${proxyUrl}https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();
  totalPages = data.total_pages;
  displayMovies(data.results);
  updatePagination();
}

// Display movies
function displayMovies(movies) {
  const movieContainer = document.getElementById('movie-container');
  movieContainer.innerHTML = '';
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster"/>
      <h3>${movie.title}</h3>
      <p>Release Date: ${movie.release_date}</p>
      <p>Rating: ${movie.vote_average}/10</p>
      <button onclick="showTrailer(${movie.id})">Watch Trailer</button>
    `;
    movieContainer.appendChild(movieCard);
  });
}

// Show trailer
async function showTrailer(movieId) {
  const url = `${proxyUrl}https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
  const response = await fetch(url);
  const data = await response.json();
  const trailer = data.results.find(video => video.type === 'Trailer');
  if (trailer) {
    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
  } else {
    alert('No trailer available for this movie.');
  }
}

// Pagination
function updatePagination() {
  const pageNumbers = document.getElementById('page-numbers');
  pageNumbers.textContent = `Page ${currentPage} of ${totalPages}`;
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    fetchMovies(currentPage, currentGenre);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchMovies(currentPage, currentGenre);
  }
}

// Filter by genre
function filterByGenre() {
  currentGenre = document.getElementById('genre-filter').value;
  currentPage = 1;
  fetchMovies(currentPage, currentGenre);
}

// Search movies
async function searchMovie() {
  const query = document.getElementById('movie-search').value;
  if (!query) {
    alert('Please enter a movie title!');
    return;
  }
  const url = `${proxyUrl}https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  displayMovies(data.results);
}

// Initialize
fetchGenres();
fetchMovies();
