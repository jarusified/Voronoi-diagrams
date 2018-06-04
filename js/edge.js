// eArr contains 4 edges, namely the edge, rot, inv_edge, inv_rot
function quadEdge(){
    this.eArr = [];

    this.eArr[0] = new Edge()
    this.eArr[0].idx = 0;

    this.eArr[1] = new Edge()
    this.eArr[1].idx = 1;

    this.eArr[2] = new Edge()
    this.eArr[2].idx = 2;

    this.eArr[3] = new Edge()
    this.eArr[3].idx = 3;
    
    
    this.eArr[0].next = this.eArr[0]
    this.eArr[1].next = this.eArr[3]
    this.eArr[2].next = this.eArr[2]
    this.eArr[3].next = this.eArr[1]

    this.eArr[0].qedge = this
    this.eArr[1].qedge = this
    this.eArr[2].qedge = this
    this.eArr[3].qedge = this
}

function Edge(){
    this.idx = 0
    this.data = null
    this.next = null
    this.qedge = null
}

Edge.prototype.createEdge = function(){
    return new quadEdge().eArr[0]
}

Edge.prototype.splice = function(a,b){
    alpha = a.onext().rot()
    beta = b.onext().rot()
    t1 = b.onext()
    t2 = a.onext()
    t3 = beta.onext()
    t4 = alpha.onext()
    a.next = t1
    b.next = t2
    alpha.next = t3
    beta.next = t4
}

Edge.prototype.deleteEdge = function(){
    
}

Edge.prototype.rot = function(){
    if(this.idx < 3){
        return this.qedge.eArr[this.idx + 1]
    }
    else{
        return this.qedge.eArr[this.idx - 3]
    }
    
}

Edge.prototype.invrot = function(){
    if(this.idx > 0){
        return this.qedge.eArr[this.idx - 1]
    }
    else{
        return this.qedge.eArr[this.idx + 3]
    }
}

Edge.prototype.sym =  function(){
    if(this.idx < 2){
        return this.qedge.eArr[this.idx + 2]
    }
    else
        return this.qedge.eArr[this.idx - 2]
}
    
Edge.prototype.oprev = function(){
    return this.rot().onext().rot()
}

Edge.prototype.onext = function(){
    return this.next
}

Edge.prototype.oprev = function(){
    return this.rot().onext().rot()
}

Edge.prototype.dnext = function(){
    return this.sym().onext().sym()
}

Edge.prototype.dprev = function(){
    return this.invrot().onext().invrot()
}

Edge.prototype.lnext = function(){
    return this.invrot().onext().rot()
}

Edge.prototype.lprev = function(){
    return this.onext().sym()
}

Edge.prototype.rnext = function(){
    return this.rot().onext().invrot()
}

Edge.prototype.rprev = function(){
    return this.sym().onext()
}

Edge.prototype.org = function(){
    return this.data
}

Edge.prototype.dest = function(){
    return this.sym().data
}

Edge.prototype.endPoints = function(org, dst){
    this.data = org
    this.sym().data = dst
}

module.exports = function() { return new Edge(); }
