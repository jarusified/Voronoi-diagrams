const Graph = require('./Graph.js')
const GP =  require('./gridPoint.js')
const Polygon = require('./Polygon.js')
const Point = require('./Point.js')
const CompGeo = require('./CompGeo.js')
const Edge = require('./halfEdge.js')

function Voronoi2(){
    this.dim = 20
    this.graph = new Graph()
    this.compGeo = new CompGeo()
    this.gridPoints = this.randomPoints()

    if(this.numOfSites >= (this.dim - 1)*(this.dim -1)){
	console.log('More sites than gridpoints')
	return
    }

    this.xMin = 0
    this.xMax = this.dim - 1
    this.yMin = 0
    this.yMax = this.dim - 1

    this.init(this.gridPoints[0])
    this.curIndex = 1
}

Voronoi2.prototype.randomPoints = function(){
    let ret = [];
    ret.push(new GP(22, 34, 0))
    ret.push(new GP(80, 50, 0))
    ret.push(new GP(191, 113, 0))
    ret.push(new GP(250, 198, 0))
    ret.push(new GP(50, 44, 0))
    return ret
}

Voronoi2.prototype.init = function(firstGPT){
    gp = new GP()
    firstPT = gp.getPointFromGP(firstGPT)
    initialP = new Polygon()
    initialP.init(firstPT)
    initialP.addPoint(new Point(this.xMin, this.yMin), null)
    initialP.addPoint(new Point(this.xMin, this.yMax), null)
    initialP.addPoint(new Point(this.xMax, this.yMax), null)
    initialP.addPoint(new Point(this.xMax, this.yMin), null)
    initialP.addPoint(new Point(this.xMin, this.yMin), null)
    this.graph.addPolygon(initialP)
}

Voronoi2.prototype.build = function(numOfPoints){
    let j = 0
    for (let i = this.curIndex; j < numOfPoints && i < this.gridPoints.length; i++){
	j++;
	let gp = new GP()
	let curGPT = this.gridPoints[i]
	let curPT = gp.getPointFromGP(curGPT)

	if(this.graph.pointOnGraph(curPT)){
	    continue
	}

	let closestPolygon = this.graph.getClosestPolygon(curPT)
//	console.log("Closest polygon is ", closestPolygon)
	this.addSite(closestPolygon, curPT)
    }
}

Voronoi2.prototype.addSite = function(polygon, newSite){
    let cutPoints = []
    let cutEdges = []

    for(let edge in polygon.edges){
	let intersectionPoint = this.compGeo.getIntersectionOfSegmentAndBisector(polygon.getPolygonSite(), newSite, polygon.edges[edge])
	if(intersectionPoint != undefined){
	    if(cutPoints.length == 0 || cutPoints.indexOf(intersectionPoint)){
		cutPoints.push(intersectionPoint)
		cutEdges.push(edge)
	    }
	}
    }

    if(this.isBoundaryPoint(cutPoints[0]) && this.isBoundaryPoint(cutPoints[1])){
	this.splitPolygon(polygon, cutPoints[0], cutPoints[1], newSite)
    }

    this.updatePolygon(polygon, cutPoints[0], cutPoints[1], newSite)

    console.log(cutPoints)

}

Voronoi2.prototype.isBoundaryPoint = function(pt){
    return Math.abs(pt.x - this.xMin) <= 0.0001 || Math.abs(pt.x - this.xMax) <= 0.0001 ||
        Math.abs(pt.y - this.yMin) <= 0.0001 || Math.abs(pt.y - this.yMax) <= 0.0001;
}


Voronoi2.prototype.splitPolygon = function(polygon, cutPoint1, cutPoint2, newSite){
    let oldSite = polygon.getPolygonSite()
    let newPolygon = polygon.clonePolygon()
    this.updatePolygon(polygon, cutPoint1, cutPoint2, newSite)
    this.updatePolygonSite(newPolygon, newSite)
    graph.addPolygon(newPolygon)
    this.updatePolygon(newPolygon, cutPoint1, cutPoint2, oldSite)
}

