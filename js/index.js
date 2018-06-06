const Voronoi = require('./Voronoi.js')
const View = require('./View.js')

let sites = [];
let nop = 10;

function App(){
    this.vor = Voronoi()
    this.vor.init(0, window.innerWidth, 0, window.innerHeight)
    this.View = View()
}

App.prototype.draw = function(){
    this.Voronoi()
    this.Delaunay()
//    this.View.render(this.vor)
}

App.prototype.redraw = function(){
//    this.View.ctx.clearRect(0, 0, this.View.canvas.width, this.View.canvas.height);
    this.draw()
}

App.prototype.Voronoi = function(){
    let sites = this.vor.sites
    for(let site in sites){
        voronoiPoints = this.vor.getSiteVoronoi(sites[site])
        console.log(voronoiPoints)
        this.View.drawPoints(voronoiPoints, '#f00')
    }
    
}

App.prototype.Triangle = function(edge){
    edge.qedge.label = 1

    p0 = edge.org()
    p1 = edge.dest()
    p2 = edge.lnext().dest()

//    this.View.drawEdges(p0, p1, '#aabbcc')

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

App.prototype.Delaunay = function(){
    base = this.vor.startEdge
    if(base != undefined)
        this.Triangle(base)

    let sites = this.vor.sites
    for(let site in sites){
        delaunayPoints = this.vor.getSiteDelaunay(sites[site])
        this.View.drawPoints(delaunayPoints, '#ffddcc')
        for(let pts in delaunayPoints){
            this.View.drawEdges(sites[site], delaunayPoints[pts], '#55dd33')
        }
    }
}



window.App =  new App()
window.App.draw()

