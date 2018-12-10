$(function() {

  const settings = {
    async: true,
    crossDomain: true,
    url: '',
    method: 'GET',
    headers: {},
    data: '{}'
  }

  let searchQuery, requestID, searchResults, movieCredits;

  getPage('browse');
  smoothScrollInit();

  /* Event Listeners ======================================== */
  $('body').on('click', '.navbar-brand, #sidebar > nav > a.nav-link', function() {
    // If not already on browse page, retrive browse page
    if(!$('#content > #promo-carousel').length) {
      getPage('browse');
      clearSearch();
    }
  });

  $('#content').on('click', '.title, .carousel-item-meta, .cast-member', function() {
    requestID = $(this).children('a').attr('id');
    $(this).hasClass('cast-member') ? getPage('cast') : getPage('movie');
    clearSearch();
  });

  $('#content').on('click', '#back-btn', function() {
    getPage('browse');
  });

  $('.navbar').on('submit', '#search-form', function(e) {
    e.preventDefault();
    searchQuery = $(this).children('input#search-input').val();
    searchQuery !== '' ? getPage('search') : '' ;
  });

  $('#search-input').click(function() {
    $(this).select();
  })

  $('body').scrollspy({
    target: '#sidebar',
    offset: 200
  });

  /* Functions ======================================== */
  function clearSearch() {
    $('#search-input').val('');
  }

  function getPage(pageName) {
    $('#content').addClass('animated fadeOutRight');

    $.ajax({
      url: './pages/' + pageName + '.html',
      method: 'GET',
      success: function(data) {
        $('#content').html(data);
        $('#content').removeClass('animated fadeOutRight');

        switch(pageName) {
          case 'browse':
            slickInit();
            loadCatalog();
            hidePageOverlay();
            break;
          case 'movie':
            slickInit();
            getMovieDetails(requestID);
            break;
          case 'search':
            searchMovie(searchQuery);
            break;
          case 'cast':
            getCastMember(requestID);
            break;
          default:
            alert('There was a problem loading the ' + pageName + ' page. Please try again later.');
        }
        $('#content').addClass('animated fadeInRight');
      }
    });
  }

  function searchMovie(q) {
    settings.url = BASE_URL + 'search/movie?query=' + q + '&language=en-US&page=1&include_adult=false&api_key=' + API_KEY;
    searchResults = 0;

    $.ajax(settings).done(function(response) {
      $.each(response.results, function(key, value) {
        if(value.poster_path !== null || value.backdrop_path !== null) {
          searchResults += 1;
          $('#search-results').append('<div class="col-6 col-sm-4 col-md-3 col-lg-2 m-0 title mb-4"><a id="'+ value.id +'" href="javascript:void(0)"><div class="title-img-container"><div class="title-rating"><i class="fas fa-star"></i> <span>'+ value.vote_average +'</span></div><img src="'+ BASE_IMG_URL +'w342/'+ value.poster_path +'" alt="'+ value.original_title +'"></div><p class="title-name text-truncate">'+ value.original_title +'</p></a></div>');
        }
      });
      $('#total-results').text(searchResults);
    });
  }

  function fetchPopular() {
    settings.url = BASE_URL + 'movie/popular?&language=en-US&page=3&api_key=' + API_KEY;

    $.ajax(settings).done(function(response) {
      $.each(response.results, function(key, value) {
        if(key < 3) {
          key === 0 ? activeClass = ' active' : activeClass = '';

          $('.carousel-inner').append('<div class="carousel-item'+ activeClass +'"><div class="carousel-item-overlay"></div><div class="carousel-item-meta"><p class="text-truncate carousel-item-name px-5 px-sm-0">'+ value.original_title +'</p><a class="btn btn-primary py-2 px-4" id="'+ value.id +'" href="javascript:void(0);">About this movie</a></div><img class="d-block w-100" src="'+ BASE_IMG_URL +'original/'+ value.backdrop_path +'" alt="'+ value.original_title +'"></div>');

          $('.carousel').carousel();
        }
      });
    });
  }

  function fetchMovies(sliderID, requestURL) {
    settings.url = BASE_URL + requestURL + API_KEY;

    $.ajax(settings).done(function(response) {
      if(response.results.length > 1) {
        $.each(response.results, function(key, value) {
          $(sliderID).slick('slickAdd', '<div class="title mb-4"><a id="'+ value.id +'" href="javascript:void(0)"><div class="title-img-container"><div class="title-rating"><i class="fas fa-star"></i> <span>'+ value.vote_average +'</span></div><img src="'+ BASE_IMG_URL +'w342/'+ value.poster_path +'" alt=""></div><p class="title-name text-truncate">'+ value.original_title +'</p></a></div>');
        });
      } else {
        $(sliderID).append('<p class="lead">No movies found, we\'re sorry :/</p>');
      }
    });
  }

  function getTrailer(movieID) {
    settings.url = BASE_URL + 'movie/' + movieID + '/videos?language=en-US&api_key=' + API_KEY;

    $.ajax(settings).done(function(response) {
      if(response.results.length > 0) {
        $('#movie-preview').append('<div class="iframe-container"><iframe src="https://www.youtube-nocookie.com/embed/'+ response.results[0].key +'" allowfullscreen></iframe></div>');
      } else {
        $('#movie-preview').append('<p class="lead">We we\'re unable to find a video preview for this movie :/</p>');
      }
    });
  }

  function getReviews(movieID) {
    settings.url = BASE_URL + 'movie/' + movieID + '/reviews?language=en-US&page=1&api_key=' + API_KEY;

    $.ajax(settings).done(function(response) {
      if(response.results.length > 0) {
        $.each(response.results, function(key, value) {
          if(key < 5) {
            $('#review-container').append('<blockquote class="blockquote review mt-4"><p class="mb-0">'+ value.content +'</p><footer class="blockquote-footer">'+ value.author +'</footer</blockquote>');
          }
        });
      } else {
        $('#review-container').append('<p class="lead">No reviews found for this movie :/</p>');
      }
    });
  }

  function getCast(movieID) {
    settings.url = BASE_URL + 'movie/' + movieID + '/credits?api_key=' + API_KEY;

    $.ajax(settings).done(function(response) {
      if(response.cast.length > 0) {
        $.each(response.cast, function(key, value) {
          if(value.profile_path) {
            $('#cast').slick('slickAdd', '<div class="title cast-member mb-4"><a id="'+ value.id +'" href="javascript:void(0)"><div class="title-img-container"><img src="'+ BASE_IMG_URL +'w342/'+ value.profile_path +'" alt="'+ value.name +'"></div><p class="title-name text-truncate">'+ value.name +'</p><span>"'+ value.character +'"</span></a></div>');
          }
        });
      } else {
        $('#cast').append('<p class="lead">No cast found for this movie :/</p>');
      }
    });
  }

  function getCastMember(memberID) {
    settings.url = BASE_URL + 'person/'+ memberID +'?language=en-US&api_key=' + API_KEY;
    movieCredits = 0;

    // Get Cast Member Details
    $.ajax(settings).done(function(response) {
      $('#cast-member-photo').html('<img src="'+ BASE_IMG_URL +'w342/'+ response.profile_path +'" alt="'+ response.name +'">');
      $('#cast-name').text(response.name);
      $('#birth-place').text(response.place_of_birth);
    });

    settings.url = BASE_URL + 'person/'+ memberID +'/movie_credits?language=en-US&api_key=' + API_KEY;

    // Get movie credits
    $.ajax(settings).done(function(response) {
      $.each(response.cast, function(key, value) {
        if(value.poster_path) {
          movieCredits += 1;
          $('#movie-credits').append('<div class="col-6 col-sm-4 col-md-3 col-lg-2 m-0 title mb-4"><a id="'+ value.id +'" href="javascript:void(0)"><div class="title-img-container"><div class="title-rating"><i class="fas fa-star"></i> <span>'+ value.vote_average +'</span></div><img src="'+ BASE_IMG_URL +'w342/'+ value.poster_path +'" alt="'+ value.original_title +'"></div><p class="title-name text-truncate">'+ value.original_title +'</p></a></div>');
        }
      });
      $('#credit-results').text(movieCredits);
    });
  }

  function getMovieDetails(movieID) {
    settings.url = BASE_URL + 'movie/' + movieID + '?language=en-US&api_key=' + API_KEY;

    $.ajax(settings).done(function(response) {
      $(window).scrollTop(0);

      let categories = '';
      let countries = '';
      let imgURL = ''+ BASE_IMG_URL +'original/' + response.backdrop_path;

      $('#movie-name').text(response.original_title);
      $('#movie-status').text(response.status);
      $('#movie-summary').text(response.overview);
      $('#movie-poster').attr('src', imgURL).attr('alt', response.original_title);
      $('#movie-rating').text(response.vote_average);
      $('#movie-release').text(response.release_date.substring(0, 4));
      response.runtime !== null ? $('#movie-runtime').text(response.runtime + ' mins') : '';

      $.each(response.production_countries, function(key, value) {
        countries += '<li>'+ value.name +' ('+ value.iso_3166_1 +')</li>';
      });

      $.each(response.genres, function(key, value) {
        categories += value.name + ' | ';
      });

      if(countries.length > 0) {
        $('#movie-production-companies').append(countries);
      } else {
        $('#movie-production-companies').append('<li>None found</li>');
      }

      $('#movie-categories').text(categories.substring(0, categories.length - 2));
    });

    fetchMovies('#related-movies', 'movie/'+ movieID +'/similar?page=1&language=en-US&api_key=');
    getTrailer(movieID);
    getCast(movieID);
    getReviews(movieID);
  }

  function slickInit() {
    $('.titles-slider').slick({
      infinite: false,
      speed: 400,
      slidesToShow: 6,
      slidesToScroll: 6,
      responsive: [{
          breakpoint: 1200,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }
      ]
    });
  }

  function smoothScrollInit() {
    new SmoothScroll('#sidebar > nav > a.nav-link', {
      easing: 'easeInOutQuart',
      header: '#topnav',
      offset: 90
    });
  }

  function loadCatalog() {
    fetchPopular();
    fetchMovies('#now-playing', 'movie/now_playing?page=1&language=en-US&api_key=');
    fetchMovies('#upcoming', 'movie/upcoming?page=1&language=en-US&api_key=');
    fetchMovies('#trending', 'trending/movie/day?api_key=');
    fetchMovies('#top-rated', 'movie/top_rated?page=1&language=en-US&api_key=');
  }

  function hidePageOverlay() {
    $('.page-overlay').css({'visibility': 'hidden'});
  }

});
