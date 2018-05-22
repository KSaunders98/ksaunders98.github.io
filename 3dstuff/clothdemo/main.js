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

var box1 = new Part(new Vector4(2,1,1),new Matrix4(1,0,0,0,
												   0,1,0,0,
												   0,0,1,3,
												   0,0,0,1).mul(Matrix4.fromEuler(0.25,0,0.1)),new Color(255,0,0),0.5);

var lasttime = window.performance.now();
var averagecalctime = 0;
var lastaveragecalctime = 0;

var context = new RenderContext(canvas);
var context2d = context.context;
var camera = context.camera;

context.addobject(box1);

var columns = 10;
var rows = 20;
var distance = 0.1;
var linewidth = 0.5;

var canvas = document.getElementById("canvas");

function clearCanvas() {
	canvas.width = window.innerWidth-4;
	canvas.height = window.innerHeight-4;
}

clearCanvas();

var acceleration = new Vector4(0,-40,0,1); //new Vector4(0,-50,0,1)

function update(data,dt,ldt) {
	if (!data.anchored) {
		var pos = data["position"];
		var dpos = pos.sub(data["lastposition"]);
		data["lastposition"] = pos;
		//var dt2 = dt*dt;  //x + dx*dt/lastdt + accelerationx*dt*(dt + lastdt)/2
		data["position"] = pos.add(dpos.mul(0.95*dt/ldt)).add(acceleration.mul(dt*(dt+ldt)/2));//pos.add(dpos.mul(0.85*dt2)).add(acceleration.mul(dt2));
	} else {
		data.position.z = sin(window.performance.now()/1000)*1.5+3;
		/*data.position.y = cos(window.performance.now()/1000*10)+2;*/
	}
}

function newpoint(position,anchored) {
	var data = [];
	data["position"] = position
	data["lastposition"] = position;
	data["anchored"] = anchored;
	return data;
}

function constrain(data) {
	var p1 = data["p1"];
	var p2 = data["p2"];
	var pos1 = p1["position"];
	var pos2 = p2["position"];
	var dpos = pos2.sub(pos1);
	var dis = dpos.magnitude;
	
	var stiffness = data["stiffness"];
    var scalarP1 = 0.5 * stiffness;
    var scalarP2 = scalarP1;

	var dif = (data["restingDis"]-dis)/dis;
	var scalarP1 = scalarP1*dif;
	var scalarP2 = scalarP2*dif;
	if (p1.anchored || p2.anchored) {
		scalarP1 = scalarP1*2;
		scalarP2 = scalarP2*2;
	}
	if (!p1.anchored) {
		p1.position = pos1.sub(dpos.mul(scalarP1));
	}
	if (!p2.anchored) {
		p2.position = pos2.add(dpos.mul(scalarP2));
	}
}

function newlink(p1,p2,dis,stiffness) {
	var data = [];
	data["p1"] = p1;
	data["p2"] = p2;
	data["restingDis"] = dis;
	data["stiffness"] = stiffness;
	return data;
}

var points = [];
var links = [];

for (var col=0;col<columns;col++) {
	for (var row=0;row<rows;row++) {
		var anchored = false;
		if (row == 0) {//((col == 0 && row == 0) || (col == columns-1 && row == 0)) {
			anchored = true;
		}
		points[row*columns+col] = newpoint(new Vector4(col*distance-columns*distance*0.5,1.5,2.5+row*distance,1),anchored);
		if (col > 0) {
			links[links.length] = newlink(points[row*columns+col-1],points[row*columns+col],distance,1.5);
		}
		if (row > 0) {
			links[links.length] = newlink(points[(row-1)*columns+col],points[row*columns+col],distance,1.5);
		}
	}
}

class Plane {
	constructor(position,normal,point,scalar) {
		this.position = position;
		this.normal = normal;
		this.point = point;
		this.scalar = scalar;
	}
	calcDot(point) {
		return (point.sub(this.position).dot(this.normal)) - this.scalar;
	}
	toPlane(point) {
		return point.sub(this.normal.mul(point.sub(this.point).dot(this.normal)));
	}
}

var Up = new Vector4(0,1,0,1);
var Down = new Vector4(0,-1,0,1);
var Right = new Vector4(1,0,0,1);
var Left = new Vector4(-1,0,0,1);
var Front = new Vector4(0,0,1,1);
var Back = new Vector4(0,0,-1,1);

