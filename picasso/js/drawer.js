var Drawer = function(canvas, brush)
{    
    this.canvas(canvas);
    this.context(this.canvas().getContext('2d'));
    
    this.brush(brush);
    brush.canvasContext(this.context());
}

Drawer.prototype.canvas = function(value)
{
    if (!value) return this._canvas;
    else this._canvas = value;
}

Drawer.prototype.context = function(value)
{
    if (!value) return this._context;
    else this._context = value;
}

Drawer.prototype.color = function(value)
{
    if (!value) return this.context().strokeStyle;
    else
    {
        this.context().strokeStyle = value;
        this.context().fillStyle = value;
    }
}

Drawer.prototype.brush = function(value)
{
    if (!value) return this._brush;
    else this._brush = value;
}

Drawer.prototype.paint = function(x, y)
{
    this.brush().paint(x, y);
}