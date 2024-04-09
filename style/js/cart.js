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

// Parse the String data into JSON
var jsonData = JSON.parse(cartDataJS);
var TEMPTOTALPRODUCTS = jsonData[0]['total'];
// console.log(TEMPTOTALPRODUCTS); 

// var TEMPTOTALPRODUCTS = 10; //will retrive from backend in the future
var productPic = document.getElementsByClassName('product-image');
for(let i=0; i < TEMPTOTALPRODUCTS; i++){
    // console.log(TEMPTOTALPRODUCTS);
    // console.log(productPic);
    productPic[i].onclick = function(i){
        if(confirm("View product details page of \n[product name]?")){
            window.location.href = "../product/index.html";
        }
    };
}

var selectBox = document.getElementById('select');
function selection(){ //decide need select or unselect all
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

var checkOutBar = document.getElementById("toolbar");
function toolBar(){ //show functions only when item is selected
    //count number of selected products
    let selected = 0;
    for(let i=0; i < TEMPTOTALPRODUCTS; i++){ //check if has item selected
        if(checkBox[i].checked){
            selected++;
        }
    }
    if(selected == TEMPTOTALPRODUCTS){
        selectBox.checked = true;
    }else{
        selectBox.checked = false;
    }
    //update html with counted number
    let printCount = document.getElementById("pc");
    printCount.innerHTML = "&emsp;" + selected + " Product(s) Selected ";
    //show bar if any product is selected 
    if(selected>0) { //show bar
        checkOutBar.style.display = "flex";
        checkOutBar.style.position = "sticky";
        checkOutBar.style.bottom = 0;
    }else{ //hide bar
        checkOutBar.style.display = "none";
    }
}

function addUpTotal(){
    let total = 0;
    for(let i=0; i < TEMPTOTALPRODUCTS; i++){ //check if has item selected
        if(checkBox[i].checked){
            var qid = "q" + String(checkBox[i].id);
            var pid = "p" + String(checkBox[i].id);
            var num = document.getElementById(String(qid)).value;
            var price = parseFloat(String(document.getElementById(String(pid)).innerHTML).substring(1));
            total = total + price * num
        }
    }
    //update html with total price
    var printTotal = document.getElementById("total");
    printTotal.innerHTML = "&emsp;" + " Total Price: $ " + total.toFixed(2) +"&emsp;";
}

var checkBox = document.getElementsByClassName('chk'); //record the checkboxes
var numberBox = document.getElementsByClassName("number-input");
var selecButton = document.getElementById("select")
selecButton.addEventListener("click", addUpTotal);
for (let i=0; i < TEMPTOTALPRODUCTS; i++){
    checkBox[i].addEventListener("input", toolBar);
    checkBox[i].addEventListener("input", addUpTotal);
    numberBox[i].addEventListener("click", addUpTotal);
    // console.log("now the " + i + " th one: "+checkBox[i]); //debug 
}

function selectDel(){ //delete the selected items
    let confirmDel = false;
    if(confirm("Remove selected items from your cart?")){
        let msgDeleted = "";
        for(let i=0; i < TEMPTOTALPRODUCTS; i++){ //sent selected item to backend later
            if(checkBox[i].checked){
                msgDeleted = msgDeleted + "id " + i + " is deleted\n";
            }
        }
        alert(msgDeleted); //for debug check if selected product is deleted
        location.reload(); //refresh the page to update products
    }
}
