const Point = require('./Point.js')

function CompGeo(){

}

CompGeo.prototype.getIntersectionOfSegmentAndLine = function(p1, p2, p3, p4){    
    let denominator = (p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y)
   //  console.log(denominator)
    if(denominator == 0){
	return null
    }

    let ua = (p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)
    let ub = (p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)

//    console.log(ua, ub)
    
    ua = ua/denominator
    ub = ub/denominator

    if( ua >= 0 && ua <=1){
	return new Point(p1.x + ua*(p2.x - p1.x), p1.y + ua*(p2.y - p1.y))
    }
    else
	return null
}

CompGeo.prototype.getIntersectionOfSegmentAndBisector = function(p1, p2, edge){
    let p3 = edge.getA()
    let p4 = edge.getB()
    let midPoint = new Point((p1.x + p2.x)/2, (p1.y + p2.y)/2)

//    console.log(p1, p2, p3, p4)
    
    if(Math.abs(p1.y - p2.y) <= 0.0001){
	x = (p1.x + p2.x)/2
	y = p1.y + 0.5
    }
    else if(Math.abs(p1.x - p2.x) <= 0.0001){
	x = (p1.x + 0.5)
	y = (p1.y + p2.y)/2
    }
    else{
	slope = -1*(p2.x - p1.x)/(p2.y - p1.y)
//	console.log("slope is ", slope)
//	console.log("midPoint", midPoint)
	x = midPoint.x + 0.5
	y = midPoint.y + slope*(x - midPoint.x)
    }

    let anotherBisector = new Point(x,y)
    ret = this.getIntersectionOfSegmentAndLine(p3, p4, midPoint, anotherBisector)
    return ret;
}

module.exports = function() { return new CompGeo(); } 
