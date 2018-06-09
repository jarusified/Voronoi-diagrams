const App = require('./index.js')
const Site = require('./Point.js')
const Edge = require('./edge.js')
//const Line = require('./Line.js')

function Line(p, q, diff){
    this.a = 0
    this.b = 0
    this.c = 0
    this.set(p, q, diff)
}

Line.prototype.set = function (p, q, diff){
    this.a = diff.y/diff.length()
    this.b = -diff.x/diff.length()
    this.c = -(this.a*p.x + this.b*p.y)
}

Line.prototype.eval = function(p){
    return this.a*p.x + this.b*p.y + this.c;
}

function Voronoi(){
    this.e = 1e-6
    this.nop = 10
    this.sites = []
    this.edges = []
}


Voronoi.prototype.area = function(a, b, c){
    if(a == undefined || b == undefined || c == undefined){
        return -1
    }
    let area =  (b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)
//    console.log("area", a, b, c, area)
    return area
}

Voronoi.prototype.rightOfEdge = function(p, site){
    return this.area(p, site.dest(), site.org()) > 0
}

Voronoi.prototype.leftOfEdge = function(p, site){
    return this.area(p, site.org(), site.dest()) < 0
}


Voronoi.prototype.circumCenter = function(p0, p1, p2){
    let xl = p0.x
    let yl = p0.y
    let xk = p1.x
    let yk = p1.y
    let xm = p2.x
    let ym = p2.y

    let xlk = xl - xk
    let ylk = yl - yk
    let xmk = xm - xk
    let ymk = ym - yk
    let det = xlk * ymk - xmk * ylk

    rlksq = xlk * xlk + ylk * ylk
    rmksq = xmk * xmk + ymk * ymk

    if(det == 0) det = 1
    xcc = (0.5*(rlksq*ymk - rmksq*ylk))/det
    ycc = (0.5*(rmksq*xlk - rlksq*xmk))/det

    return new Site(xcc + xk, ycc + yk)
}


Voronoi.prototype.inCircle = function(a, b, c, d){
    t1 = (a.x*a.x + a.y*a.y)*this.area(b,c,d)
    t2 = (b.x*b.x + b.y*b.y)*this.area(a,c,d)
    t3 = (c.x*c.x + c.y*c.y)*this.area(a,b,d)
    t4 = (d.x*d.x + d.y*d.y)*this.area(a,b,c)

    return (t1 - t2 + t3 - t4) > 0
}

Voronoi.prototype.onEdge = function(p, site){
    org = p.sub(site.org())
    dest = p.sub(site.dest())
    orgDest = site.org().sub(site.dest())    
    t1 = org.length()
    t2 = dest.length()

    console.log("t1111111", t1, t2)

    if(t1 < 0.001 || t2 < 0.001){
        return true;
    }
    t3 = orgDest.length()
    if(t1 > t3 || t2 > t3){
        return false;
    }
    diff = e.dest().sub(e.org())
    console.log(diff)
    console.log(e.org(), e.dest())
    line = new Line(e.org(), e.dest(), diff)
    lineDiff = Math.abs(line.eval(p))
    console.log(lineDiff)
    return lineDiff < 0.00001
}

Voronoi.prototype.connect = function(a, b){
    edge_obj = Edge()
    e = edge_obj.createEdge()
    e.endPoints(a.dest(), b.org())
    edge_obj.splice(e, a.lnext())
    edge_obj.splice(e.sym(), b)
    return e
}

Voronoi.prototype.swap = function(e){
    edge_obj = Edge()
    a = e.oprev()
    b = e.sym().oprev()
    edge_obj.splice(e, a)
    edge_obj.splice(e.sym(), b)
    edge_obj.splice(e, a.lnext())
    edge_obj.splice(e.sym(), b.lnext())
    e.endPoints(a.dest(), b.dest())
    return e;
}


Voronoi.prototype.init = function(minX, maxX, minY, maxY){
    let pts = []
    pts.push(new Site(minX - 1, minY - 1))
    pts.push(new Site(minX - 1, maxY + 1))
    pts.push(new Site(maxX + 1, maxY + 1))
    pts.push(new Site(maxX + 1, minY - 1))
    pts.push(new Site(minX - 1, minY - 1))
    
    this.sites = pts
    
    let edges = []
    let edge_obj = Edge()
    edges[0] = edge_obj.createEdge()
    edges[0].endPoints(pts[1], pts[0])
    for(var i = 1; i < 4; i++){
        edges[i] = edge_obj.createEdge()
        edges[i].endPoints(pts[i+1], pts[i])
        edge_obj.splice(edges[i].sym(), edges[i-1])
    }
    edge_obj.splice(edges[3], edges[0].sym())
    this.startEdge = edges[0]
    this.edges = edges
    console.log("edges", this.edges)
}

Voronoi.prototype.addSite = function(site){
    e = this.locateSite(site)
    
    let edge_obj = Edge()
    if( site == e.org() || site == e.dest()){
        return undefined
    }
    else if(this.onEdge(site, e)){
        e = e.oprev()
        edge_obj.deleteEdge(e.oprev())
    }
    base = edge_obj.createEdge()
    newEdge = base
    base.endPoints(e.org(), site)
    edge_obj.splice(base, e)

    this.startEdge = base
    
    while(1){
        base = this.connect(e, newEdge.sym())
        e = base.oprev()
        if(e.lnext() == this.startEdge){
            break;
        }
    }

    while(1){        
        let temp = e.oprev()
        if(this.rightOfEdge(temp.dest(), e) && this.inCircle(e.org(), temp.dest(), e.dest(), site)){
            e = this.swap(e)
            e = e.oprev()
        }
        else if (e.onext() == this.startEdge){
            break
        }
        else{
            e = e.onext().lprev()
        }
        count += 1
    }

    this.sites.push(site)
    this.edges.push(newEdge)
//    window.App.redraw()
}

Voronoi.prototype.locateSite = function(site){
    console.log("Start edge:", this.startEdge.data)
    e = this.startEdge
    count = 0
    while(true){

        if(count == 10){
            console.log('Site failing', site);
            return e
        }
        
        if(site == e.org() || site == e.dest()){
            return e
        }
        else if(this.rightOfEdge(site, e)){
            e = e.sym()
        }
        else if(!this.rightOfEdge(site, e.onext())){
            console.log('a')
            e = e.onext()
        }
        else if(!this.rightOfEdge(site, e.dprev())){
            console.log('d')
            e = e.dprev()
        }
        else
            return e
        count += 1
    }
}

Voronoi.prototype.getSiteVoronoi = function(site){
    let ret = []
    let location = this.locateSite(site)

     if(!location.org()){
        location = location.sym()
    }

    let temp = location
    while(true){
        p0 = temp.org()
        p1 = temp.dest()
        p2 = temp.lnext().dest()
        newPoint = this.circumCenter(p0, p1, p2)
        ret.push(newPoint)
        temp = temp.onext()
        if( temp == location){
            break;
        }
    }

    return ret;
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
    return ret;
}

Voronoi.prototype.getDelaunay = function(sites){
    return this.getTriangle(this.startEdge)
}

Voronoi.prototype.getVoronoi = function(sites){
    let vor = []
    for(var i = 0; i < sites.length; i++){
        site = sites[i]
        vpList = this.getSiteVoronoi(site)
        for(let i = 0; i < vpList.length; i++){
            let p = vpList[i]
            vor.push({ "x" : p.x, "y" : p.y })
        }
    }
    console.log(vor)
    return vor
}

module.exports = function() { return new Voronoi(); }
