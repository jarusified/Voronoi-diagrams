const Point = require('./Point.js')

function Graph(){
    this.regions = []
}

Graph.prototype.getRegions = function(){
    
}

Graph.prototype.addPolygon = function(polygon){
    let site = polygon.getPolygonSite()
    if(this.regions.hasOwnProperty(site)){
	console.log("Adding a polygon that is already present");
	return 0;
    }
    this.regions[site] = polygon
}

Graph.prototype.updateExistingPolygon = function(polygon){
    let site = polygon.getPolygonSite()
    if(!this.regions.hasOwnProperty(site)){
	console.log("Updating a polygon that is not already present");
	return 0;
    }
    this.regions[site] = polygon
}

Graph.prototype.getPolygon = function(polygonSite){
    if(this.regions.hasOwnProperty(polygonSite)){
	return this.regions[polygonSite]
    }
    return undefined
}

Graph.prototype.getClosestPolygon = function(point){
    
}

module.exports = Graph
