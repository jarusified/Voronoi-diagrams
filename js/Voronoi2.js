const Graph = require('./Graph.js')
const GP =  require('./gridPoint.js')
const Polygon = require('./Polygon.js')
const Point = require('./Point.js')
const CompGeo = require('./CompGeo.js')
const Edge = require('./halfEdge.js')

function Voronoi2(){
    this.dim = 200
    this.graph = new Graph()
    this.compGeo = new CompGeo()
    this.gridPoints = this.randomPoints()
    this.numOfSites = 5
    
    if(this.numOfSites >= (this.dim - 1)*(this.dim -1)){
	    console.log('More sites than gridpoints')
	    return
    }

    this.xMin = 0
    this.xMax = 400
    this.yMin = 0
    this.yMax = 400

    this.init(this.gridPoints[0])
    this.curIndex = 1
}

Voronoi2.prototype.randomPoints = function(){
    let ret = [];
    ret.push(new GP(100, 31, 0))
    ret.push(new GP(73, 30, 0))
    ret.push(new GP(10, 123, 0))
    ret.push(new GP(102, 13, 0))
    ret.push(new GP(58, 83, 0))
    ret.push(new GP(139,161, 0))
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
	    console.log("Closest polygon is ", closestPolygon)
	    this.addSite(closestPolygon, curPT)
    }
    this.curIndex += numOfPoints
}

Voronoi2.prototype.cleanUpGridPoints = function(arr){
    for(let j = 0; j < this.gridPoints.length; j++){
        for(let i = 0; i < arr.length; i++){
            if(arr[i] == this.gridPoints[j]){
                this.gridPoints.splices(j, 1)
            }
        }
    }
}

Voronoi2.prototype.build = function(){
    let removePoints = []
    for(let i = 0; i<this.gridPoints.length; i++){
        let gp = new GP()
        let curGPT = this.gridPoints[i]
        let curPT = gp.getPointFromGP(curGPT)
        if(this.graph.pointOnGraph(curPT)){
            removePoints.push(curPT)
            continue
        }
        let closestPolygon = this.graph.getClosestPolygon(curPT);
        this.addSite(closestPolygon, curPT)
    }
    this.cleanUpGridPoints(removePoints);
}


