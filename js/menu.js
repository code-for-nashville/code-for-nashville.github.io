$('.site-header .menu-icon').click(function (){
  $('.site-header nav').slideToggle();
});


$(window).resize(function () {
  if ( $(window).width() > 900 ) {
    $('.site-header nav').removeAttr('style');
  }
});
