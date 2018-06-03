const Site = require('./Point.js')
const Edge = require('./edge.js')

function Voronoi(parentDiv){
    this.e = 1e-6
    this.nop = 100
    this.sites = []
    return this;    
}

Voronoi.prototype.randomPoints = function (nop){
    var ret = []
    for(let i = 0; i < nop; i++){
        ret.push(new Site(Math.floor(Math.random()*window.innerWidth), Math.floor(Math.random()*window.innerHeight)))
    }
    return ret;

}

Voronoi.prototype.init = function(minX, maxX, minY, maxY){
    // pts.push(new Site(minX + this.e, minY + this.e))
    // pts.push(new Site(minX + this.e, maxY - this.e))
    // pts.push(new Site(maxX - this.e, maxY - this.e))
    // pts.push(new Site(maxX - this.e, minY + this.e))
    // pts.push(new Site(minX + this.e, minY + this.e))
    // pts.push(new Site(100, 100))
    
    // this.sites = pts
    this.sites = this.randomPoints(this.nop)
    
    
    let edges = []
    let edge_obj = Edge()
    edges[0] = edge_obj.createEdge()
    console.log(edges[0]);
    edges[0].endPoints(this.sites[1], this.sites[0])
    for(var i = 1; i < this.sites.length; i++){
        edges[i] = edge_obj.createEdge()
        edges[i].endPoints(this.sites[i+1], this.sites[i])
        edge_obj.splice(edges[i].sym(), edges[i-1])
    }
    edge_obj.splice(edges[3], edges[0].sym())
    this.startEdge = edges[0]

    this.edges = edges
}


Voronoi.prototype.getSiteDelaunay = function(site){
    
}

Voronoi.prototype.addSite = function(site){
}

module.exports = function() { return new Voronoi(); }