Voronoi2.prototype.addSite = function(polygon, newSite){
    console.log("adding site, ", newSite);
    let cutPoints = []
    let cutEdges = []

    for(let edgeID in polygon.edges){
	    let edge = polygon.edges[edgeID]
	    let intersectionPoint = this.compGeo.getIntersectionOfSegmentAndBisector(polygon.getPolygonSite(), newSite, edge)
	    console.log("Intersection Point", intersectionPoint)
	    if(intersectionPoint != null){
	        if(cutPoints.length == 0 || cutPoints.indexOf(intersectionPoint) == -1){
		        cutPoints.push(intersectionPoint)
		        cutEdges.push(edge)
	        }
	    }
    }

    console.log(cutPoints.length)    
    if(cutPoints.length != 2){
        return
    }
    
    if(this.isBoundaryPoint(cutPoints[0]) && this.isBoundaryPoint(cutPoints[1])){
	    this.splitPolygon(polygon, cutPoints[0], cutPoints[1], newSite)
	    console.log("success", this.graph.regions)
	    return
    }

    this.updatePolygon(polygon, cutPoints[0], cutPoints[1], newSite)

    let p = new Point()
    let newPolygon = new Polygon(newSite);
    let onePointOnBoundary = false;
    
    if (cutEdges[0].site2 == null || cutEdges[1].site2 == null) {
        onePointOnBoundary = true;
    }

    if (cutEdges[0].site2 == null) {
        cutPoints.reverse();
        cutEdges.reverse();
    }
    
    if(cutEdges[1].site2 == null) {
        let p1 = cutEdges[1].a
        let p2 = cutEdges[1].b
        newPolygon.addPoint(p.closeTo(newSite, p1, p2) ? p1 : p2);
    }

    let nextPolygonSite = cutEdges[0].site1;
    let nextPolygon = this.graph.getPolygon(nextPolygonSite);
    let nextPolygonCutPointFirst = cutPoints[0];
    let curPolygonCutPointSecond = cutPoints[1];
    let curPolygonCutEdgeSecond = cutEdges[1];
    let nextPolygonCutEdge = null;
    newPolygon.addPoint(curPolygonCutPointSecond);
    newPolygon.addPoint(nextPolygonCutPointFirst, polygon.getPolygonSite());

    let cnt = 0;
    while (nextPolygon!=null) {
        if (!onePointOnBoundary && lastPolygonToUpdate(curPolygonCutEdgeSecond, nextPolygonSite))
            break;
        cnt++;
        if (cnt == 10){
	        console.log("BUG");
            break;
        }
	    console.log("Inside the loop building new polygon!!!");
        for (let edgeID in  nextPolygon.edges) {
	        let newEdge = nextPolygon.edges[edgeID]
            if (newEdge.pointOnEdge(nextPolygonCutPointFirst))
                continue;
            let intersectionPoint = Math.getIntersectionOfSegmentAndBisector(newSite,
									                                         nextPolygon.getPolygonSite(), nextPolygonCutPointFirst, newEdge);
            if (intersectionPoint != null) {
                nextPolygonCutEdge = newEdge;
                newPolygon.addPoint(intersectionPoint, nextPolygon.getPolygonSite());
                updatePolygon(nextPolygon, nextPolygonCutPointFirst, intersectionPoint, newSite);
                nextPolygonCutPointFirst = intersectionPoint;
                nextPolygonSite = nextPolygonCutEdge.site2;
                nextPolygon = graph.getPolygon(nextPolygonSite);
                break;
            }
        }
    }
    if (nextPolygon == null) {
        if (nextPolygonCutEdge == null)
            return;
        let p1 = nextPolygonCutEdge.a;
        let p2 = nextPolygonCutEdge.b;
        newPolygon.addPoint(p.closeTo(newSite, p1, p2) ? p1 : p2);
        newPolygon.closePolygon();
    }
    else {
	    newPolygon.addPoint(curPolygonCutPointSecond, nextPolygon == null ? null : nextPolygon.getPolygonSite());
    }
    if (nextPolygon!=null)
        updatePolygon(nextPolygon, nextPolygonCutPointFirst, curPolygonCutPointSecond, newSite);
    
    this.graph.addPolygon(newPolygon);
    console.log("Successfully added new site to current voronoi complex!!!");
    console.log(this.graph)
}

Voronoi2.prototype.isBoundaryPoint = function(pt){
    console.log(pt)
    return Math.abs(pt.x - this.xMin) <= 0.0001 || Math.abs(pt.x - this.xMax) <= 0.0001 || Math.abs(pt.y - this.yMin) <= 0.0001 || Math.abs(pt.y - this.yMax) <= 0.0001;
}


Voronoi2.prototype.splitPolygon = function(polygon, cutPoint1, cutPoint2, newSite){
    let oldSite = polygon.getPolygonSite()
    let newPolygon = polygon.clonePolygon()
    this.updatePolygon(polygon, cutPoint1, cutPoint2, newSite)
    newPolygon = this.updatePolygonSite(newPolygon, newSite)
    this.graph.addPolygon(newPolygon)
    console.log(newPolygon)
    this.updatePolygon(newPolygon, cutPoint1, cutPoint2, oldSite)
}

Voronoi2.prototype.updatePolygonSite = function(polygon, newSite){
    polygon.setPolygonSite(newSite)
    for(let edge in polygon.edges){
	    polygon.edges[edge].site1 = newSite
    }
    return polygon;
}

Voronoi2.prototype.updatePolygon = function(polygon, cutPoint1, cutPoint2, newSite){
    let correctedPolygon = this.correctPolygon(polygon, cutPoint1, cutPoint2, newSite)
    this.graph.updateExistingPolygon(correctedPolygon)
}

