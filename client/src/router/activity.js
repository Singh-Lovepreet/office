export default{

Active(inactive,active){

var timeout;
 
function setup() {
    window.addEventListener("mousemove", resetTimer, false);
    window.addEventListener("mousedown", resetTimer, false);
    window.addEventListener("keypress", resetTimer, false);
    window.addEventListener("DOMMouseScroll", resetTimer, false);
    window.addEventListener("mousewheel", resetTimer, false);
    window.addEventListener("touchmove", resetTimer, false);
    window.addEventListener("MSPointerMove", resetTimer, false);
    window.addEventListener('click',resetTimer,false);
 
    startTimer();
}
setup();

function startTimer() {
    timeout = window.setTimeout(goInactive, 80000000);
}
 
function resetTimer(e) {
    window.clearTimeout(timeout);
 
    goActive();
}
 
function goInactive() {

    console.log('inactive')
    

}
 
function goActive() {
      console.log('active')

         
    startTimer();
}

}
};