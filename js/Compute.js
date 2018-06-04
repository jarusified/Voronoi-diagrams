function Delaunay(vor){
    let sites = vor.sites
    for(let site in sites){
        vor.getSiteDelaunay(sites[site])
    }
}

function Voronoi(){
    
}


module.exports = {
    Delaunay,
    Voronoi
}
