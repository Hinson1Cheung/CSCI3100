//button animation (assist by Github copilot)
$(document).ready(function() {
    $('.product-item').hover(function() {
        $(this).find('.product-button').css({'visibility': 'visible', 'opacity': 1});
    }, function() {
        $(this).find('.product-button').css({'visibility': 'hidden', 'opacity': 0});
    });
});
//back to top button
$(document).ready(function(){
    $('.scroll-to-top').click(function(event){
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
    });
});
//logic of previous page button
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

// Parse the String data into JSON
var jsonData = JSON.parse(productInfoJS);
const loginFlag = JSON.parse(loginJS);
const pCount = JSON.parse(productCountJS);
console.log("loginFlag: ", loginFlag);

// Debugged with the help from GitHub Copilot
async function addToCart(){
    const productID = jsonData.productID;
    const quantity = jsonData.quantity;
    const pName = jsonData.pName;
    var count = document.getElementById("quantity").value;
    var diff = count - Math.floor(count);
    if (pCount.length != 0) {
        // console.log(Object.values(pCount)[0].count);
        // check if the quantity in cart exceed the stock if user already have the product in cart
        let inCart = Object.values(pCount)[0].count;
        const total = Number(count) + Number(inCart);
        if (total > quantity) {
            alert("The quantity you entered exceed the product stock.\nPlease try again.");
            // console.log("if: " ,total);
            return;
        }
    }
    else {
        // check if the quantity in cart exceed the stock
        if (count > quantity) {
            alert("The quantity you entered exceed the product stock.\nPlease try again.");
            return;
        }
    }
    // check if the quantity input is decimal number
    if (diff != 0) {
        alert("Invalid quantity.\nQuantity must be an integer.");
        return;
    }
    // check if the quantity input is positive
    if (count < 1) {
        alert("Invalid quantity.\nQuantity is non-zero.");
        return;
    }
    if (loginFlag) {
        await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({productID: productID, addCount: count}),
        })
        .then(response => response.json())
        .then(data =>  {
            console.log('Success:', data); 
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        console.log(jsonData);
        alert("Product: " + pName + " of quantity of " + String(count) + " added to your cart successfully!");
        window.location.href = "/product/" + String(productID);
    }
    else {
        await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({loginFlag}),
        });
        alert("You need to login first!");
        window.location.href = "/login";
    }
    
    // alert("Product: " + pName + "of quantity: " + String(count) + " added to your cart successfully!");
    // location.reload();
}

// var orderBtn = document.getElementById("dropbtn");
// var dropdownBtn = document.getElementsByClassName("dropdown-block");
// dropdownBtn[0].addEventListener("click", changeOrder("Time")); //sort by time
// dropdownBtn[1].addEventListener("click", changeOrder("Rating")); //sort by rating
// function changeOrder(orderType){
//     console.log("clicked by "+orderType);
//     orderBtn.innerHTML = "<img src=\"../image/sort-arrows-couple-pointing-up-and-down.png\" style=\"height: 20px;\"/>" + orderType;
// }


var orderBtn = document.getElementById("comment-orderbtn");
var typeBtn = document.getElementById("comment-typebtn");
console.log(typeBtn);
// orderBtn.addEventListener("change",switchOrder);
// typeBtn.addEventListener("change",switchType);
function switchOrder(){ //show comments in ascending or descending order
    console.log(orderBtn.innerHTML);
    if(orderBtn.innerHTML == "<img src=\"../image/down.png\" style=\"height: 20px;\">"){
        orderBtn.innerHTML = "<img src=\"../image/up.png\" style=\"height: 20px;\">";
    }else{
        orderBtn.innerHTML = "<img src=\"../image/down.png\" style=\"height: 20px;\">";
    }
}
function switchType(){ //show comments by time or rating
    console.log(typeBtn.innerHTML);
    if(typeBtn.innerHTML == "By Time"){
        typeBtn.innerHTML = "By Rating";

    }else{
        typeBtn.innerHTML = "By Time";
    }
}

const stars = document.getElementsByClassName("star");
function fillstar(id){ //fill the stars according to the input rating
    console.log("filled");
    for (let i=0; i < id; i++){
        stars[i].checked = true;
    }
    for (let i=id; id < 5; i++){
        stars[i].checked = false;
    }
}