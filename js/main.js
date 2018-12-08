$(function() {

  init();

  hidePageOverlay();











  function init() {
    // Initialize slick carousel
    $('.titles-slider').slick({
      lazyLoad: 'ondemand',
      infinite: false,
      speed: 800,
      slidesToShow: 6,
      slidesToScroll: 1,
      responsive: [{
          breakpoint: 1200,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });



    console.log('init function called');


  }

  function hidePageOverlay() {
    $('.page-overlay').fadeOut(300).css({'visibility': 'hidden'});
  }


  function config() {
    const apiKey = '0fd55b792d815c99792d8ba07533e9f6';
    const baseURL = 'https://api.themoviedb.org/3/';
    let baseImageURL = 'https://image.tmbdb.org/';
    configData,
    baseImageURL;



  }

  function getMovies(type) {
    $.get()
  }








  $('.title').hover(function() {
    $(this).children().children('.title-category').toggle();
  });




});
