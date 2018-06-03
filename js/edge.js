// eArr contains 4 edges, namely the edge, rot, inv_edge, inv_rot
function quadEdge(){
    eArr = [];

    eArr[0] = new Edge()
    eArr[0].idx = 0;

    eArr[1] = new Edge()
    eArr[1].idx = 1;

    eArr[2] = new Edge()
    eArr[2].idx = 2;

    eArr[3] = new Edge()
    eArr[3].idx = 3;
    
    
    eArr[0].next = eArr[0]
    eArr[1].next = eArr[3]
    eArr[2].next = eArr[2]
    eArr[3].next = eArr[1]

    eArr[0].qedge = eArr
    eArr[1].qedge = eArr
    eArr[2].qedge = eArr
    eArr[3].qedge = eArr
    
    return eArr;
}

function Edge(){
    this.idx = 0
    this.data = null
    this.next = null
    this.qedge = null
}

Edge.prototype.createEdge = function(){
    return quadEdge()[0]
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
    console.log(t1, t2, t3, t4)
}

Edge.prototype.deleteEdge = function(){
    
}

Edge.prototype.rot = function(){
    if(this.idx < 3){
        return this.qedge[this.idx + 1]
    }
    else{
        return this.qedge[this.idx - 3]
    }
    
}

Edge.prototype.invrot = function(){
    if(this.idx > 0){
        return this.qedge[this.idx - 1]
    }
    else{
        return this.qedge[this.idx + 3]
    }
}

Edge.prototype.sym =  function(){
    if(this.idx < 2){
        return this.qedge[this.idx + 2]
    }
    else
        return this.qedge[this.idx - 2]
}
    
Edge.prototype.oprev = function(){
    return this.rot().onext().rot()
}

Edge.prototype.onext = function(){
    return this.next
}

Edge.prototype.endPoints = function(org, dst){
    this.data = org
    this.sym().data = dst
}

module.exports = function() { return new Edge(); }
