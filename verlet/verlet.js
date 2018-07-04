"use strict";

var columns = 20;
var rows = 60;
var distance = 10;
var linewidth = 0.5;
var breakratio = 3;

var canvas = document.getElementById("canvas");

function clearCanvas() {
	canvas.width = window.innerWidth-4;
	canvas.height = window.innerHeight-4;
}

clearCanvas();

function update(data,dt,ldt) {
	if (!data.anchored) {
		var x = data["x"];
		var y = data["y"];
		var dx = (x-data["lastx"]);
		var dy = (y-data["lasty"]);
		data["lastx"] = x;
		data["lasty"] = y;
		var dt2 = dt/ldt;//dt/ldt;
		data["x"] = x + dx*0.99*dt2;
		data["y"] = y + dy*0.99*dt2 + 1000*dt*(ldt+dt)/2; //*dt2;//0.002*dt*dt;//(dt+ldt)/2;
		/*var x = data["x"];
		var y = data["y"];
		for (var i=0;i<points.length;i++) {
			var point = points[i];
			if (point != data) {
				var x2 = point.x;
				var y2 = point.y;
				var dx = x2-x;
				var dy = y2-y;
				var dis = Math.sqrt(dx*dx+dy*dy);
				if (dis < 2.1) {
					var mult = 2.1/dis;
					data["x"] = x+dx*mult;
					data["y"] = y+dy*mult;
				}
			}
		}*/
	}
}

function newpoint(x,y,anchored) {
	var data = [];
	data["x"] = x;
	data["y"] = y;
	data["lastx"] = x;
	data["lasty"] = y;
	data["anchored"] = anchored;
	return data;
}

function constrain(data) {
	var p1 = data["p1"];
	var p2 = data["p2"];
	var x1 = p1["x"];
	var y1 = p1["y"];
	var x2 = p2["x"];
	var y2 = p2["y"];
	var dx = (x2-x1);
	var dy = (y2-y1);
	var dis = Math.sqrt(dx*dx+dy*dy);
	
    /*var im1 = 1 / p1.mass;
    var im2 = 1 / p2.mass;*/
	var stiffness = data["stiffness"];
    var scalarP1 = /*(im1 / (im1 + im2))*/0.5 * stiffness;
    var scalarP2 = scalarP1/*stiffness - scalarP1*/;

	var dif = (data["restingDis"]-dis)/dis;
	/*var x3 = dif*dx/dis*0.5;
	var y3 = dif*dy/dis*0.5;*/
	var scalarP1 = scalarP1*dif;
	var scalarP2 = scalarP2*dif;
	if (p1.anchored || p2.anchored) {
		scalarP1 = scalarP1*2;
		scalarP2 = scalarP2*2;
		/*x3 = x3*2;
		y3 = y3*2;*/
	}
	if (!p1.anchored) {
		p1["x"] = x1 - dx * scalarP1;
		p1["y"] = y1 - dy * scalarP1;
		/*p1["x"] = x1-x3;
		p1["y"] = y1-y3;*/
		// Collisions with edges of screen
		if (p1["x"] > canvas.width-1) {
			p1["lastx"] = p1["x"];
			p1["x"] = canvas.width-1;
		}
		if (p1["x"] < 1) {
			p1["lastx"] = p1["x"];
			p1["x"] = 1;
		}
		if (p1["y"] > canvas.height-1) {
			p1["lasty"] = p1["y"];
			p1["y"] = canvas.height-1;
		}
		if (p1["y"] < 1) {
			p1["lasty"] = p1["y"];
			p1["y"] = 1;
		}
	}
	if (!p2.anchored) {
		p2["x"] = x2 + dx * scalarP2;
		p2["y"] = y2 + dy * scalarP2;
		/*p2["x"]= x2+x3;
		p2["y"] = y2+y3;*/
		// Collisions with edges of screen
		if (p2["x"] > canvas.width-1) {
			p2["lastx"] = p2["x"];
			p2["x"] = canvas.width-1;
		}
		if (p2["x"] < 1) {
			p2["lastx"] = p2["x"];
			p2["x"] = 1;
		}
		if (p2["y"] > canvas.height-1) {
			p2["lasty"] = p2["y"];
			p2["y"] = canvas.height-1;
		}
		if (p2["y"] < 1) {
			p2["lasty"] = p2["y"];
			p2["y"] = 1;
		}
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
		if (row==0) {//((col == 0 && row == 0) || (col == columns-1 && row == 0)) {
			anchored = true;
		}
		points[row*columns+col] = newpoint(300+col*distance,10+row*distance,anchored);
		if (col > 0) {
			links[links.length] = newlink(points[row*columns+col-1],points[row*columns+col],distance,1.5);
		}
		if (row > 0) {
			links[links.length] = newlink(points[(row-1)*columns+col],points[row*columns+col],distance,1.5);
		}
	}
}

var context = canvas.getContext("2d");

