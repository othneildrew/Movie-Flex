$(function() {

  let searchQuery,
      requestMovieId;

  getPage('browse');
  //getPage('search');
  //hidePageOverlay();

  $('body').on('click', '.navbar-brand, #sidebar > nav > a.nav-link', function() {
    getPage('browse');
  });

  $('#content').on('click', '.title', function() {
    requestMovieId = $(this).children('a').attr('id');
    getPage('movie');
    $('#search-input').val('');
  });

  $('#content').on('click', '#back-btn', function() {
    getPage('browse');
  });

  $('.navbar').on('submit', '#search-form', function() {
    searchQuery = $(this).children('input#search-input').val();
    getPage('search');
  });

  $('#search-input').click(function() {
    $(this).select();
  })







  function getPage(pageName) {

    //$('#content').removeClass('animated slideInRight');

    $.ajax({
      url: './' + pageName + '.html',
      method: 'GET',
      success: function(data) {
        $('#content').html(data);

        switch(pageName) {
          case 'browse':
            slickInit();
            loadCatalog();
            hidePageOverlay();
            break;
          case 'movie':
            getMovieDetails(requestMovieId);
            break;
          case 'search':
            searchMovie(searchQuery);
            break;
          default:
            alert('There was a problem loading the ' + pageName + ' page. Please try again later.');
        }

        //$('#content').addClass('animated slideInLeft');
      }
    });

  }



  function searchMovie(q) {
    console.log(q);

    let settings = {
      async: true,
      crossDomain: true,
      url: BASE_URL + 'search/movie?query=' + q + '&language=en-US&page=1&include_adult=true&api_key=' + API_KEY,
      method: 'GET',
      headers: {},
      data: '{}'
    }

    $.ajax(settings).done(function(response) {
      $('#total-results').text(response.total_results);
      $.each(response.results, function(key, value) {
        if(value.poster_path !== null || value.backdrop_path !== null) {
          $('#search-results').append('<div class="col-6 col-sm-4 col-md-3 col-lg-2 m-0 title mb-4"><a id="'+ value.id +'" href="javascript:void(0)"><div class="title-img-container"><div class="title-rating"><i class="fas fa-star"></i> <span>'+ value.vote_average +'</span></div><img src="https://image.tmdb.org/t/p/w342/'+ value.poster_path +'" alt="'+ value.original_title +'"></div><p class="title-name text-truncate">'+ value.original_title +'</p></a></div>');
        }

      });

      //console.log(response);
    });


  }


  function fetchMovies(sliderID, requestURL) {
    let settings = {
      async: true,
      crossDomain: true,
      url: BASE_URL + requestURL + API_KEY,
      method: 'GET',
      headers: {},
      data: '{}'
    }

    $.ajax(settings).done(function(response) {
      $.each(response.results, function(key, value) {
        //slideIndex++;
        $(sliderID + '-slider').slick('slickAdd', '<div class="title mb-4"><a id="'+ value.id +'" href="javascript:void(0)"><div class="title-img-container"><div class="title-rating"><i class="fas fa-star"></i> <span>'+ value.vote_average +'</span></div><img src="https://image.tmdb.org/t/p/w342/'+ value.poster_path +'" alt=""></div><p class="title-name text-truncate">'+ value.original_title +'</p></a></div>');
      });
    });
  } // END fetchMovies



  function getMovieDetails(movieID) {
    let settings = {
      async: true,
      crossDomain: true,
      url: BASE_URL + 'movie/' + movieID + '?language=en-US&api_key=' + API_KEY,
      method: 'GET',
      headers: {},
      data: '{}'
    }

    $.ajax(settings).done(function(response) {
      let imgURL = 'https://image.tmdb.org/t/p/original/' + response.backdrop_path;

      $('#movie-name').text(response.original_title);
      $('#movie-summary').text(response.overview);
      $('#movie-poster').attr('src', imgURL).attr('alt', response.original_title);
      $('#movie-rating').text(response.vote_average);




    });

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

  function loadCatalog() {
    fetchMovies('#now-playing', 'movie/now_playing?page=1&language=en-US&api_key=');

    fetchMovies('#upcoming', 'movie/upcoming?page=1&language=en-US&api_key=');

    fetchMovies('#trending', 'trending/movie/day?api_key=');

    fetchMovies('#top-rated', 'movie/top_rated?page=1&language=en-US&api_key=');
  }

  function hidePageOverlay() {
    $('.page-overlay').css({'visibility': 'hidden'});
  }



});
