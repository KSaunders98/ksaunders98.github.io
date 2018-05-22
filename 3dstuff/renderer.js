"use strict";

var cos = Math.cos;
var sin = Math.sin;
var tan = Math.tan;
var pi = Math.PI;
var rad = pi/180;
var sqrt = Math.sqrt;
var ceil = Math.ceil;
var abs = Math.abs;

class Matrix4 {
	constructor(a) {
		if (typeof a == "number") {
			this.values = [];
			for (var i=0; i<4; i++) {
				var ar = [];
				this.values[i] = ar;
				for (var i2=0; i2<4; i2++) {
					ar[i2] = arguments[i*4+i2];
				}
			}
		} else if (a.constructor.name == "Vector4") {
			this.values = [[1,0,0,a.x],
							 [0,1,0,a.y],
							 [0,0,1,a.z],
							 [0,0,0,1]];
		}
	}
	getcomponent(row,column) {
		return this.values[row][column];
	}
	get inv() {
		var a11 = this.values[0][0];
		var a12 = this.values[0][1];
		var a13 = this.values[0][2];
		var a14 = this.values[0][3];
		var a21 = this.values[1][0];
		var a22 = this.values[1][1];
		var a23 = this.values[1][2];
		var a24 = this.values[1][3];
		var a31 = this.values[2][0];
		var a32 = this.values[2][1];
		var a33 = this.values[2][2];
		var a34 = this.values[2][3];
		var a41 = this.values[3][0];
		var a42 = this.values[3][1];
		var a43 = this.values[3][2];
		var a44 = this.values[3][3];

		var det = -a13 * a22 * a31 + a12 * a23 * a31
					 + a13 * a21 * a32 - a11 * a23 * a32
					 - a12 * a21 * a33 + a11 * a22 * a33;
			var k = 1/det;
			
			var b11 = (a22 * a33 - a32 * a23) * k;
			var b12 = (a32 * a13 - a12 * a33) * k;
			var b13 = (a12 * a23 - a22 * a13) * k;
			var b21 = (a23 * a31 - a33 * a21) * k;
			var b22 = (a33 * a11 - a13 * a31) * k;
			var b23 = (a13 * a21 - a23 * a11) * k;
			var b31 = (a21 * a32 - a31 * a22) * k;
			var b32 = (a31 * a12 - a11 * a32) * k;
			var b33 = (a11 * a22 - a21 * a12) * k;

			var b14 = -(b11 * a14 + b12 * a24 + b13 * a34);
			var b24 = -(b21 * a14 + b22 * a24 + b23 * a34);
			var b34 = -(b31 * a14 + b32 * a24 + b33 * a34);

			var b41 = a41;
			var b42 = a42;
			var b43 = a43;
			var b44 = a44;
			return new Matrix4(b11,b12,b13,b14,b21,b22,b23,b24,b31,b32,b33,b34,b41,b42,b43,b44);
	}
	mul(b) {
		if (b.constructor.name == "Matrix4") {
			var a11 = this.values[0][0];
			var a12 = this.values[0][1];
			var a13 = this.values[0][2];
			var a14 = this.values[0][3];
			var a21 = this.values[1][0];
			var a22 = this.values[1][1];
			var a23 = this.values[1][2];
			var a24 = this.values[1][3];
			var a31 = this.values[2][0];
			var a32 = this.values[2][1];
			var a33 = this.values[2][2];
			var a34 = this.values[2][3];
			var a41 = this.values[3][0];
			var a42 = this.values[3][1];
			var a43 = this.values[3][2];
			var a44 = this.values[3][3];

			var b11 = b.getcomponent(0,0);
			var b12 = b.getcomponent(0,1);
			var b13 = b.getcomponent(0,2);
			var b14 = b.getcomponent(0,3);
			var b21 = b.getcomponent(1,0);
			var b22 = b.getcomponent(1,1);
			var b23 = b.getcomponent(1,2);
			var b24 = b.getcomponent(1,3);
			var b31 = b.getcomponent(2,0);
			var b32 = b.getcomponent(2,1);
			var b33 = b.getcomponent(2,2);
			var b34 = b.getcomponent(2,3);
			var b41 = b.getcomponent(3,0);
			var b42 = b.getcomponent(3,1);
			var b43 = b.getcomponent(3,2);
			var b44 = b.getcomponent(3,3);

			var c11 = a11*b11+a12*b21+a13*b31+a14*b41;
			var c12 = a11*b12+a12*b22+a13*b32+a14*b42;
			var c13 = a11*b13+a12*b23+a13*b33+a14*b43;
			var c14 = a11*b14+a12*b24+a13*b34+a14*b44;
			var c21 = a21*b11+a22*b21+a23*b31+a24*b41;
			var c22 = a21*b12+a22*b22+a23*b32+a24*b42;
			var c23 = a21*b13+a22*b23+a23*b33+a24*b43;
			var c24 = a21*b14+a22*b24+a23*b34+a24*b44;
			var c31 = a31*b11+a32*b21+a33*b31+a34*b41;
			var c32 = a31*b12+a32*b22+a33*b32+a34*b42;
			var c33 = a31*b13+a32*b23+a33*b33+a34*b43;
			var c34 = a31*b14+a32*b24+a33*b34+a34*b44;
			var c41 = a41*b11+a42*b21+a43*b31+a44*b41;
			var c42 = a41*b12+a42*b22+a43*b32+a44*b42;
			var c43 = a41*b13+a42*b23+a43*b33+a44*b43;
			var c44 = a41*b14+a42*b24+a43*b34+a44*b44;

			return new Matrix4(c11,c12,c13,c14,c21,c22,c23,c24,c31,c32,c33,c34,c41,c42,c43,c44);
		} else if (b.constructor.name == "Vector4") {
			var a11 = this.values[0][0];
			var a12 = this.values[0][1];
			var a13 = this.values[0][2];
			var a14 = this.values[0][3];
			var a21 = this.values[1][0];
			var a22 = this.values[1][1];
			var a23 = this.values[1][2];
			var a24 = this.values[1][3];
			var a31 = this.values[2][0];
			var a32 = this.values[2][1];
			var a33 = this.values[2][2];
			var a34 = this.values[2][3];
			var a41 = this.values[3][0];
			var a42 = this.values[3][1];
			var a43 = this.values[3][2];
			var a44 = this.values[3][3];

			var b11 = b.x;
			var b21 = b.y;
			var b31 = b.z;
			var b41 = b.w;

			var c11 = a11*b11+a12*b21+a13*b31+a14*b41;
			var c21 = a21*b11+a22*b21+a23*b31+a24*b41;
			var c31 = a31*b11+a32*b21+a33*b31+a34*b41;
			var c41 = a41*b11+a42*b21+a43*b31+a44*b41;
			return new Vector4(c11,c21,c31,c41);
		}
	}
	add(b) {
		if (b.constructor.name == "Vector4") {
			return new Matrix4(this.values[0][0],this.values[0][1],this.values[0][2],this.values[0][3]+b.x,this.values[1][0],this.values[1][1],this.values[1][2],this.values[1][3]+b.y,this.values[2][0],this.values[2][1],this.values[2][2],this.values[2][3]+b.z,this.values[3][0],this.values[3][1],this.values[3][2],this.values[3][3]);
		}
	}
	sub(b) {
		if (b.constructor.name == "Vector4") {
			return new Matrix4(this.values[0][0],this.values[0][1],this.values[0][2],this.values[0][3]-b.x,this.values[1][0],this.values[1][1],this.values[1][2],this.values[1][3]-b.y,this.values[2][0],this.values[2][1],this.values[2][2],this.values[2][3]-b.z,this.values[3][0],this.values[3][1],this.values[3][2],this.values[3][3]);
		}
	}
	get lookVector() {
		return new Vector4(this.values[0][2],this.values[1][2],this.values[2][2]);
	}
	get position() {
		return new Vector4(this.values[0][3],this.values[1][3],this.values[2][3]);
	}
	get rotation() {
		return this.sub(this.position);
	}
	static fromEuler(x,y,z) {
		return new Matrix4(cos(y)*cos(z),-sin(z)*cos(y),sin(y),0,
							 cos(z)*sin(y)*sin(x)+sin(z)*cos(x), cos(z)*cos(x)-sin(z)*sin(y)*sin(x), -cos(y)*sin(x),0,
							 sin(z)*sin(x)-cos(z)*sin(y)*cos(x), sin(z)*sin(y)*cos(x)+cos(z)*sin(x), cos(y)*cos(x),0,
							 0,0,0,1);
	}
	static projection(fov,aspectRatio,near,far) {
		var tanHalfFOV = tan(fov/2);
		var range = far-near;

		/*return new Matrix4(1/(tanHalfFOV*aspectRatio),0,0,0,
							 0,1/tanHalfFOV,0,0,
							 0,0,(far+near)/range,1,
							 0,0,2*far*near/range,0);*/

		return new Matrix4(1/(tanHalfFOV*aspectRatio),0,0,0,
							 0,1/tanHalfFOV,0,0,
							 0,0,(near+far)/range,-2*far*near/range,
							 0,0,1,0);
	}
}

