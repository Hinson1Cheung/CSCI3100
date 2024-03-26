$(document).ready(function() {
    $('.product-item').hover(function() {
        $(this).find('.product-button').css({'visibility': 'visible', 'opacity': 1});
    }, function() {
        $(this).find('.product-button').css({'visibility': 'hidden', 'opacity': 0});
    });
});
window.onload = function() {
    var referrer = "Pervious Page";
    var link = document.getElementById('historyLink');
    link.textContent = referrer;
    link.onclick = function() {
        if (window.location.href.includes('#')) {
            history.go(-2);
        } else {
            history.go(-1);
        }
        return false;
    }
}
function validateInput(element) {
    var value = element.textContent.replace(/[^0-9.]/g, '');
    if (value.charAt(0) !== '$') {
        value = '$' + value;
    }
    element.textContent = value;
}