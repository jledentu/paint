// Copyright (c) 2014 Jérémie Ledentu

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

'use strict';

/**
 * Constructor.
 * 
 * @param {Canvas} canvas
 * @param {Canvas} tmpCanvas
 */
function Eraser(canvas, tmpCanvas)
{
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.tmpCanvas = tmpCanvas;
	this.tmpCtx = this.tmpCanvas.getContext('2d');

	this.mouseDown = false;
	this.lastPosition = null;
	this.lineWidth = 20;
};

Eraser.prototype = new Tool();
Eraser.prototype.constructor = Eraser;

/**
 * Erases.
 * @param  {[type]} x
 * @param  {[type]} y
 * @return {[type]}
 */
Eraser.prototype.erase = function(x, y)
{
	this.context.globalCompositeOperation = 'destination-out';
	this.context.beginPath();

	if (this.pts && this.pts.length >= 3)
	{
		this.context.moveTo(this.pts[0].x, this.pts[0].y);

		for (var i = 1; i < this.pts.length - 2; ++i)
		{
			var c = (this.pts[i].x + this.pts[i + 1].x) / 2;
			var d = (this.pts[i].y + this.pts[i + 1].y) / 2;

			this.context.quadraticCurveTo(this.pts[i].x, this.pts[i].y, c, d);
		}

		this.context.quadraticCurveTo(
			this.pts[i].x,
			this.pts[i].y,
			this.pts[i + 1].x,
			this.pts[i + 1].y
		);

		this.context.stroke();
	}
	else {
		this.context.beginPath();
		this.context.moveTo(x,y);
		this.context.arc(x, y, this.lineWidth / 2, 0, 2 * Math.PI);
		this.context.fill();
	}
};

Eraser.prototype.down = function(x, y) {
	this.mouseDown = true;
	
	this.pts = [];
	this.pts.push({x: x, y: y});

	this.erase(x, y);
};

Eraser.prototype.move = function(x, y) {

	if (this.mouseDown)
	{
		this.pts.push({x: x, y: y});
		this.erase(x, y);
	}
};

Eraser.prototype.up = function(x, y) {
	this.mouseDown = false;
	this.lastPosition = null;

	this.pts = [];

	this.context.drawImage(this.tmpCanvas, 0, 0);
	this.tmpCtx.clearRect(0, 0, this.tmpCanvas.width, this.tmpCanvas.height);
};

Eraser.prototype.click = function(x, y) {

};

Eraser.prototype.onSelect = function() {
	this.tmpCanvas.style.cursor = 'crosshair';

	this.context.lineWidth = this.lineWidth;
	this.context.lineCap = 'round';
	this.context.lineJoin = 'round';

	// Canvas context parameters
	this.context.fillStyle = 'red';
	this.context.strokeStyle = 'red';
};