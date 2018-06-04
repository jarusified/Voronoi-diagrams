const App = require('./index.js')
const Site = require('./Point.js')
const Edge = require('./edge.js')

function Voronoi(){
    this.e = 1e-6
    this.nop = 10
    this.sites = []
}

Voronoi.prototype.randomPoints = function (nop){
    var ret = []
    for(let i = 0; i < nop; i++){
        ret.push(new Site(Math.floor(Math.random()*window.innerWidth), Math.floor(Math.random()*window.innerHeight)))
    }
    return ret;
}

Voronoi.prototype.area = function(a, b, c){
    if(a == undefined || b == undefined || c == undefined){
        return -1
    }

    let area =  (b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)
    return area
}

Voronoi.prototype.rightOfEdge = function(p, site){
    return this.area(p, site.dest(), site.org()) >= 0
}

Voronoi.prototype.leftOfEdge = function(p, site){
    return this.area(p, site.org(), site.dest())
}

Voronoi.prototype.init = function(minX, maxX, minY, maxY){
    let pts = []
    pts.push(new Site(minX + 1, minY + 1))
    pts.push(new Site(minX + 1, maxY -  1))
    pts.push(new Site(maxX - 1, minY + 1))
    pts.push(new Site(maxX - 1, maxY - 1))
    
    this.sites = pts
    
    
    let edges = []
    let edge_obj = Edge()
    edges[0] = edge_obj.createEdge()
    edges[0].endPoints(this.sites[1], this.sites[0])
    for(var i = 1; i < 4; i++){
        edges[i] = edge_obj.createEdge()
        edges[i].endPoints(this.sites[i+1], this.sites[i])
        edge_obj.splice(edges[i].sym(), edges[i-1])
    }
    edges[3].endPoints(this.sites[3], this.sites[0])
    edge_obj.splice(edges[3], edges[0].sym())
    this.startEdge = edges[0]

    this.edges = edges
}

Voronoi.prototype.addSite = function(site){
    e = this.locateSite(site)
    
    if( site == e.org() || site == e.dest()){
        return undefined
    }
    // else if(onEdge(site, e)){
    //     e = e.oprev()
    //     Edge.deleteEdge(e.onext())
    // }

    let edge_obj = Edge()
    newEdge = edge_obj.createEdge()
    newEdge.endPoints(e.org(), site)
    edge_obj.splice(newEdge, e)

    self.startEdge = newEdge
    this.sites.push(site)
    this.edges.push(newEdge)
    window.App.redraw()
}

Voronoi.prototype.locateSite = function(site){
    e = this.startEdge
    count = 0
    while(true){

        if(count == 4){
            console.log("Site not working", site);
            return e
        }
        
        if(site == e.org() || site == e.dest()){
//            console.log('found')
            return e
        }
        else if(this.rightOfEdge(site, e)){
//            console.log('a')
            e = e.sym()
        }
        else if(!this.rightOfEdge(site, e.onext())){
//            console.log('b')
            e = e.onext()
        }
        else if(!this.rightOfEdge(site, e.dprev())){
//            console.log('c')
            e = e.dprev()
        }
        else
            return e
        count += 1
    }

}

Voronoi.prototype.getSiteDelaunay = function(site){
    let ret = []
    let location = this.locateSite(site)

    if(!location.org()){
        location = location.sym()
    }

    let temp = location
    while(true){
        ret.push(location.dest())
        temp = temp.onext()
        if( temp == location ){
            break
        }
    }
    console.log(ret)
    return ret;
}

module.exports = function() { return new Voronoi(); }
