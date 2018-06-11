const Point = require('./Point.js')

function GridPoint(x, y, f){
    this.x = x
    this.y = y
    this.f = f
}

GridPoint.prototype.getPointFromGP = function(gpt){
    return new Point(gpt.x, gpt.y, gpt.f)
}

GridPoint.prototype.distanceTo = function(gpt){
    return sqrt(pow(gpt.x - x, 2) + pow(gpt.y - y, 2))
}

GridPoint.prototype.equals = function(gpt1, gpt2){
    return (Math.abs(gpt1.x - gpt2.x) <= 0.0001 && Math.abs(gpt1.y - gpt2.y))
}

module.exports = GridPoint
