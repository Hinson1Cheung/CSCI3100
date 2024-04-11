const searchBar = document.getElementById('search-bar');
const minPrice = document.getElementById('min');
const maxPrice = document.getElementById('max');
const category = document.getElementById('category');

let products = [];

// Fetch products from the server when the page loads
window.onload = async () => {
    const response = await fetch('/api/products');
    products = await response.json();

    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = decodeURIComponent(urlParams.get('query'));
    const min = decodeURIComponent(urlParams.get('min'));
    const max = decodeURIComponent(urlParams.get('max'));
    const cat = decodeURIComponent(urlParams.get('category'));

    searchBar.value = searchTerm;
    minPrice.value = min;
    maxPrice.value = max;
    category.value = cat;

    // Trigger the 'input' event to filter the products
    searchBar.dispatchEvent(new Event('input'));
};

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();

    if (!searchTerm) {
        return;
    }

    const matchingProducts = products.filter(product => product.pName.toLowerCase().includes(searchTerm));

    if (matchingProducts.length > 0) {
        matchingProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('preview-item');
            productElement.innerHTML = `
                <div class="product-item">
                    <h3>${product.pName}</h3>
                    <div class="product-details">
                        <img src="../${product.imageURL}" alt="${product.pName}">
                        <p>${product.description}</p>
                    </div>
                </div>
            `;

            productElement.addEventListener('click', () => {
                window.location.href = `/product/${product.productID}`;
            });
        });
    }
});

searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        const searchTerm = searchBar.value.toLowerCase();
        const minprice = document.getElementById('min').value;
        const maxprice = document.getElementById('max').value;
        const cat = category.value.toLowerCase();

        const matchingProduct = products.find(product => product.pName.toLowerCase() === searchTerm);

        if (matchingProduct) {
            window.location.href = `/product/${matchingProduct.productID}`;
        } else {
            window.location.href = `/search?query=${encodeURIComponent(searchTerm)}&min=${minprice}&max=${maxprice}&category=${cat}`;
        }
    }
});

minPrice.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        const searchTerm = searchBar.value.toLowerCase();
        const minprice = document.getElementById('min').value;
        const maxprice = document.getElementById('max').value;
        const cat = category.value.toLowerCase();

        const matchingProduct = products.find(product => product.pName.toLowerCase() === searchTerm);

        if (matchingProduct) {
            window.location.href = `/product/${matchingProduct.productID}`;
        } else {
            window.location.href = `/search?query=${encodeURIComponent(searchTerm)}&min=${minprice}&max=${maxprice}&category=${cat}`;
        }
    }
});

maxPrice.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        const searchTerm = searchBar.value.toLowerCase();
        const minprice = document.getElementById('min').value;
        const maxprice = document.getElementById('max').value;
        const cat = category.value.toLowerCase();

        const matchingProduct = products.find(product => product.pName.toLowerCase() === searchTerm);

        if (matchingProduct) {
            window.location.href = `/product/${matchingProduct.productID}`;
        } else {
            window.location.href = `/search?query=${encodeURIComponent(searchTerm)}&min=${minprice}&max=${maxprice}&category=${cat}`;
        }
    }
});

category.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        const searchTerm = searchBar.value.toLowerCase();
        const minprice = document.getElementById('min').value;
        const maxprice = document.getElementById('max').value;
        const cat = category.value.toLowerCase();

        const matchingProduct = products.find(product => product.pName.toLowerCase() === searchTerm);

        if (matchingProduct) {
            window.location.href = `/product/${matchingProduct.productID}`;
        } else {
            window.location.href = `/search?query=${encodeURIComponent(searchTerm)}&min=${minprice}&max=${maxprice}&category=${cat}`;
        }
    }
});

window.onbeforeunload = function() {
    searchBar.value = '';
}