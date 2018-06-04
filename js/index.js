const Voronoi = require('./Voronoi.js')
const Compute = require('./Compute.js')
const View = require('./View.js')

let sites = [];
let nop = 10;

function App(){
    this.vor = Voronoi()
    this.View = View()
    this.vor.init(0, window.innerWidth, 0, window.innerHeight)
}

App.prototype.draw = function(){
    Compute.Delaunay(this.vor)
    this.View.render(this.vor)
}

App.prototype.redraw = function(){
    this.View.ctx.clearRect(0, 0, this.View.canvas.width, this.View.canvas.height);
    this.draw()
}

window.App =  new App()
window.App.draw()

