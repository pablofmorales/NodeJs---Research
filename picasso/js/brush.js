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

Brush.prototype.paint = function(x, y)
{
    console.log('override plz!');
}

var BrushDot = function(canvasContext)
{
    this.setCanvasContext(canvasContext);
}

BrushDot.prototype = new Brush();

BrushDot.prototype.paint = function(x, y)
{
    this.getContext().beginPath();
    
    this.getContext().arc(
        x,
        y,
        this.radius(),
        this.startAngle(),
        this.endAngle(),
        false
    );
    
    this.getContext().stroke();
}



