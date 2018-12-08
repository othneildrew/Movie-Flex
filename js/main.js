$(function() {

  init();




  function init() {
    // Initialize slick carousel
    $('.titles-slider').slick({
      lazyLoad: 'ondemand',
      infinite: false,
      speed: 600,
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


    fetchMovies('#now-playing', 'movie/now_playing?page=1&language=en-US&api_key=');

    fetchMovies('#upcoming', 'movie/upcoming?page=1&language=en-US&api_key=');

    fetchMovies('#trending', 'trending/movie/day?api_key=');

    fetchMovies('#top-rated', 'movie/top_rated?page=1&language=en-US&api_key=');

    hidePageOverlay();
  }







  function hidePageOverlay() {
    $('.page-overlay').fadeOut(300).css({'visibility': 'hidden'});
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
        $(sliderID + '-slider').slick('slickAdd', '<div class="title mb-4"><a id="'+ value.id +'" href="javascript:void(0)"><div class="title-img-container"><div class="title-rating"><i class="fas fa-star"></i> <span>'+ value.vote_average +'</span></div><img data-lazy="https://image.tmdb.org/t/p/w342/'+ value.poster_path +'" alt=""></div><p class="title-name text-truncate">'+ value.original_title +'</p></a></div>');
      });
    });
  } // END fetchMovies









});