class Vector4 {
	constructor(x,y,z,w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w || 1;
	}
	mul(b) {
		if (b.constructor.name == "Vector4") {
			return new Vector4(this.x*b.x,this.y*b.y,this.z*b.z);
		} else if (typeof b == "number") {
			return new Vector4(this.x*b,this.y*b,this.z*b);
		}
	}
	div(b) {
		if (b.constructor.name == "Vector4") {
			return new Vector4(this.x/b.x,this.y/b.y,this.z/b.z);
		} else if (typeof b == "number") {
			return new Vector4(this.x/b,this.y/b,this.z/b);
		}
	}
	add(b) {
		if (b.constructor.name == "Vector4") {
			return new Vector4(this.x+b.x,this.y+b.y,this.z+b.z);
		}
	}
	sub(b) {
		if (b.constructor.name == "Vector4") {
			return new Vector4(this.x-b.x,this.y-b.y,this.z-b.z);
		}
	}
	dot(b) {
		if (b.constructor.name == "Vector4") {
			return this.x*b.x + this.y*b.y + this.z*b.z;
		}
	}
	cross(b) {
		if (b.constructor.name == "Vector4") {
			var x = this.y*b.z - this.z*b.y;
			var y = this.z*b.x - this.x*b.z;
			var z = this.x*b.y - this.y*b.x;
			return new Vector4(x,y,z);
		}
	}
	get magnitude() {
		return sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	}
	get unit() {
		var mag = this.magnitude;
		return new Vector4(this.x/mag,this.y/mag,this.z/mag);
	}
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

class Color {
	constructor(r,g,b) {
		this.r = ceil(r);
		this.g = ceil(g);
		this.b = ceil(b);
	}
	mul(a) {
		return new Color(this.r*a,this.g*a,this.b*a);
	}
	tohex() {
		return rgbToHex(this.r,this.g,this.b);
	}
}

class Face {
	constructor(vertices,color,transparency,outlines,normal,useculling) {
		this.numvertices = vertices.length;
		this.vertices = vertices;
		this.color = color;
		this.transparency = transparency;
		this.outlines = typeof outlines != "undefined" ? outlines : true;
		this.normal = normal;
		this.useculling = typeof useculling != "undefined" ? useculling : true;
	}
}

class Part {
	constructor(size,cframe,color,transparency) {
		this.size = size;
		this.cframe = cframe;
		this.color = color || new Color(0,0,0);
		this.transparency = transparency || 0;
		var vertex0 = cframe.mul(new Vector4(-0.5,-0.5,-0.5).mul(size));
		var vertex1 = cframe.mul(new Vector4(0.5,-0.5,-0.5).mul(size));
		var vertex2 = cframe.mul(new Vector4(0.5,0.5,-0.5).mul(size));
		var vertex3 = cframe.mul(new Vector4(-0.5,0.5,-0.5).mul(size));
		var vertex4 = cframe.mul(new Vector4(-0.5,-0.5,0.5).mul(size));
		var vertex5 = cframe.mul(new Vector4(0.5,-0.5,0.5).mul(size));
		var vertex6 = cframe.mul(new Vector4(0.5,0.5,0.5).mul(size));
		var vertex7 = cframe.mul(new Vector4(-0.5,0.5,0.5).mul(size));
		var faces = [];
		faces[0] = new Face([vertex0,vertex1,vertex2,vertex3],color,transparency);
		faces[1] = new Face([vertex0,vertex4,vertex5,vertex1],color,transparency);
		faces[2] = new Face([vertex0,vertex3,vertex7,vertex4],color,transparency);
		faces[3] = new Face([vertex1,vertex5,vertex6,vertex2],color,transparency);
		faces[4] = new Face([vertex5,vertex4,vertex7,vertex6],color,transparency);
		faces[5] = new Face([vertex2,vertex6,vertex7,vertex3],color,transparency);
		this.faces = faces;
	}
	getsize() {
		return this.size;
	}
	setsize(size) {
		this.size = size;
		var cframe = this.cframe;
		var vertex0 = cframe.mul(new Vector4(-0.5,-0.5,-0.5).mul(size));
		var vertex1 = cframe.mul(new Vector4(0.5,-0.5,-0.5).mul(size));
		var vertex2 = cframe.mul(new Vector4(0.5,0.5,-0.5).mul(size));
		var vertex3 = cframe.mul(new Vector4(-0.5,0.5,-0.5).mul(size));
		var vertex4 = cframe.mul(new Vector4(-0.5,-0.5,0.5).mul(size));
		var vertex5 = cframe.mul(new Vector4(0.5,-0.5,0.5).mul(size));
		var vertex6 = cframe.mul(new Vector4(0.5,0.5,0.5).mul(size));
		var vertex7 = cframe.mul(new Vector4(-0.5,0.5,0.5).mul(size));
		var faces = this.faces;
		var color = this.color;
		var transparency = this.transparency;
		faces[0] = new Face([vertex0,vertex1,vertex2,vertex3],color,transparency);
		faces[1] = new Face([vertex0,vertex4,vertex5,vertex1],color,transparency);
		faces[2] = new Face([vertex0,vertex3,vertex7,vertex4],color,transparency);
		faces[3] = new Face([vertex1,vertex5,vertex6,vertex2],color,transparency);
		faces[4] = new Face([vertex5,vertex4,vertex7,vertex6],color,transparency);
		faces[5] = new Face([vertex2,vertex6,vertex7,vertex3],color,transparency);
	}
	getcframe() {
		return this.cframe;
	}
	setcframe(cframe) {
		this.cframe = cframe;
		var size = this.size;
		var vertex0 = cframe.mul(new Vector4(-0.5,-0.5,-0.5).mul(size));
		var vertex1 = cframe.mul(new Vector4(0.5,-0.5,-0.5).mul(size));
		var vertex2 = cframe.mul(new Vector4(0.5,0.5,-0.5).mul(size));
		var vertex3 = cframe.mul(new Vector4(-0.5,0.5,-0.5).mul(size));
		var vertex4 = cframe.mul(new Vector4(-0.5,-0.5,0.5).mul(size));
		var vertex5 = cframe.mul(new Vector4(0.5,-0.5,0.5).mul(size));
		var vertex6 = cframe.mul(new Vector4(0.5,0.5,0.5).mul(size));
		var vertex7 = cframe.mul(new Vector4(-0.5,0.5,0.5).mul(size));
		var faces = this.faces;
		var color = this.color;
		var transparency = this.transparency;
		faces[0] = new Face([vertex0,vertex1,vertex2,vertex3],color,transparency);
		faces[1] = new Face([vertex0,vertex4,vertex5,vertex1],color,transparency);
		faces[2] = new Face([vertex0,vertex3,vertex7,vertex4],color,transparency);
		faces[3] = new Face([vertex1,vertex5,vertex6,vertex2],color,transparency);
		faces[4] = new Face([vertex5,vertex4,vertex7,vertex6],color,transparency);
		faces[5] = new Face([vertex2,vertex6,vertex7,vertex3],color,transparency);
	}
	getfaces() {
		return this.faces;
	}
	getcolor() {
		return this.color;
	}
	setcolor(color) {
		this.color = color;
		var faces = this.faces;
		faces[0].color = color;
		faces[1].color = color;
		faces[2].color = color;
		faces[3].color = color;
		faces[4].color = color;
		faces[5].color = color;
	}
	gettransparency() {
		return this.transparency;
	}
	settransparency(transparency) {
		this.transparency = transparency;
		faces[0].transparency = transparency;
		faces[1].transparency = transparency;
		faces[2].transparency = transparency;
		faces[3].transparency = transparency;
		faces[4].transparency = transparency;
		faces[5].transparency = transparency;
	}
}

class Mesh {
	constructor(meshurl,size,cframe,color,transparency,outlines,usenormals) {
		this.meshurl = meshurl;
		this.size = size;
		this.cframe = cframe;
		this.vertices = [];
		this.normals = [];
		this.faceindices = [];
		this.normalindices = [];
		this.faces = [];
		this.color = color || new Color(0,0,0);
		this.transparency = transparency || 0;
		this.loaded = false;
		this.outlines = typeof outlines != "undefined" ? outlines : true;
		this.usenormals = typeof usenormals != "undefined" ? usenormals : true;
		var self = this;

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				var a = xmlHttp.responseText.split("\n");
				var vcount = 0;
				var ncount = 0;
				var ficount = 0;
				var l = a.length;
				for (var i=0; i<l; i++) {
					var a2 = a[i].split(" ");
					switch (a2[0]) {
						case "v":
							self.vertices[vcount] = new Vector4(Number(a2[1]),Number(a2[2]),-Number(a2[3]));
							vcount = vcount+1;
						break;

						case "vn":
							if (self.usenormals) {
								self.normals[ncount] = new Vector4(-Number(a2[1]),-Number(a2[2]),Number(a2[3]));
								ncount = ncount+1;
							}
						break;

						case "f":
							var a3 = [];
							var normal;
							var l2 = a2.length;
							for (var i2=1; i2<l2; i2++) {
								var data = /(\d+)\/?(\d*)\/?(\d*)/g.exec(a2[i2]);
								a3[i2-1] = Number(data[1])-1;
								if (data[3] != "") {
									normal = Number(data[3])-1;
								}
							}
							self.faceindices[ficount] = a3;
							self.normalindices[ficount] = normal;
							ficount = ficount+1;
						break;
					}
				}
				var minx,miny,minz,maxx,maxy,maxz;
				var l = self.vertices.length;
				for (var i=0; i<l; i++) {
					var v = self.vertices[i];
					if (typeof minx == "undefined" || v.x < minx) {
						minx = v.x;
					}
					if (typeof miny == "undefined" || v.y < miny) {
						miny = v.y;
					}
					if (typeof minz == "undefined" || v.z < minz) {
						minz = v.z;
					}
					if (typeof maxx == "undefined" || v.x > maxx) {
						maxx = v.x;
					}
					if (typeof maxy == "undefined" || v.y > maxy) {
						maxy = v.y;
					}
					if (typeof maxz == "undefined" || v.z > maxz) {
						maxz = v.z;
					}
				}
				var center = new Vector4((minx+maxx)*0.5,(miny+maxy)*0.5,(minz+maxz)*0.5);
				var extents = Math.max(maxx-minx,maxy-miny,maxz-minz);
				for (var i=0; i<l; i++) {
					self.vertices[i] = self.vertices[i].sub(center).div(extents);
				}
				var l = self.faceindices.length;
				for (var i=0; i<l; i++) {
					var a = [];
					var indices = self.faceindices[i];
					var l2 = indices.length;
					for (var i2=0; i2<l2; i2++) {
						var index = indices[i2]
						a[i2] = self.cframe.mul(self.vertices[index].mul(self.size));
					}
					self.faces[i] = new Face(a,self.color,self.transparency,self.outlines,self.usenormals ? self.cframe.rotation.mul(self.normals[self.normalindices[i]].div(self.size)).unit : undefined);
				}
				self.loaded = true;
			}
		}
		xmlHttp.open("GET", meshurl, true);
		xmlHttp.send(null);
	}
	getMeshUrl() {
		return this.meshurl;
	}
	setMeshUrl(meshurl) {
		this.loaded = false;
		this.meshurl = meshurl;
		this.vertices = [];
		this.normals = [];
		this.faceindices = [];
		this.normalindices = [];
		this.faces = [];
		var self = this;

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				var a = xmlHttp.responseText.split("\n");
				var vcount = 0;
				var ncount = 0;
				var ficount = 0;
				var l = a.length;
				for (var i=0; i<l; i++) {
					var a2 = a[i].split(" ");
					switch (a2[0]) {
						case "v":
							self.vertices[vcount] = new Vector4(Number(a2[1]),Number(a2[2]),-Number(a2[3]));
							vcount = vcount+1;
						break;

						case "vn":
							if (self.usenormals) {
								self.normals[ncount] = new Vector4(-Number(a2[1]),-Number(a2[2]),Number(a2[3]));
								ncount = ncount+1;
							}
						break;

						case "f":
							var a3 = [];
							var normal;
							var l2 = a2.length;
							for (var i2=1; i2<l2; i2++) {
								var data = /(\d+)\/?(\d*)\/?(\d*)/g.exec(a2[i2]);
								a3[i2-1] = Number(data[1])-1;
								if (data[3] != "") {
									normal = Number(data[3])-1;
								}
							}
							self.faceindices[ficount] = a3;
							self.normalindices[ficount] = normal;
							ficount = ficount+1;
						break;
					}
				}
				var minx,miny,minz,maxx,maxy,maxz;
				var l = self.vertices.length;
				for (var i=0; i<l; i++) {
					var v = self.vertices[i];
					if (typeof minx == "undefined" || v.x < minx) {
						minx = v.x;
					}
					if (typeof miny == "undefined" || v.y < miny) {
						miny = v.y;
					}
					if (typeof minz == "undefined" || v.z < minz) {
						minz = v.z;
					}
					if (typeof maxx == "undefined" || v.x > maxx) {
						maxx = v.x;
					}
					if (typeof maxy == "undefined" || v.y > maxy) {
						maxy = v.y;
					}
					if (typeof maxz == "undefined" || v.z > maxz) {
						maxz = v.z;
					}
				}
				var center = new Vector4((minx+maxx)*0.5,(miny+maxy)*0.5,(minz+maxz)*0.5);
				var extents = Math.max(maxx-minx,maxy-miny,maxz-minz);
				for (var i=0; i<l; i++) {
					self.vertices[i] = self.vertices[i].sub(center).div(extents);
				}
				var l = self.faceindices.length;
				for (var i=0; i<l; i++) {
					var a = [];
					var indices = self.faceindices[i];
					var l2 = indices.length;
					for (var i2=0; i2<l2; i2++) {
						var index = indices[i2]
						a[i2] = self.cframe.mul(self.vertices[index].mul(self.size));
					}
					self.faces[i] = new Face(a,self.color,self.transparency,self.outlines,self.usenormals ? self.cframe.rotation.mul(self.normals[self.normalindices[i]].div(self.size)).unit : undefined);
				}
				self.loaded = true;
			}
		}
		xmlHttp.open("GET", meshurl, true);
		xmlHttp.send(null);
	}
	isLoaded() {
		return this.loaded;
	}
	getfaces() {
		return this.faces;
	}
	getsize() {
		return this.size;
	}
	setsize(size) {
		this.size = size;
		var l = this.faceindices.length;
		for (var i=0; i<l; i++) {
			var a = [];
			var indices = this.faceindices[i];
			var l2 = indices.length;
			for (var i2=0; i2<l2; i2++) {
				var index = indices[i2];
				a[i2] = this.cframe.mul(this.vertices[index].mul(this.size));
			}
			this.faces[i] = new Face(a,this.color,this.transparency,this.outlines,self.usenormals ? this.cframe.rotation.mul(this.normals[this.normalindices[i]].div(this.size)).unit : undefined);
		}
	}
	getcframe() {
		return this.cframe;
	}
	setcframe(cframe) {
		this.cframe = cframe;
		var l = this.faceindices.length;
		for (var i=0; i<l; i++) {
			var a = [];
			var indices = this.faceindices[i];
			var l2 = indices.length;
			for (var i2=0; i2<l2; i2++) {
				var index = indices[i2];
				a[i2] = this.cframe.mul(this.vertices[index].mul(this.size));
			}
			this.faces[i] = new Face(a,this.color,this.transparency,this.outlines,self.usenormals ? this.cframe.rotation.mul(this.normals[this.normalindices[i]].div(this.size)).unit : undefined);
		}
	}
	getcolor() {
		return this.color;
	}
	setcolor(color) {
		this.color = color;
		for (var i=0; i<this.faces.length; i++) {
			this.faces[i].color = color;
		}
	}
	gettransparency() {
		return this.transparency;
	}
	settransparency(transparency) {
		this.transparency = transparency;
		for (var i=0; i<this.faces.length; i++) {
			this.faces[i].transparency = transparency;
		}
	}
}

