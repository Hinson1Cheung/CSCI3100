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
}
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
    // Remove all characters that are not digits or a period
    var value = element.textContent.replace(/[^0-9.]/g, '');
    // Ensure the first character is a dollar sign
    if (value.charAt(0) !== '$') {
        value = '$' + value;
    }
    // Update the text content of the element
    element.textContent = value;
}