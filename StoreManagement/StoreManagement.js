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
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var selectionStart = range.startOffset;
    var selectionEnd = range.endOffset;
    var value = element.textContent.replace(/[^0-9.]/g, '');
    if (value.charAt(0) !== '$') {
        value = '$' + value;
    }
    // Update the text content of the element before setting the cursor position
    element.textContent = value;
    // Check if the text node exists before setting the cursor position
    if (element.firstChild) {
        range.setStart(element.firstChild, Math.min(element.firstChild.length, selectionStart));
        range.setEnd(element.firstChild, Math.min(element.firstChild.length, selectionEnd));
    }
    selection.removeAllRanges();
    selection.addRange(range);
}