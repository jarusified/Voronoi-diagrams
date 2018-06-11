const Point = require('./Point.js')

function Graph(){
    this.regions = new Map()
}

Graph.prototype.getRegions = function(){
    
}

Graph.prototype.addPolygon = function(polygon){
    let site = polygon.getPolygonSite()
    if(this.regions.hasOwnProperty(site)){
	console.log("Adding a polygon that is already present");
    }
    this.regions.set(site, polygon)
}

Graph.prototype.updateExistingPolygon = function(polygon){
    let site = polygon.getPolygonSite()
    console.log(this.regions, site)
    if(!this.regions.hasOwnProperty(site)){
	console.log("Updating a polygon that is not already present");
    }
    this.regions.set(site, polygon)
}

Graph.prototype.getPolygon = function(polygonSite){
    if(this.regions.hasOwnProperty(polygonSite)){
	return this.regions[polygonSite]
    }
    return undefined
}

Graph.prototype.getClosestPolygon = function(pt){
    let closestPoint
    let minDist = Number.MAX_VALUE
    
    keyArr = Array.from(this.regions.keys())
    for(let key in keyArr){
	let point = new Point()
	let dist = point.distanceTo(keyArr[key], pt)
	if(dist < minDist){
	    minDist = dist
	    closestPoint = keyArr[key]
	}
    }
    let closestPolygon = this.regions.get(closestPoint)
    return closestPolygon
}

Graph.prototype.pointOnGraph = function(pt){
    let distances = []
    for(let i = 0; i < this.regions.length; i++){	
	let point = new Point()
	let dist = point.distanceTo(this.sites[i], pt);
	distances[i] = dist
    }

    distances.sort()
    for(let i = 0; i < distances.length - 1 ; i++){
	if(abs(distances[i] - distances[i+1]) <= 0.0001){
	    return true
	}
    }
    return false
}

module.exports = Graph
