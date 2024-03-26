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
function validateInput(event) {
    var element = event.target;
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var selectionStart = range.startOffset;
    var selectionEnd = range.endOffset;
    var value = element.textContent.replace(/[^0-9.$]/g, '');

    // Update the text content of the element before setting the cursor position
    element.textContent = value;
    // Check if the text node exists before setting the cursor position
    if (element.firstChild) {
        if (event.inputType === 'insertText' && event.data && /^[a-zA-Z]/.test(event.data)) {
            range.setStart(element.firstChild, Math.min(element.firstChild.length, selectionStart));
            range.setEnd(element.firstChild, Math.min(element.firstChild.length, selectionEnd-1));
        }
        else{
            range.setStart(element.firstChild, Math.min(element.firstChild.length, selectionStart));
            range.setEnd(element.firstChild, Math.min(element.firstChild.length, selectionEnd));
        }
    }
    selection.removeAllRanges();
    selection.addRange(range);
}
function clearContent(event) {
    var element = event.target;
    element.textContent = '';
    var selection = window.getSelection();
    var range = document.createRange();
    range.setStart(element.firstChild, 1); // Set cursor after the '$' sign
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}
function handleKeyDown(event) {
    if (event.key === 'Enter') {
        event.target.blur();
    } 
}
function handleBlur(event) {
    var element = event.target;
    element.textContent = "$" + element.textContent;
}

const searchBar = document.getElementById('search-bar');
const previewContainer = document.getElementById('preview-container');

const products = [
  { name: 'Sample', image: '.././image/sample.png', description: 'sample' },
];

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();

    if (!searchTerm) {
        previewContainer.style.display = 'none';
        return;
    }

    previewContainer.innerHTML = '';

    const matchingProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));

    if (matchingProducts.length > 0) {
        const product = matchingProducts[0];

        const productElement = document.createElement('div');
        productElement.classList.add('preview-item');
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
        `;

        productElement.addEventListener('click', () => {
            window.location.href = `.././product/index.html`;
        });

        previewContainer.appendChild(productElement);
        previewContainer.style.display = 'block';
    } else {
        previewContainer.innerHTML = '<p>No products found.</p>';
        previewContainer.style.display = 'block';
    }
});

searchBar.addEventListener('focus', () => {
    const searchTerm = searchBar.value.toLowerCase();

    if (searchTerm) {
        previewContainer.style.display = 'block';
    }
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.search-container')) {
    previewContainer.style.display = 'none';
  }
});

searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        // Get the first preview item
        const firstPreviewItem = document.querySelector('.preview-item');

        // If the first preview item exists, trigger a click event on it
        if (firstPreviewItem) {
            firstPreviewItem.click();
        }
    }
});

window.onbeforeunload = function() {
    searchBar.value = '';
}