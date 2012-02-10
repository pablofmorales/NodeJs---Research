var Brush = function()
{
    this._radius     = 5;
    this._startAngle = 0;
    this._endAngle   = 2 * Math.PI;
}

Brush.prototype.radius = function(value)
{
    if (value) this._radius = value;
    else return this._radius;
}

Brush.prototype.startAngle = function(value)
{
    if (value) this._startAngle = value;
    else return this._startAngle;
}

Brush.prototype.endAngle = function(value)
{
    if (value) this._endAngle = value;
    else return this._endAngle;
}

Brush.prototype.canvasContext = function(value)
{
    if (!value) return this._canvasContext;
    else this._canvasContext = value;
}

Brush.prototype.paint = function(x, y)
{
    console.log('override plz!');
}


// Different brush types

var BrushDot = function(canvasContext)
{
    this.canvasContext(canvasContext);
}

BrushDot.prototype = new Brush();

BrushDot.prototype.paint = function(x, y)
{
    this.canvasContext().beginPath();
    
    this.canvasContext().arc(
        x,
        y,
        this.radius(),
        this.startAngle(),
        this.endAngle(),
        false
    );
    
    this.canvasContext().stroke();
}

var BrushBigCircle = function(canvasContext)
{
    this.canvasContext(canvasContext);
    
    this.radius(100);
}

BrushBigCircle.prototype = new Brush();

BrushBigCircle.prototype.paint = function(x, y)
{
    this.canvasContext().beginPath();
    
    this.canvasContext().arc(
        x,
        y,
        this.radius(),
        this.startAngle(),
        this.endAngle(),
        false
    );
    
    this.canvasContext().stroke();
}


// *************** BrushRect

var BrushRect = function(width, height)
{
    this.width(width || 0);
    this.height(height || 0);
}

BrushRect.prototype = new Brush();

BrushRect.prototype.width = function(value)
{
    if (!value) return this._width;
    else this._width = value;
}

BrushRect.prototype.height = function(value)
{
    if (!value) return this._height;
    else this._height = value;
}

BrushRect.prototype.paint = function(x, y)
{
    this.canvasContext().fillRect(x, y, this.width(), this.height());
}


