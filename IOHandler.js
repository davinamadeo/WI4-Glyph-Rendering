var freeze = false;

function onMouseClick(event){
    freeze = !freeze;
}

var keys = {};

function isKeyPressed(keyCode){
    return keys[keyCode] === true;
}


function onKeydown(event){
    keys[event.keyCode] = true;
    
    if(event.keyCode == 32){ // Space
        freeze = true;
        event.preventDefault(); // Mencegah scroll halaman
    }
    if(event.keyCode == 38 || event.keyCode == 40){ // Arrow Up/Down
        event.preventDefault(); // Mencegah scroll halaman
    }
}

function onKeyup(event){
    keys[event.keyCode] = false; // reset status

    if(event.keyCode == 32){
        freeze = false;
    }
}

document.addEventListener("click", onMouseClick);
document.addEventListener('keydown', onKeydown, false);
document.addEventListener('keyup', onKeyup, false);
