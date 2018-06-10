const Voronoi = require('./Voronoi.js')
const View = require('./View.js')
const Site = require('./Point.js')

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


function App(){
    let pts = this.randomPoints(5)
    this.vor = Voronoi()
    this.sl = new SiteList(pts)
    console.log(this.vor)
    this.vor.init(this.sl.xmin, this.sl.xmax, this.sl.ymin, this.sl.ymax)
    this.View = View()
    this.View.drawPoints(pts, '#00f')
    for(let i = 0; i < pts.length; i++){
        this.vor.addSite(pts[i])
    }

}

App.prototype.randomPoints = function (nop){
    var ret = []
    for(let i = 0; i < nop; i++){
        ret.push(new Site(Math.floor(Math.random()*window.innerWidth), Math.floor(Math.random()*window.innerHeight)))
    }
    return ret;
}


App.prototype.draw = function(){
    this.drawVoronoi()
//    this.drawTriangles(this.sl.sites)
    //    this.Delaunay()
    this.sibson()
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
        //        this.View.drawPoints(voronoiPoints, '#f00')
    }
    voronoiPoints.push(voronoiPoints[0])
    for(let pts in voronoiPoints){
        this.View.drawEdges(voronoiPoints[pts-1], voronoiPoints[pts], '#ddccaa')
    }
    
}

App.prototype.Triangle = function(edge){
    edge.qedge.label = 1

    p0 = edge.org()
    p1 = edge.dest()
    p2 = edge.lnext().dest()

    this.View.drawEdges(p1, p2, '#aabbcc')
    this.View.drawEdges(p2, p0 ,'#aabbcc')
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
        this.View.drawPoints(delaunayPoints, '#ffddcc')
        for(let pts in delaunayPoints){
            this.View.drawEdges(sites[site], delaunayPoints[pts], '#55dd33')
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

