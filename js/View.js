const App = require('./index.js')
const Site = require('./Point.js')

function View(){
    this.canvas = document.createElement('canvas')
    this.canvas.style.cssText = "width: 100%; height: 100%; z-index: 0; margin: 0px; padding: 0px; background: black; border: none; display:block;";
    parentDiv = document.body;
    parentDiv.appendChild(this.canvas)

    this.ctx = this.canvas.getContext('2d')
    if(!this.ctx) return
    
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    
    this.ctx.fillStyle = '#fff'
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fill()
    this.ctx.strokeStyle = '#999'
    this.ctx.stroke()

    this.drawBackground()

    
    this.canvas.onclick = function(e){
        if(!e)
            e = this.event

        let x = 0
        let y = 0

        if(e.pageX || e.pageY){
            x = e.pageX
            y = e.pageY
        }
        else if (e.clientX || e.clientY) {
            x = e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
            y = e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
        }
        window.App.vor.addSite(new Site(x, y))
    }
}

View.prototype.drawBackground = function(){
    this.ctx.globalAlpha = 1;
    this.ctx.beginPath();
    this.ctx.rect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();
    this.ctx.strokeStyle = '#999';
    this.ctx.stroke();
}

View.prototype.drawPoints = function(sites, color){
    this.ctx.beginPath()    
    for(let i = 0; i < sites.length; i++){
        let site = sites[i]
        this.ctx.rect(site.x - 0.25, site.y - 0.25, 5, 5);
    }
    this.ctx.globalAlpha = 1
    if(color)
        this.ctx.fillStyle = color
    else
        this.ctx.fillStyle = '#aabbcc'
    this.ctx.fill()
}

View.prototype.drawEdges = function(org, dest, color){
    this.ctx.beginPath();
    this.ctx.lineWidth=0.5;
    this.ctx.globalAlpha=1;
    if (org === undefined || dest === undefined){
        return;
    }
    this.ctx.moveTo(org.x,org.y)
    this.ctx.lineTo(dest.x, dest.y);
    if(color){
        this.ctx.strokeStyle = color
    }
    else{
        this.ctx.strokeStyle='#0ff';
    }
    this.ctx.stroke();
}

View.prototype.render = function(vor){
    this.drawBackground()
    this.drawSites(vor)
    this.drawEdges(vor)
}

module.exports = function() { return new View(); }
