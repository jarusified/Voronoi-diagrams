const Voronoi = require('./Voronoi.js')
const View = require('./View.js')

let sites = [];
let nop = 10;

function App(){
    this.vor = Voronoi()
    this.vor.init(0, window.innerWidth, 0, window.innerHeight)
    this.View = View()
    this.delaunayPoints = null
}

App.prototype.draw = function(){
    this.Delaunay(this.vor)
//    this.View.render(this.vor)
}

App.prototype.redraw = function(){
    this.View.ctx.clearRect(0, 0, this.View.canvas.width, this.View.canvas.height);
    this.draw()
}

App.prototype.Delaunay = function(vor){
    let sites = vor.sites
    for(let site in sites){
        delaunayPoints = vor.getSiteDelaunay(sites[site])
        this.View.drawPoints(delaunayPoints)
        for(let pts in delaunayPoints){
            this.View.drawEdges(sites[site], delaunayPoints[pts])
        }
    }
}

App.prototype.Voronoi = function(){
    
}


window.App =  new App()
window.App.draw()

