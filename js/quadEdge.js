const Edge = require('./edge.js')

console.log(Edge)

// eArr contains 4 edges, namely the edge, rot, inv_edge, inv_rot
function quadEdge(){
    this.eArr = [];

    this.eArr[0] = Edge()
    this.eArr[0]._idx = 0;

    this.eArr[1] = {}
    this.eArr[1]._idx = 1;

    this.eArr[2] = {}
    this.eArr[2]._idx = 2;

    this.eArr[3] = {}
    this.eArr[3]._idx = 3;
    
    
    this.eArr[0].next = this.eArr[0]
    this.eArr[1].next = this.eArr[3]
    this.eArr[2].next = this.eArr[2]
    this.eArr[3].next = this.eArr[1]
    return this
}



module.exports = quadEdge
