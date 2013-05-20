console.log("Browser plugin installed: " + zig.pluginInstalled);
console.log("Browser plugin version: " + zig.pluginVersion);
console.log("Zig.js version: " + zig.version);
console.log("Sensor connected: " + zig.sensorConnected);

zig.addEventListener('statuschange', function() {
        console.log("Sensor connected: " + zig.sensorConnected);
});

var sound = new Audio("PUNCH.wav");
sound.preload = 'auto';
sound.load();

var ce = document.createElement('div');
ce.id = 'mycursor';
document.body.appendChild(ce);

function clamp(x, min, max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
}

var hand = zig.EngageFirstUserInSession();
var pushDetector = zig.controls.PushDetector();
var pullDetector = zig.controls.PullDetector();
 
// hand

hand.addEventListener('sessionstart', function(focusPosition) {
    console.log("started");
    addPull();
    addPush();
    ce.style.display = 'block';
});

hand.addEventListener('sessionend', function() {
    console.log("ended");
});

hand.addEventListener('sessionupdate', function(position) {

    var d = $V(position).subtract($V([0,0,0])).elements;

    var val = [clamp((d[0]/300) + 0.5, 0, 1),
               clamp((d[1]/250), 0, 1),
               clamp(d[2]/ + 0.5, 0, 1)];

    ce.style.left = (val[0] * window.innerWidth - (ce.offsetWidth / 2)) + "px";
    ce.style.top = ((1- val[1]) * window.innerHeight - (ce.offsetHeight / 2)) + "px";
});

// PushDetector

function addPush(){
    pushDetector.addEventListener('push', function(pd) {
        console.log('PushDetector: Push');
        ce.classList.add('pushed');
        var click=sound.cloneNode();
        click.play();
    });
    pushDetector.addEventListener('release', function(pd) {
        console.log('PushDetector: Release');
        ce.classList.remove('pushed');
    });
    pushDetector.addEventListener('click', function(pd) {
        console.log('PushDetector: Click');
    });
}

function removePush(){
    console.log("remove push");
    pushDetector.removeEventListener('push');
    pushDetector.removeEventListener('release');
    pushDetector.removeEventListener('click');
}

//PullDetector

function addPull(){
    console.log("add pull");
    pullDetector.addEventListener('pull', function(pd) {
        console.log('PullDetector: Pull');
        ce.classList.add('pulled');
        var click=sound.cloneNode();
        click.play();
    });
    pullDetector.addEventListener('release', function(pd) {
        console.log('PullDetector: Release');
        ce.classList.remove('pulled');
    });
    pullDetector.addEventListener('click', function(pd) {
        console.log('PullDetector: Click');
    });
}

function removePull(){
    console.log("remove pull");
    pullDetector.removeEventListener('pull');
    pullDetector.removeEventListener('release');
    pullDetector.removeEventListener('click');
}

zig.singleUserSession.addListener(pushDetector);
zig.singleUserSession.addListener(pullDetector);

zig.addListener(hand);

