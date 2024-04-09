const searchBar = document.getElementById('search-bar');
const previewContainer = document.getElementById('preview-container');

const products = [
  { name: 'Sample', image: './image/sample.png', description: 'sample' },
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
            window.location.href = `product/index.html`;
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