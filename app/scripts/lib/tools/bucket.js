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
function Bucket(canvas, tmpCanvas, colorSet)
{
	this.colorSet = colorSet;
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.tmpCanvas = tmpCanvas;
	this.tmpCtx = this.tmpCanvas.getContext('2d');
};

Bucket.prototype = new Tool();
Bucket.prototype.constructor = Bucket;

Bucket.prototype.click = function(x, y) {
	this.context.globalCompositeOperation = 'source-over';
	this.context.fillStyle = this.fillColor;
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Bucket.prototype.onSelect = function() {

};