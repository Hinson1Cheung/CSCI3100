window.onload = function() {
    var referrer = "Previous Page";
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
$(document).ready(function(){
    $('.scroll-to-top').click(function(event){
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
    });
});

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


function selection(){ //decide need select or unselect all
    var selectBox = document.getElementById('select');
    if(selectBox.checked){
        selectAll();
    }else{
        unSelectAll();
    }
}

function selectAll(){
    var arr=document.getElementsByClassName('chk');
    for(var i=0;i<arr.length;i++){
        if(arr[i].type=='checkbox')
            arr[i].checked=true;
    }
    toolBar(); //update bar
}

function unSelectAll(){
    var arr=document.getElementsByClassName('chk');
    for(var i=0;i<arr.length;i++){
        if(arr[i].type=='checkbox')
            arr[i].checked=false;
    }
    toolBar(); //update bar
}


function toolBar(){ //show functions only when item is selected
    //count number of selected products
    var checkOutBar = document.getElementById("toolbar");
    let selected = 0;
    for(let i=0; i < 10; i++){ //check if has item selected
        if(checkBox[i].checked){
            selected++;
        }
    }
    //update html with counted number
    var printCount = document.getElementById("pc");
    printCount.innerHTML = "&emsp;" + selected + " Products Selected ";
    //show bar if any product is selected 
    if(selected>0) { //show bar
        checkOutBar.style.display = "flex";
        checkOutBar.style.position = "sticky";
        checkOutBar.style.bottom = 0;
    }else{ //hide bar
        checkOutBar.style.display = "none";
    }
}

var checkBox = document.getElementsByClassName('chk'); //record the checkboxes
for (let i=0; i < 10; i++){
    checkBox[i].addEventListener("input", toolBar);
    console.log("now the " + i + " th one: "+checkBox[i]); //debug 
}
