// Replace with your TMDB API key
const apiKey = 'b31550cf1a6a31c5eb1fe12f3afc44f0';
let currentPage = 1;
let totalPages = 1;
let currentGenre = '';

// Function to make JSONP requests
function jsonp(url, callback) {
  const script = document.createElement('script');
  script.src = url;
  script.onload = () => script.remove();
  script.onerror = () => {
    script.remove();
    console.error('JSONP request failed');
  };
  window[callback] = (data) => {
    delete window[callback];
    callback(data);
  };
  document.body.appendChild(script);
}

// Fetch genres from TMDB using JSONP
function fetchGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US&callback=handleGenres`;
  jsonp(url, 'handleGenres');
}

// Handle genres response
function handleGenres(data) {
  const genreSelect = document.getElementById('genre-filter');
  data.genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

// Fetch movies from TMDB using JSONP
function fetchMovies(page = 1, genre = '') {
  const url = genre
    ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${page}&with_genres=${genre}&callback=handleMovies`
    : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}&callback=handleMovies`;
  jsonp(url, 'handleMovies');
}

// Handle movies response
function handleMovies(data) {
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
function showTrailer(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US&callback=handleTrailer`;
  jsonp(url, 'handleTrailer');
}

// Handle trailer response
function handleTrailer(data) {
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
function searchMovie() {
  const query = document.getElementById('movie-search').value;
  if (!query) {
    alert('Please enter a movie title!');
    return;
  }
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&callback=handleMovies`;
  jsonp(url, 'handleMovies');
}

// Initialize
fetchGenres();
fetchMovies();