class Camera {
	constructor() {
		this.cframe = new Matrix4(1,0,0,0,
									0,1,0,0,
									0,0,1,0,
									0,0,0,1);
		this.fov = 70;
		this.near = 0.1;
		this.far = 1000;
	}
}

class RenderContext {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.camera = new Camera();
		this.objects = [];
		this.faces = [];
	}
	render(faceslast) {
		var canvas = this.canvas;
		var context = this.context;
		var width = canvas.width;
		var height = canvas.height;
		var camera = this.camera;
		var con = this.canvas;
		var caminverse = camera.inv;
		var objects = this.objects
		var proj = Matrix4.projection(camera.fov*rad,width/height,camera.near,camera.far);

		var pos = camera.cframe.position;
		var caminverse = camera.cframe.inv;

		var faces = [];
		var faces2 = [];
		var campos = camera.cframe.position;
		var ldir = lightDir;
		var halfwidth = 0.5*width;
		var halfheight = 0.5*height;

		var l = this.faces.length;
		var container;
		if (faceslast) {
			container = faces2;
		} else {
			container = faces;
		}
		for (var i=0; i<l; i++) {
			var face = this.faces[i];
			var color = face.color;
			var ar = [];
			var vertices = face.vertices;
			var normal = (vertices[1].sub(vertices[0])).cross(vertices[2].sub(vertices[0])).unit;
			if (face.useculling == false || vertices[0].sub(campos).dot(normal) >= 0) {
				//var w = 0;
				var w;
				var ar2 = [];
				var render = false;
				var cx = 0;
				var cy = 0;
				for (var i2=0; i2<face.numvertices; i2++) {
					var v = caminverse.mul(vertices[i2]);
					if (v.z > 0) {
						render = true;
					}
					//w = w+v.magnitude;
					w = i2 == 0 ? v : w.add(v);
					if (v.z < 0.001) {
						v.z = 0.001;
					}
					v = proj.mul(v);
					v = v.div(v.w);
					var x = (v.x+1)*halfwidth;
					var y = (-v.y+1)*halfheight;
					cx = cx+x;
					cy = cy+y;
					ar2[i2] = [x,y];
				}
				if (render) {
					ar[0] = ar2;
					ar[1] = w.div(face.numvertices).magnitude; //w/face.numvertices;
					ar[2] = face.color;
					ar[3] = face.transparency;
					ar[4] = true;
					ar[5] = (ldir.dot(normal)+1)*0.5;
					ar[6] = cx/face.numvertices;
					ar[7] = cy/face.numvertices;
					container[container.length] = ar;
				}
			}
		}
		var l = objects.length;
		for (var i=0; i<l; i++) {
			var obj = objects[i];
			if ((obj.constructor.name == "Mesh" && obj.isLoaded()) || obj.constructor.name == "Part") {
				var boxfaces = obj.getfaces();
				var l2 = boxfaces.length;
				for (var i2=0; i2<l2; i2++) {
					var ar = [];
					var face = boxfaces[i2];
					var vertices = face.vertices;
					var normal = face.normal;
					if (typeof normal == "undefined") {
						 normal = (vertices[1].sub(vertices[0])).cross(vertices[2].sub(vertices[0])).unit;
						 face.normal = normal;
					}
					if (face.useculling == false || vertices[0].sub(campos).dot(normal) >= 0) {
						//var w = 0;
						var w;
						var ar2 = [];
						var render = false;
						var cx = 0;
						var cy = 0;
						for (var i3=0; i3<face.numvertices; i3++) {
							var v = caminverse.mul(vertices[i3]);
							if (v.z > 0) {
								render = true;
							}
							//w = w+v.magnitude;
							w = i3 == 0 ? v : w.add(v);
							if (v.z < 0.001) {
								v.z = 0.001;
							}
							v = proj.mul(v);
							v = v.div(v.w);
							var x = (v.x+1)*halfwidth;
							var y = (-v.y+1)*halfheight;
							cx = cx+x;
							cy = cy+y;
							ar2[i3] = [x,y];
						}
						if (render) {
							ar[0] = ar2;
							ar[1] = w.div(face.numvertices).magnitude; //w/face.numvertices;
							ar[2] = face.color;
							ar[3] = face.transparency;
							ar[4] = face.outlines;
							ar[5] = (ldir.dot(normal)+1)*0.5;
							ar[6] = cx/face.numvertices;
							ar[7] = cy/face.numvertices;
							faces[faces.length] = ar;
						}
					}
				}
			}
		}
		faces.sort(function(a,b) { return b[1]-a[1]; });
		if (faceslast) {
			faces2.sort(function(a,b) { return b[1]-a[1]; });
		}

		facecount = 0
		context.miterLimit = 0;
		var alpha = context.globalAlpha
		var lineWidth = context.lineWidth;
		var l = faces.length;
		for (var i=0; i<l; i++) {
			var face = faces[i];
			var vertices = face[0];
			facecount = facecount+1;
			var dot = face[5];
			context.beginPath();
			var a = 1-face[3]
			if (alpha != a) {
				context.globalAlpha = a;
				alpha = a;
			}
			/*"var cx = face[6];
			var cy = face[7];*/
			var l2 = vertices.length;
			for (var i2=0; i2<l2; i2++) {
				var v = vertices[i2];
				/*var dx = v[0]-cx;
				var dy = v[1]-cy;
				var m = sqrt(dx*dx+dy*dy);
				var dx2 = dx/m;
				var dy2 = dy/m;
				if (i2 == 0) {
					context.moveTo(cx+dx+dx2,cy+dy+dy2);
				} else {
					context.lineTo(cx+dx+dx2,cy+dy+dy2);
				}*/
				if (i2 == 0) {
					context.moveTo(v[0],v[1]);
				} else {
					context.lineTo(v[0],v[1]);
				}
			}
			context.closePath();
			var color = face[2].mul(dot);
			color = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
			context.fillStyle = color;
			context.fill();
			if (face[4]) {
				var a = 0.25/face[1];
				context.lineWidth = a;
				lineWidth = a;
				context.strokeStyle = "black";
				context.stroke();
			} else {
				if (lineWidth != 1) {
					context.lineWidth = 1;
					lineWidth = 1;
				}
				context.strokeStyle = color;
				context.stroke();
			}
		}

		var l = faces2.length;
		for (var i=0; i<l; i++) {
			var face = faces2[i];
			var vertices = face[0];
			facecount = facecount+1;
			var dot = face[5];
			context.beginPath();
			var a = 1-face[3]
			if (alpha != a) {
				context.globalAlpha = a;
				alpha = a;
			}
			/*"var cx = face[6];
			var cy = face[7];*/
			var l2 = vertices.length;
			for (var i2=0; i2<l2; i2++) {
				var v = vertices[i2];
				/*var dx = v[0]-cx;
				var dy = v[1]-cy;
				var m = sqrt(dx*dx+dy*dy);
				var dx2 = dx/m;
				var dy2 = dy/m;
				if (i2 == 0) {
					context.moveTo(cx+dx+dx2,cy+dy+dy2);
				} else {
					context.lineTo(cx+dx+dx2,cy+dy+dy2);
				}*/
				if (i2 == 0) {
					context.moveTo(v[0],v[1]);
				} else {
					context.lineTo(v[0],v[1]);
				}
			}
			context.closePath();
			var color = face[2].mul(dot);
			color = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
			context.fillStyle = color;
			context.fill();
			if (face[4]) {
				var a = 0.25/face[1];
				context.lineWidth = a;
				lineWidth = a;
				context.strokeStyle = "black";
				context.stroke();
			} else {
				if (lineWidth != 1) {
					context.lineWidth = 1;
					lineWidth = 1;
				}
				context.strokeStyle = color;
				context.stroke();
			}
		}
	}
	addobject(obj) {
		this.objects[this.objects.length] = obj;
	}
	addface(face) {
		this.faces[this.faces.length] = face;
	}
	removeobject(obj) {
		for (var i=0; i<this.objects.length; i++) {
			if (this.objects[i] == obj) {
				this.objects.splice(i, 1);
				break;
			}
		}
	}
	removeface(face) {
		for (var i=0; i<this.faces.length; i++) {
			if (this.faces[i] == face) {
				this.faces.splice(i, 1);
				break;
			}
		}
	}
	clearfaces() {
		this.faces = [];
	}
}