class Collision {
	constructor(part) {
		var planes = [];
		this.planes = planes;
		var cfr = part.getcframe();
		var pos = cfr.position;
		var rot = cfr.sub(pos);
		this.position = pos;
		var size = part.getsize().mul(0.5);
		var norm = rot.mul(Up);
		planes[0] = new Plane(pos,norm,pos.add(norm.mul(size.y)),size.y);
		var norm = rot.mul(Down);
		planes[1] = new Plane(pos,norm,pos.add(norm.mul(size.y)),size.y);
		var norm = rot.mul(Right);
		planes[2] = new Plane(pos,norm,pos.add(norm.mul(size.x)),size.x);
		var norm = rot.mul(Left);
		planes[3] = new Plane(pos,norm,pos.add(norm.mul(size.x)),size.x);
		var norm = rot.mul(Front);
		planes[4] = new Plane(pos,norm,pos.add(norm.mul(size.z)),size.z);
		var norm = rot.mul(Back);
		planes[5] = new Plane(pos,norm,pos.add(norm.mul(size.z)),size.z);
	}
	collidePoint(point) {
		var pos = point.position;
		var planes = this.planes;
		var best;
		var bestd;
		var l = planes.length;
		for (var i=0; i<l; i++) {
			var p = planes[i];
			var d = -p.calcDot(pos);
			if (d < 0) {
				point.plane = undefined;
				return false;
			}
			if (!best || d < bestd) {
				best = p;
				bestd = d;
			}
		}
		point.plane = best;
		point.position = best.toPlane(pos);
	}
	collideLink(link) {
		var p1 = link.p1;
		var p2 = link.p2;
		this.collidePoint(p1);
		this.collidePoint(p2);
		var pos1 = p1.position;
		var pos2 = p2.position;
		var plane1 = p1.plane;
		var plane2 = p2.plane;
		if (typeof plane1 == "undefined" || typeof plane2 == "undefined") {
			return false;
		}
		if (plane1 == plane2) {
			return false;
		}
		var dir = pos2.sub(pos1);
		var a = plane2.toPlane(pos1).sub(pos1);
		var b = plane1.toPlane(pos2).sub(pos2);
		if (a.magnitude < b.magnitude) {
			var p = dir.mul(a.dot(dir)/dir.dot(dir));
			p = a.sub(p).mul(0.25);
			p1.position = pos1.add(p);
			p2.position = pos2.add(p);
		} else {
			var p = dir.mul(a.dot(dir)/dir.dot(dir));
			p = a.sub(p).mul(0.25);
			p1.position = pos1.add(p);
			p2.position = pos2.add(p);
		}
	}
}

var ldt;
var facecount;

var buttons = document.getElementById("message");

function render(now) {
	var now = now || window.performance.now();
	var elapsedtime = now-lasttime;
	var dt = elapsedtime/1000;
	lasttime = now;
	clearCanvas();
	message.style.left = Math.round(canvas.width/2-message.offsetWidth/2) + "px";
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

	x = x+50*dt;
	y = y+50*dt;
	z = z+50*dt;

	box1.setcframe(new Matrix4(box1.getcframe().position).mul(Matrix4.fromEuler(x*rad,y*rad,z*rad)));

	//acceleration.z = sin(window.performance.now()/1000*0.5)*200//+cos(tan(window.performance.now()/1000*10))*75;
	var col = new Collision(box1);
	for (var i=0;i<points.length;i++) {
		var p = points[i];
		update(p,dt,ldt || dt);
	}
	ldt = dt;
	var length = links.length;
	for (var i=0;i<15;i++) {
		for (var i2=0;i2<length;i2++) {
			var l = links[i2];
			constrain(l,col);
			col.collideLink(l);
		}
	}
	context.clearfaces();
	for (var i=0;i<points.length;i++) {
		var point = points[i];
		var row = Math.floor(i/columns);
		var col = i-row*columns;
		if (col < columns-1 && row < rows-1) {
			var vertices = [];
			vertices[0] = point.position;
			vertices[1] = points[(row+1)*columns+col].position;
			vertices[2] = points[(row+1)*columns+col+1].position;
			vertices[3] = points[row*columns+col+1].position;
			context.addface(new Face(vertices,new Color(0,255,0),0.5,true,undefined,false));
		}
	}
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
