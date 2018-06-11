function Sibson(voronoi){

}

Sibson.prototype.init = function(voronoi){
    this.voronoi = voronoi
}


Sibson.prototype.interpolate = function(newSite){
    let areaSum = 0
    let numerator = 0
    let graph = this.voronoi.graph
    let cutPoints = [];
    let cutEdges = [];
    
    if(graph.pointOnGraph(newSite)){
	console.log("Point already in graph, ignoring....")
	return 0
    }

    curPolygon = graph.getClosestPolygon(newSite)
    console.log('Current polygon site', curPolygon.getPolygonSite())


    
}

module.exports = function() { return new Sibson(); }
