function extend(obj, src){
    for(let key in src){
        if(src.hasOwnProperty(key)){
            obj[key] = src[key]
        }
    }
    return obj
}

module.exports = extend
