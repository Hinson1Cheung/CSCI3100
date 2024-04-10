const loginFlag = JSON.parse(loginJS);
async function warn(){
    if (!loginFlag){
        alert('Invalid username / password, please try again');
        window.location.href = "/login"
    }
}