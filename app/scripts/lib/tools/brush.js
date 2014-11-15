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
 * @param {Object} colorSet
 */
function Brush(canvas, tmpCanvas, colorSet)
{
	this.colorSet = colorSet;
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.tmpCanvas = tmpCanvas;
	this.tmpCtx = this.tmpCanvas.getContext('2d');

	this.mouseDown = false;
	this.lastPosition = null;
	this.lineWidth = 20;
};

Brush.prototype = new Tool();
Brush.prototype.constructor = Brush;

/**
 * Applies brush.
 */
Brush.prototype.brush = function(x, y)
{
	this.context.globalCompositeOperation = 'source-over';
	this.tmpCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.tmpCtx.beginPath();

	if (this.pts && this.pts.length >= 3)
	{
		this.tmpCtx.moveTo(this.pts[0].x, this.pts[0].y);

		for (var i = 1; i < this.pts.length - 2; ++i)
		{
			var c = (this.pts[i].x + this.pts[i + 1].x) / 2;
			var d = (this.pts[i].y + this.pts[i + 1].y) / 2;

			this.tmpCtx.quadraticCurveTo(this.pts[i].x, this.pts[i].y, c, d);
		}

		this.tmpCtx.quadraticCurveTo(
			this.pts[i].x,
			this.pts[i].y,
			this.pts[i+1].x,
			this.pts[i+1].y
		);

		this.tmpCtx.stroke();
	}
	else {
		this.tmpCtx.beginPath();
		this.tmpCtx.moveTo(x,y);
		this.tmpCtx.arc(x, y, this.lineWidth / 2, 0, 2 * Math.PI);
		this.tmpCtx.fill();
	}
};

Brush.prototype.down = function(x, y) {
	this.mouseDown = true;
	
	this.pts = [];
	this.pts.push({x: x, y: y});

	this.brush(x, y);
};

Brush.prototype.move = function(x, y) {

	if (this.mouseDown)
	{
		this.pts.push({x: x, y: y});
		this.brush(x, y);
	}
};

Brush.prototype.up = function(x, y) {
	this.mouseDown = false;
	this.lastPosition = null;

	this.pts = [];

	this.context.drawImage(this.tmpCanvas, 0, 0);
	this.tmpCtx.clearRect(0, 0, this.tmpCanvas.width, this.tmpCanvas.height);
};

Brush.prototype.click = function(x, y) {
	this.brush(x, y);
};

Brush.prototype.onSelect = function() {
	this.tmpCanvas.style.cursor = 'crosshair';

	this.tmpCtx.lineWidth = this.lineWidth;
	this.tmpCtx.lineCap = 'round';
	this.tmpCtx.lineJoin = 'round';

	// Canvas context parameters
	this.tmpCtx.fillStyle = this.colorSet.strokeColor;
	this.tmpCtx.strokeStyle = this.colorSet.strokeColor;
};