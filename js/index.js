const Voronoi = require('./Voronoi.js')
const Site = require('./Point.js')
const View = require('./View.js')

let sites = [];
let nop = 10;
let vor = Voronoi()
let view = View()

function generateRandomPoints(nop){
}
    

function drawDelaunay(){   
    for(var site in sites){
        vor.getSiteDelaunay(sites[site])
    }
}

function drawVoronoi(){
    
}

function init(){
    vor.init(0, window.innerWidth, 0, window.innerHeight)
    console.log(vor);
    view.render(vor)
    sites = vor.randomPoints(nop)
    drawDelaunay(sites);
}

init()
