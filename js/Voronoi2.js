const Graph = require('./Graph.js')
const GP =  require('./gridPoint.js')
const Polygon = require('./Polygon.js')
const Point = require('./Point.js')

function Voronoi2(){
    this.dim = 20
    this.graph = new Graph()
    this.gridPoints = this.randomPoints()

    if(this.numOfSites >= (this.dim - 1)*(this.dim -1)){
	console.log('More sites than gridpoints')
	return
    }

    this.xMin = 0
    this.xMax = this.dim - 1
    this.yMin = 0
    this.yMax = this.dim - 1

    this.init(this.gridPoints[0])
    this.curIndex = 1
}

Voronoi2.prototype.randomPoints = function(){
    let ret = [];
    ret.push(new GP(22, 34, 0))
    ret.push(new GP(80, 50, 0))
    ret.push(new GP(191, 113, 0))
    ret.push(new GP(250, 198, 0))
    ret.push(new GP(50, 44, 0))
    return ret
}

Voronoi2.prototype.init = function(firstGPT){
    gp = new GP()
    initialP = new Polygon(gp.getPointFromGP(firstGPT))
    console.log(initialP)
    initialP.addPoint(new Point(this.xMin, this.yMin))
    console.log(initialP)
}


module.exports = function() { return new Voronoi2(); }