//Can have problems
Voronoi2.prototype.correctPolygon = function(polygon, cutPoint1, cutPoint2, newSite){
    let oldSite = polygon.getPolygonSite()
    let newPolygon = new Polygon()
    newPolygon.init(newSite)

    for(let edgeID in polygon.edges){
	    let edge = polygon.edges[edgeID]
	    let p1 = edge.a
	    let p2 = edge.b

	    let e = new Edge()
	    let p = new Point()
	    if(e.pointOnEdge(edge, cutPoint1)){
	        console.log('case 1')
	        if (e.pointOnFirstCorner(edge, cutPoint1) && p.closeTo(p2, oldSite, newSite)) {
		        console.log('case 1.1')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(p1, null);
                newPolygon.addPoint(p2, e.getSite2(edge));
            }
            else if (e.pointOnFirstCorner(edge, cutPoint1) && p.closeTo(p2, newSite, oldSite)) {
		        console.log('case 1.2')
                // Nothing to do here.
            }
            else if (e.pointOnSecondCorner(edge, cutPoint1) && p.closeTo(p1, oldSite, newSite)) {
		        console.log('case 1.3')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(p1, null);
                newPolygon.addPoint(p2, e.getSite2(edge));
                newPolygon.addPoint(cutPoint2, newSite);
            }
            else if (e.pointOnSecondCorner(edge, cutPoint1) && p.closeTo(p1, newSite, oldSite)) {
		        console.log('case 1.4')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(p2, null);
            }
            else if (p.closeTo(p1, oldSite, newSite) && p.closeTo(p2, newSite, oldSite)) {
		        console.log('case 1.5')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(p1, null);
                newPolygon.addPoint(cutPoint1, e.getSite2(edge));
                newPolygon.addPoint(cutPoint2, newSite);
            }
            else if (p.closeTo(p1, newSite, oldSite) && p.closeTo(p2, oldSite, newSite)) {
		        console.log('case 1.6')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(cutPoint1, null);
                newPolygon.addPoint(p2, e.getSite2(edge));
            }
	    }
	    
	    else if(e.pointOnEdge(edge, cutPoint2)){
	        console.log("case 2")
	        if (e.pointOnFirstCorner(edge, cutPoint2) && p.closeTo(p2, oldSite, newSite)) {
		        console.log('case 2.1')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(p1, null);
                newPolygon.addPoint(p2, e.getSite2(edge));
            }
            else if (e.pointOnFirstCorner(edge, cutPoint2) && p.closeTo(p2, newSite, oldSite)) {
		        console.log('case 2.2')
                // Nothing to do here.
            }
            else if (e.pointOnSecondCorner(edge, cutPoint2) && p.closeTo(p1, oldSite, newSite)) {
		        console.log('case 2.3')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(p1, null);
                newPolygon.addPoint(p2, e.getSite2(edge));
                newPolygon.addPoint(cutPoint1, newSite);
            }
            else if (e.pointOnSecondCorner(edge, cutPoint2) && p.closeTo(p1, newSite, oldSite)) {
		        console.log('case 2.4')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(p2, null);
            }
            else if (p.closeTo(p1, oldSite, newSite) && p.closeTo(p2, newSite, oldSite)) {
		        console.log('case 2.5')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(p1, null);
                newPolygon.addPoint(cutPoint2, e.getSite2(edge));
                newPolygon.addPoint(cutPoint1, newSite);
            }
            else if (p.closeTo(p1, newSite, oldSite) && p.closeTo(p2, oldSite, newSite)) {
		        console.log('case 2.6')
                if (newPolygon.points.length == 0)
                    newPolygon.addPoint(cutPoint2, null);
                newPolygon.addPoint(p2, e.getSite2(edge));
            }
	    }
	    else{
	        console.log("case 3")
	        let p = new Point()
	        if (p.closeTo(p1, oldSite, newSite) && p.closeTo(p2, oldSite, newSite)) {
		        console.log('case 3.1')
                if (newPolygon.points.length = 0)
                    newPolygon.addPoint(p1, null);
                newPolygon.addPoint(p2, edge.site2);
            }
	    }
	    
    }
    return newPolygon
}

module.exports = function() { return new Voronoi2(); }
