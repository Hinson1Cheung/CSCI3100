const searchBar = document.getElementById('search-bar');
const previewContainer = document.getElementById('preview-container');

let products = [];

// Fetch products from the server when the page loads
window.onload = async () => {
    const response = await fetch('/api/products');
    products = await response.json();
};

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();

    if (!searchTerm) {
        previewContainer.style.display = 'none';
        return;
    }

    previewContainer.innerHTML = '';

    const matchingProducts = products.filter(product => product.pName.toLowerCase().includes(searchTerm) || product.productID === searchTerm);

    if (matchingProducts.length > 0) {
        const product = matchingProducts[0];

        const productElement = document.createElement('div');
        productElement.classList.add('preview-item');
        productElement.innerHTML = `
            <h3>${product.pName}</h3>
            <img src="../${product.imageURL}" alt="${product.pName}">
            <p>${product.description}</p>
        `;

        productElement.addEventListener('click', () => {
            window.location.href = `/product/${product.productID}`;
        });

        previewContainer.appendChild(productElement);
        previewContainer.style.display = 'block';
    } else {
        previewContainer.style.display = 'none';
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

        const searchTerm = searchBar.value.toLowerCase();

        const matchingProduct = products.find(product => product.pName.toLowerCase() === searchTerm);

        if (matchingProduct) {
            window.location.href = `/product/${matchingProduct.productID}`;
        } else {
            window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
        }
    }
});

window.onbeforeunload = function() {
    searchBar.value = '';
}