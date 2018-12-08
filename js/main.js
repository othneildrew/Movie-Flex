$(function() {


  function hidePageOverlay() {
    $('.page-overlay').fadeOut(300).css({'visibility': 'hidden'});
  }

  hidePageOverlay();


  init();









  function init() {
    // Initialize slick carousel
    $('.titles-slider').slick({
      lazyLoad: 'ondemand',
      infinite: false,
      speed: 600,
      slidesToShow: 6,
      slidesToScroll: 1,
      responsive: [{
          breakpoint: 1024,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
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
