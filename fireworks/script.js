let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let width = window.innerWidth;
let height = window.innerHeight;
let clicked = false;
let mouseX = 0, mouseY = 0;
let particles = [];
let particlesSetting = {
    gravity: 0.05,
};

let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60);
};

window.onload = () => {
    canvas.width = width;
    canvas.height = height;
    deviceType = isTouchDevice() ? "touch" : "mouse";
    canvas.addEventListener(events[deviceType].down, onMouseDown);
    canvas.addEventListener(events[deviceType].up, onMouseUp);
    window.requestAnimationFrame(startFireWork);
};

function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
}

function randomNumberGeneratr(min, max) {
    return Math.random() * (max - min) + min;
}

function particle() {
    this.width = randomNumberGeneratr(0.1, 0.9) * 5;
    this.height = randomNumberGeneratr(0.1, 0.9) * 5;
    this.x = mouseX - this.width / 2;
    this.y = mouseY - this.height / 2;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
}

particle.prototype = {
    move: function() {
        if (this.x >= canvas.width || this.y >= canvas.height) {
            return false;
        }
        return true;
    },
    draw: function() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += particlesSetting.gravity;
        context.save();
        context.beginPath();
        context.translate(this.x, this.y);
        context.arc(0, 0, this.width, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.closePath();
        context.fill();
        context.restore();
    },
};

function createFirework() {
    var numberOfParticles = randomNumberGeneratr(10, 50);
    //عدد الالوان
    let color = `rgb(${randomNumberGeneratr(0, 255)},${randomNumberGeneratr(0, 255)},${randomNumberGeneratr(0, 255)})`
    for (var i = 0; i < numberOfParticles; i++) {
        var p = new particle();
        p.color = color;
        var vy = Math.sqrt(25 - p.vx * p.vx);
        if (Math.abs(p.vy) > vy) {
            p.vy = p.vy > 0 ? vy : -vy;
        }
        particles.push(p);
    }
}
function startFireWork() {
    let current = [];
    context.fillStyle = "rgba(0,0,0,0.1)";
    context.fillRect(0, 0, width, height);
    if (clicked) {
        createFirework();
    }
    for (let i in particles) {
        particles[i].draw();
        if (particles[i].move()) {
            current.push(particles[i])
        }
    }
    particles = current;
    window.requestAnimationFrame(startFireWork);
}

function onMouseDown(e) {
    e.preventDefault();
    clicked = true;
    mouseX = isTouchDevice() ? e.touches[0].pageX : e.pageX;
    mouseY = isTouchDevice() ? e.touches[0].pageY : e.pageY;
}

function onMouseUp(e) {
    e.preventDefault();
    clicked = false;
}
