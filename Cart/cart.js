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

$(document).ready(function(){
    $('.scroll-to-top').click(function(event){
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
    });
});

}

function selectAll(){
    var arr=document.getElementsByClassName('chk');
    for(var i=0;i<arr.length;i++){
        if(arr[i].type=='checkbox')
            arr[i].checked=true;
    }
}

function unSelectAll(){
    var arr=document.getElementsByClassName('chk');
    for(var i=0;i<arr.length;i++){
        if(arr[i].type=='checkbox')
            arr[i].checked=false;
    }
}