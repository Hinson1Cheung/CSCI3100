$(document).ready(function() {
    $('.product-item').hover(function() {
        $(this).find('.product-button').css({'visibility': 'visible', 'opacity': 1});
    }, function() {
        $(this).find('.product-button').css({'visibility': 'hidden', 'opacity': 0});
    });
});
