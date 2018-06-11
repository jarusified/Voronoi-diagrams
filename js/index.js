const Voronoi = require('./Voronoi.js')
const Voronoi2 = require('./Voronoi2.js')
const View = require('./View.js')
const Site = require('./Point.js')
const Sibson = require('./Sibson.js')
const d3n = require('voronoi-diagram')

let sites = [];
let nop = 10;

function SiteList(pts){
    this.sites = []
    this.sitenum = 0

    this.xmin = pts[0].x
    this.ymin = pts[0].y
    this.xmax = pts[0].x
    this.ymax = pts[0].y

    for(let i = 0; i < pts.length; i++){
        pt = pts[i]
        this.sites.push(new Site(pt.x, pt.y, i))
        if (pt.x < this.xmin){
            this.xmin = pt.x
        }
        if (pt.y < this.ymin){
            this.ymin = pt.y
        }
        if (pt.x > this.xmax){
            this.xmax = pt.x
        }
        if(pt.y > this.ymax){
            this.ymax = pt.y
        }
    }
}


// function App(){
//     let pts = this.randomPoints(5)
//     this.vor = Voronoi()
//     this.sl = new SiteList(pts)
//     console.log(this.vor)
//     this.vor.init(this.sl.xmin, this.sl.xmax, this.sl.ymin, this.sl.ymax)
//     this.View = View()
//     this.View.drawPoints(pts, '#00f')
//     for(let i = 0; i < pts.length; i++){
//         this.vor.addSite(pts[i])
//     }
// }

function App(){
    let numOfSites = 5
    this.vor = new Voronoi2()
    this.View = new View()
    this.sibson = new Sibson(this.vor)
    for(let i = 0; i < numOfSites; i += 10){
	    this.vor.build()
    }

    let polygons = Array.from(this.vor.graph.regions.values())
    for(let i = 0; i < polygons.length; i++){
	let edges = polygons[i].edges
	for(let j = 0; j < edges.length; j++){
	    let edge = edges[i]
	    let p1 = edge.a
	    let p2 = edge.b
        console.log(p1, p2)
	    this.View.drawPoint(p1, '#0ff')
	    this.View.drawPoint(p2, '#0ff')
//	    console.log(p1, p2)
	    this.View.drawEdge(p1, p2, '#aaa')
	}
//	this.View.drawPoint(polygons[i].polygonSite,'#aabbcc' )
    }
}

// function App(){
//     const data = [ [ 130, 33], [39, 59], [255, 555], [44, 33], [123, 55], [122, 44], [33, 33], [200, 239], [500, 400] ]
//     let voronoi = d3n(data)
//     this.View = new View()
//     console.log(voronoi)
//     for(let i = 0; i < voronoi.positions.length; i+=1){
// 	this.View.drawPoint(voronoi.positions[i], '#f00')
//     }
//     this.View.drawEdgeForLibrary(voronoi.cells, voronoi.positions)

// }

App.prototype.randomPoints = function (nop){
    var ret = []
    for(let i = 0; i < nop; i++){
        ret.push(new Site(Math.floor(Math.random()*window.innerWidth), Math.floor(Math.random()*window.innerHeight)))
    }
    return ret;
}


App.prototype.draw = function(){
//    this.drawVoronoi()
//    this.drawTriangles(this.sl.sites)
//    this.drawDelaunay()
    //   this.sibson()
//    this.Triangle(this.vor.startEdge)
    //    this.View.render(this.vor)
}

App.prototype.redraw = function(){
    this.draw()
}

App.prototype.drawVoronoi = function(){
    let sites = this.sl.sites
    for(let site in sites){
        voronoiPoints = this.vor.getVoronoi(sites)
        voronoiPoints.push(voronoiPoints[0])
    }
    this.View.drawPoints(voronoiPoints, '#f00')
    this.View.drawSpecialEdges(voronoiPoints, '#f00')    

    
}

App.prototype.Triangle = function(edge){
    edge.qedge.label = 1

    p0 = edge.org()
    p1 = edge.dest()
    p2 = edge.lnext().dest()

    this.View.drawEdges(p1, p2, '#aabbcc')
    ledge = edge.onext()
    if(ledge.qedge.label == 0)
        this.Triangle(ledge)

    redge = edge.onext().sym()
    if(redge.qedge.label == 0)
        this.Triangle(redge)

    edge = edge.sym()
    ledge = edge.onext()
    if(ledge.qedge.label == 0)
        this.Triangle(ledge)

    redge = edge.onext().sym()
    if(redge.qedge.label == 0)
        this.Triangle(redge)
}

App.prototype.drawDelaunay = function(){
    let sites = this.sl.sites
    for(let site in sites){
        delaunayPoints = this.vor.getSiteDelaunay(sites[site])
    }
    this.View.drawPoints(delaunayPoints, '#ffddcc')
    for(let i = 0; i < delaunayPoints.length; i++){
        for(let j = 0; j < delaunayPoints.length; j++){
            this.View.drawEdges(delaunayPoints[i], delaunayPoints[j],  '#f00')
        }
    }
    
}

App.prototype.drawTriangles = function(sites){
    base = this.vor.locateSite(sites[0])
    if(base != undefined)
        this.Triangle(base)

}

App.prototype.sibson = function(){
    let dims = 200
    let values = []
    
    for(let site in sites){
    }
}


window.App =  new App()
window.App.draw()

