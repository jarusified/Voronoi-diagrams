const Edge = require('./halfEdge.js')
const Point = require('./Point.js')

function Polygon(){
    this.polygonSite = undefined
    this.edges = []
    this.points = []
    this.lastAddedPoint = undefined
    this.isClosed = false
}

Polygon.prototype.init = function(site){
    this.polygonSite = site
}

Polygon.prototype.isClosed = function(){
    return this.isClosed
}

Polygon.prototype.closePolygon = function(){
    if(!this.isClosed){
	this.addPoint(this.points[0])
    }
}

Polygon.prototype.getPolygonSite = function(){
    return this.polygonSite
}

Polygon.prototype.setPolygonSite = function(newSite){
    this.polygonSite = newSite
}

Polygon.prototype.addPoint = function(point, otherPointEdge){
    if(this.points.length != 0){
	let edge = new Edge()	
	this.edges.push(edge.init(this.polygonSite, otherPointEdge, this.lastAddedPoint, point))
    }

    if(this.points.length != 0 && this.points[0] == point){
	this.isClosed = true
    }

    if(this.points.length == 0 || this.points[0] != point){
	this.points.push(point);
    }

    this.lastAddedPoint = point
}

Polygon.prototype.clonePolygon = function(){
    let clone = new Polygon()
    clone.init(this.polygonSite)
    for(let pts in this.points){
	let point = this.points[pts]
	clone.points.push(new Point(point.x, point.y))
    }
    for(let edgeID in this.edges){
	let edge = this.edges[edgeID]
	newEdge = new Edge()
	clone.edges.push(newEdge.init(edge.site1, edge.site2, edge.a, edge.b))
    }
    return clone
}

Polygon.prototype.contains = function(inX, inY){
    let contains = false

    for(let i = 0, j = this.points.length -1 ; i < this.points.length; j = i++){
	p1 = this.points[i]
	p2 = this.points[j]
	if(((p1.y > inY) != (p2.y > inY)) && (inX < (p2.x - p1.x)*(inY - p1.y)/(p2.y - p1.y) + p1.x)){
	    contains = !contains
	}
    }
    return contains
}


module.exports = function(){ return new Polygon(); } 