function render() {
	clearCanvas();
	for (var i=0;i<points.length;i++) {
		var row = Math.floor(i/columns);
		var col = i-row*columns;
		if (col < columns-1 && row < rows-1) {
			context.beginPath();
			context.moveTo(points[row*columns+col].x,points[row*columns+col].y);
			context.lineTo(points[row*columns+col+1].x,points[row*columns+col+1].y);
			context.lineTo(points[(row+1)*columns+col+1].x,points[(row+1)*columns+col+1].y);
			context.lineTo(points[(row+1)*columns+col].x,points[(row+1)*columns+col].y);
			context.closePath();
			context.fillStyle = "#0000FF";
			for (var i2=0;i2<dragging.length;i2++) {
				if (dragging[i2] == points[i]) {
					context.fillStyle = "#000000";
					break;
				}
			}
			context.lineWidth = linewidth;
			context.strokeStyle = "#000000";
			context.fill();
			context.stroke();
		}
	}
}

function render() {
	clearCanvas();
	var linksalive = [];
	for (var i=0;i<links.length;i++) {
		if (!links[i].broken) {
			var link = links[i];
			linksalive[link.p1.x + "," + link.p1.y + "," + link.p2.x + "," + link.p2.y] = true;
			/*context.beginPath();
			context.moveTo(links[i].p1.x,links[i].p1.y);
			context.lineTo(links[i].p2.x,links[i].p2.y);
			context.closePath();
			/*context.fillStyle = "#0000FF";
			for (var i2=0;i2<dragging.length;i2++) {
				if (dragging[i2][0] == points[i]) {
					context.fillStyle = "#000000";
					break;
				}
			}* /
			context.lineWidth = linewidth;
			context.strokeStyle = "#000000";
			//context.fill();
			context.stroke();*/
		}
	}
	for (var i=0;i<points.length;i++) {
		var point = points[i];
		/*context.beginPath();
		context.arc(point.x, point.y, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = "#000000";
		for (var i2=0;i2<dragging.length;i2++) {
			if (dragging[i2][0] == points[i]) {
				context.fillStyle = "#FF0000";
				break;
			}
		}
		context.fill(); */
		var row = Math.floor(i/columns);
		var col = i-row*columns;
		if (col < columns-1 && row < rows-1) {
			context.beginPath();
			context.fillStyle = "#9600FF";
			context.moveTo(point.x,point.y);
			var pre = point.x + "," + point.y + ",";
			var p1 = points[(row+1)*columns+col];
			var p2 = points[(row+1)*columns+col+1];
			var p3 = points[row*columns+col+1];
			if (linksalive[pre + p1.x + "," + p1.y]) {
				context.lineTo(p1.x,p1.y);
				if (linksalive[p1.x + "," + p1.y + "," + p2.x + "," + p2.y]) {
					context.lineTo(p2.x,p2.y);
				}
			}
			if (linksalive[pre + p3.x + "," + p3.y]) {
				if (linksalive[p3.x + "," + p3.y + "," + p2.x + "," + p2.y]) {
					context.lineTo(p2.x,p2.y);
				}
				context.lineTo(p3.x,p3.y);
			}
			context.lineTo(point.x,point.y);
			context.fill();
			context.lineWidth = linewidth;
			context.strokeStyle = "#000000";
			context.stroke();
		}
	}
	context.beginPath();
	context.rect(mx-5,my-5,10,10);
	context.fillStyle = 'yellow';
	context.fill();
	context.closePath();
}

var time = Date.now();
var lastdt = 0.015;
var mx = 50+columns*distance;
var my = 10;
var mousedown = false;
var dragging = [];

canvas.addEventListener('mousemove', function(evt) {
	mx = evt.clientX;
	my = evt.clientY;
}, false);

canvas.addEventListener('mousedown', function() {
	mousedown = true;
},false);

canvas.addEventListener('mouseup', function() {
	mousedown = false;
},false);

var lasttime = window.performance.now();

function loop(now) {
	var now = now || window.performance.now();
	var elapsedtime = now-lasttime;
	if (elapsedtime <= 0) {
		elapsedtime = 1;
	}
	var dt = elapsedtime/1000;
	lasttime = now;
	for (var i=0;i<points.length;i++) {
		update(points[i],dt,lastdt);
	}
	var length = links.length;
	for (var i=0;i<15;i++) {
		for (var i2=0;i2<length;i2++) {
			if (!links[i2].broken) {
				constrain(links[i2]);
			}
		}
	}
	for (var i=0;i<length;i++) {
		var link = links[i];
		var dx = (link.p1.x-link.p2.x);
		var dy = (link.p1.y-link.p2.y);
		if (Math.sqrt((dx*dx)+(dy*dy)) > link.restingDis*breakratio) {
			links[i].broken = true;
		}
	}
	lastdt = dt;
	render();
	if (mousedown) {
		if (dragging.length == 0) {
			dragging = [];
			for (var i=0;i<points.length;i++) {
				if (i >= columns) {
					var point = points[i];
					var x = point["x"];
					var y = point["y"];
					var dist = Math.sqrt((mx-x)*(mx-x)+(my-y)*(my-y));
					if (dist < 30) {
						dragging[dragging.length] = [point,mx-x,my-y];
					}
				}
			}
		} else {
			for (var i=0;i<dragging.length;i++) {
				dragging[i][0].x = mx-dragging[i][1];
				dragging[i][0].y = my-dragging[i][2];
			}
		}	
	} else {
		dragging = [];
	}
	window.requestAnimationFrame(loop);
}

loop();

