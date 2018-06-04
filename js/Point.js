function Point(x, y){
    this.x = x;
    this.y = y
    return this;
}


Point.prototype.sub = function(p){
    return Point(this.x - p.x, this.y - p.y)
}

Point.prototype.add = function(p){
    return Point(this.x + p.x, this.y + p.y)
}

Point.prototype.eq = function(p){
    return math.abs(this.x - p.x) < 0.0001 && math.abs(this.y - p.y) < 0.0001
}

module.exports = Point;
