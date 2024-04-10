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

window.addEventListener('beforeunload',backCart);


// Parse the String data into JSON
var jsonData = JSON.parse(checkedProdDataJS);
var TEMPTOTALPRODUCTS = 0;
if (jsonData.length != 0) {
    TEMPTOTALPRODUCTS = jsonData[0]['total'];
}
console.log(jsonData);
//retrive data from db (list disconnect with db)
var pidList = [];
for (let i=0; i < TEMPTOTALPRODUCTS; i++){
    pidList.push(jsonData[i]['productID']);
}
var quantityList = [];
for (let i=0; i < TEMPTOTALPRODUCTS; i++){
    quantityList.push(jsonData[i]['count']);
}
var priceList = [];
for (let i=0; i < TEMPTOTALPRODUCTS; i++){
    priceList.push(jsonData[i]['price']);
}
addUpTotal();
function addUpTotal(){
    let total = 0;
    for(let i=0; i < TEMPTOTALPRODUCTS; i++){ //check if has item selected
        var num = quantityList[i];
        var price = priceList[i];
        total = total + price * num;
    }
    //update html with total price
    var printTotal = document.getElementById("total");
    printTotal.innerHTML = "<b>$" + total.toFixed(2) + "</b>";
}
async function backCart(){ //delete the selected items
    console.log("reset checkedProd");
    await fetch('/backCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({productID: pidList}), // Send the productIDs to server
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}  
