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

if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs = Array.prototype.slice.call(arguments, 1), 
				fToBind = this, 
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
															 aArgs.concat(Array.prototype.slice.call(arguments)));
				};
 
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}

/**
 * Constructor.
 */
function Canvas(canvas)
{
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	this.tmpCanvas = document.createElement('canvas');
	canvas.parentNode.appendChild(this.tmpCanvas);
	this.tmpCanvas.id = 'tmp_canvas';
	this.tmpCanvas.width = canvas.width;
	this.tmpCanvas.height = canvas.height;

	this.tmpCtx = this.tmpCanvas.getContext('2d');

	this.colorSet = new ColorSet();

	this.tools = {
		brush: new Brush(canvas, this.tmpCanvas, this.colorSet),
		bucket: new Bucket(canvas, this.tmpCanvas, this.colorSet),
		eraser: new Eraser(canvas, this.tmpCanvas, this.colorSet),
		colorpicker: new ColorPicker(canvas, this.tmpCanvas, this.colorSet)
	};

	this.mouseDown = false;
	this.lineWidth = 20;

	this.colorSet.onColorChange = this.onColorChange.bind(this);
	this.colorSet.setStrokeColor('orange');
	this.colorSet.setFillColor('white');

	this.setTool('brush');
	this.lastPosition = null;

	this.bindEvents();
}

/**
 * Bind DOM events to Canvas methods.
 */
Canvas.prototype.bindEvents = function()
{
	document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
	this.tmpCanvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
	this.tmpCanvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
	this.tmpCanvas.addEventListener('click', this.onClick.bind(this), false);

	[].map.call(document.querySelectorAll('a.colorbutton'), function(element) {
		element.addEventListener('click', this.onSelectColor.bind(this));
	}.bind(this));

	[].map.call(document.querySelectorAll('#tools a'), function(element) {
		element.addEventListener('click', this.onToolClicked.bind(this));
	}.bind(this));
};

Canvas.prototype.onColorChange = function() {

	// Display color
	document.getElementById('forecolor-button').style.color = this.colorSet.strokeColor;

	if (this.selectedTool === this.tools.brush)
	{
		// Canvas context parameters
		this.tmpCtx.fillStyle = this.colorSet.strokeColor;
		this.tmpCtx.strokeStyle = this.colorSet.strokeColor;
	}
	else if (this.selectedTool === this.tools.bucket)
	{
		// Canvas context parameters
		this.context.fillStyle = this.colorSet.strokeColor;
	}
	else if (this.selectedTool === this.tools.paint)
	{
		// Canvas context parameters
		this.context.fillStyle = this.colorSet.fillColor;
	}
};

Canvas.prototype.setTool = function(tool)
{
	this.selectedTool = this.tools[tool];
	this.selectedTool.onSelect();
};

/**
 * Method called when the user clicks on a color button.
 */
Canvas.prototype.onSelectColor = function(event)
{
	this.colorSet.setStrokeColor(event.target.dataset.color);
};

Canvas.prototype.onToolClicked = function(event)
{
	[].map.call(document.querySelectorAll('#tools li'), function(element) {
		element.classList.remove('active');
	}.bind(this));
	event.target.parentNode.classList.add('active');

	this.setTool(event.target.dataset.tool);
};

Canvas.prototype.onMouseDown = function(e)
{
	var x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	var y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	this.selectedTool.down(x, y);
};

Canvas.prototype.onMouseUp = function(e)
{
	var x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	var y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	this.selectedTool.up(x, y);
};

Canvas.prototype.onMouseMove = function(e)
{
	var x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	var y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	this.selectedTool.move(x, y);
};

Canvas.prototype.onClick = function(e)
{
	var x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	var y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	this.selectedTool.click(x, y);
};