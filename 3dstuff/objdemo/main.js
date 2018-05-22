"use strict";

var canvas = document.getElementById("canvas");

function clearCanvas() {
	canvas.width = window.innerWidth-4;
	canvas.height = window.innerHeight-4;
}

var frames = 0;
var time = window.performance.now();
var lastfps = 0;
var lightDir = new Vector4(-0.21,-0.5,0.3).unit; //new Vector4(0,-sqrt(2)/2,sqrt(2)/2);
var keys = [];
var mouseDown = false;
var mouseSensitivity = 0.25;
var cameraSpeed = 2.5;

var camerax = 0;
var cameray = 0;

function keyDownFunc(e) {
	keys[e.keyCode] = true;
}

function keyUpFunc(e) {
	keys[e.keyCode] = undefined;
}

function mouseDownFunc(e) {
	if (e.button === 2) {
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
		canvas.requestPointerLock();
		mouseDown = true;
	}
}

function mouseUpFunc(e) {
	if (e.button === 2) {
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
		document.exitPointerLock();
		mouseDown = false;
	}
}

function mouseMoveFunc(e) {
	if (mouseDown) {
		var mousedx = (e.movementX || e.mozMovementX || 0);
		var mousedy = (e.movementY || e.mozMovementY || 0);
		camerax = camerax + mousedy;
		cameray = cameray + mousedx;
	}
}

window.addEventListener("keydown",keyDownFunc);
window.addEventListener("keyup",keyUpFunc);
window.addEventListener("mousedown",mouseDownFunc);
window.addEventListener("mouseup",mouseUpFunc);
window.addEventListener("mousemove",mouseMoveFunc);
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, true);

var x = 0;
var y = 0;
var z = 0;

var mesh1 = new Mesh("objfiles/teapot.obj",new Vector4(1,1,1),new Matrix4(1,0,0,0,
															   0,1,0,0,
															   0,0,1,3,
															   0,0,0,1),new Color(200,200,200),0,false,true);

var lasttime = window.performance.now();
var averagecalctime = 0;
var lastaveragecalctime = 0;

var context = new RenderContext(canvas);
var context2d = context.context;
var camera = context.camera;
camera.fov = 60;

context.addobject(mesh1);

var columns = 10;
var rows = 20;
var distance = 0.125;
var linewidth = 0.5;

function clearCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

var ldt;
var facecount;

var buttons = document.getElementById("buttons");

var elements = buttons.getElementsByTagName('*');

for (var i=0; i<elements.length; i++) {
	var b = elements[i]
	if (b.id != "") {
		b.onclick = function() {
			mesh1.setMeshUrl("objfiles/"+this.id+".obj");
		}
	}
}

function render(now) {
	var now = now || window.performance.now();
	var elapsedtime = now-lasttime;
	var dt = elapsedtime/1000;
	lasttime = now;
	clearCanvas();
	buttons.style.left = Math.round(canvas.width/2-buttons.offsetWidth/2) + "px";
	frames = frames+1;
	if (now-time >= 1000) {
		lastfps = frames/(now-time)*1000;
		lastaveragecalctime = averagecalctime;
		frames = 0;
		averagecalctime = 0;
		time = now;
	}

	if (keys[87] == true) {
		camera.cframe = camera.cframe.mul(new Matrix4(1,0,0,0,
										0,1,0,0,
										0,0,1,cameraSpeed*dt,
										0,0,0,1));
	}
	if (keys[83] == true) {
		camera.cframe = camera.cframe.mul(new Matrix4(1,0,0,0,
										0,1,0,0,
										0,0,1,-cameraSpeed*dt,
										0,0,0,1));
	}
	if (keys[65] == true) {
		camera.cframe = camera.cframe.mul(new Matrix4(1,0,0,-cameraSpeed*dt,
										0,1,0,0,
										0,0,1,0,
										0,0,0,1));
	}
	if (keys[68] == true) {
		camera.cframe = camera.cframe.mul(new Matrix4(1,0,0,cameraSpeed*dt,
										0,1,0,0,
										0,0,1,0,
										0,0,0,1));
	}
	if (keys[81] == true) {
		camera.cframe = camera.cframe.mul(new Matrix4(1,0,0,0,
										0,1,0,-cameraSpeed*dt,
										0,0,1,0,
										0,0,0,1));
	}
	if (keys[69] == true) {
		camera.cframe = camera.cframe.mul(new Matrix4(1,0,0,0,
										0,1,0,cameraSpeed*dt,
										0,0,1,0,
										0,0,0,1));
	}
	camera.cframe = new Matrix4(1,0,0,camera.cframe.position.x,
						 0,1,0,camera.cframe.position.y,
						 0,0,1,camera.cframe.position.z,
						 0,0,0,1).mul(Matrix4.fromEuler(0,rad*cameray*mouseSensitivity,0)).mul(Matrix4.fromEuler(rad*camerax*mouseSensitivity,0,0));

	x = x+80*dt;
	y = y+80*dt;
	z = z+80*dt;
	
	//mesh1.setsize(new Vector4(1,sin(window.performance.now()/1000*4)*0.5+1.5,1));

	//mesh1.setcframe(new Matrix4(mesh1.getcframe().position).mul(Matrix4.fromEuler(x*rad,y*rad,z*rad)));

    context.render();
    context2d.fillStyle = "black";
    context2d.globalAlpha = 1;
    context2d.fillText("FPS: " + lastfps, 0, 20);
	context2d.fillText("Average calc time: " + lastaveragecalctime + " ms", 0, 30);
	context2d.fillText("Faces rendered: " + facecount, 0, 40);
	averagecalctime = (averagecalctime+(window.performance.now()-now))/2;
	window.requestAnimationFrame(render);
}

render();
