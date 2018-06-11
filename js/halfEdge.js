function halfEdge(half1, half2, a, b){
    this.site1 = undefined
    this.site2 = undefined
    this.a = undefined
    this.b = undefined
}

halfEdge.prototype.init = function(half1, half2, a, b){
    this.site1 = half1
    this.site2 = half2
    this.a = a
    this.b = b
    return this
}

halfEdge.prototype.getA = function(){
    return this.a;
}

halfEdge.prototype.getB = function(){
    return this.b;
}

halfEdge.prototype.getSite1 = function(){
    return this.site1
}

halfEdge.prototype.getSite2 = function(){
    return this.site2
}

halfEdge.prototype.setSite1 = function(newSite1){
    this.site1 = newSite1
}

halfEdge.prototype.pointOnEdge = function(edge, pt){
    if(this.isOnCorner(edge, pt)){
	return true
    }

    if(Math.abs(edge.a.y - edge.b.y) <= 0.0001){
	return (pt.x >= Math.min(edge.a.x, edge.b.x) && pt.x <= Math.max(edge.a.x, edge.b.x) && Math.abs(pt.y- edge.a.y) <= 0.0001);
    }
    else if(Math.abs(edge.a.x - edge.b.x) <= 0.0001){
	return (pt.y >= Math.min(edge.a.y, edge.b.y) && pt.y <= Math.max(edge.a.y, edge.b.y) && Math.abs(pt.x- edge.a.x) <= 0.0001);
    }
    else{
	let slope = (edge.b.y - edge.a.y)/(edge.b.x - edge.a.x)
	let expectedY = edge.a.y + slope*(pt.x - edge.a.x)
	return Math.abs(pt.y - expectedY) <= 0.0001
    }
}

halfEdge.prototype.pointOnFirstCorner = function(edge, pt){
    return (Math.abs(pt.x - edge.a.x) <= 0.0001 && Math.abs(pt.y - edge.a.y) <= 0.0001);
}

halfEdge.prototype.pointOnSecondCorner = function(edge, pt) {
    return (Math.abs(pt.x - edge.b.x) <= 0.0001 && Math.abs(pt.y - edge.b.y) <= 0.0001);
}

halfEdge.prototype.isOnCorner = function(edge, pt){
    return Math.abs(pt.x - edge.a.x) <= 0.0001 && Math.abs(pt.y - edge.b.y) <= 0.0001 && Math.abs(pt.x - edge.a.x) <= 0.0001 && Math.abs(pt.y - edge.a.y) <= 0.0001
}

module.exports = function() { return new halfEdge(); }