Voronoi2.prototype.updatePolygonSite = function(polygon, newSite){
    let p = new Polygon()
    polygon.setPolygonSite(newSite)
    for(let edge in polygon.edes){
	edge.setSite1(newSite)
    }
}

Voronoi2.prototype.updatePolygon = function(polygon, cutPoint1, cutPoint2, newSite){
    let correctedPolygon = this.correctPolygon(polygon, cutPoint1, cutPoint2, newSite)
    this.graph.updateExistingPolygon(correctedPolygon)
}

//Can have problems
Voronoi2.prototype.correctPolygon = function(polygon, cutPoint1, cutPoint2, newSite){
    let oldSite = polygon.getPolygonSite()
    let newPolygon = new Polygon(oldSite)

    for(let edgeID in polygon.edges){
	let edge = polygon.edges[edgeID]
	let p1 = edge.a
	let p2 = edge.b

	let e = new Edge()
	let p = new Point()
	if(e.pointOnEdge(edge, cutPoint1)){
	    if (e.pointOnFirstCorner(edge, cutPoint1) && p.closeTo(p2, oldSite, newSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(p1);
                polygon.addPoint(p2, e.getSite2(edge));
            }
            else if (e.pointOnFirstCorner(edge, cutPoint1) && p.closeTo(p2, newSite, oldSite)) {
                // Nothing to do here.
            }
            else if (e.pointOnSecondCorner(edge, cutPoint1) && p.closeTo(p1, oldSite, newSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(p1);
                polygon.addPoint(p2, e.getSite2(edge));
                polygon.addPoint(cutPoint2, newSite);
            }
            else if (e.pointOnSecondCorner(edge, cutPoint1) && p.closeTo(p1, newSite, oldSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(p2);
            }
            else if (p.closeTo(p1, oldSite, newSite) && p.closeTo(p2, newSite, oldSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(p1);
                polygon.addPoint(cutPoint1, e.getSite2(edge));
                polygon.addPoint(cutPoint2, newSite);
            }
            else if (p.closeTo(p1, newSite, oldSite) && p.closeTo(p2, oldSite, newSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(cutPoint1);
                polygon.addPoint(p2, e.getSite2(edge));
            }
	}
	
	else if(e.pointOnEdge(edge, cutPoint2)){
	    if (e.pointOnFirstCorner(cutPoint2) && p.closeTo(p2, oldSite, newSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(p1);
                polygon.addPoint(p2, e.getSite2(edge));
            }
            else if (e.pointOnFirstCorner(edge, cutPoint2) && p.closeTo(p2, newSite, oldSite)) {
                // Nothing to do here.
            }
            else if (e.pointOnSecondCorner(edge, cutPoint2) && p.closeTo(p1, oldSite, newSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(p1);
                polygon.addPoint(p2, e.getSite2(edge));
                polygon.addPoint(cutPoint1, newSite);
            }
            else if (e.pointOnSecondCorner(edge, cutPoint2) && p.closeTo(p1, newSite, oldSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(p2);
            }
            else if (p.closeTo(p1, oldSite, newSite) && p.closeTo(p2, newSite, oldSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(p1);
                polygon.addPoint(cutPoint2, e.getSite2(edge));
                polygon.addPoint(cutPoint1, newSite);
            }
            else if (p.closeTo(p1, newSite, oldSite) && p.closeTo(p2, oldSite, newSite)) {
                if (polygon.points.length == 0)
                    polygon.addPoint(cutPoint2);
                polygon.addPoint(p2, e.getSite2(edge));
            }
	}
	else{
	    let p = new Point()
	    if (p.closeTo(p1, oldSite, newSite) && p.closeTo(p2, oldSite, newSite)) {
                if (newPolygon.points.length = 0)
                    newPolygon.addPoint(p1);
                newPolygon.addPoint(p2, edge.site2);
            }
	}
	
    }
    return newPolygon
}

module.exports = function() { return new Voronoi2(); }
