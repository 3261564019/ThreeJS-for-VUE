function lerp( x, y, t ) {

    return ( 1 - t ) * x + t * y;

}
function calcPosition({
                          target,
                          offset,
                          theta,
                          deltaX,
                          deltaY,
                          sensitivity,
                          phi,
                          radius,
                          targetRadius,
                          interpolationFactor,
                          maxPhi,
                          minPhi
                      }) {

    theta -= deltaX * (sensitivity.x / 2);
    theta %= 360;
    phi += deltaY * (sensitivity.y / 2);
    phi = Math.min(maxPhi, Math.max(minPhi, phi));


    radius = lerp(radius, targetRadius, interpolationFactor);
    let temp={x:0,y:0,z:0}
    temp.x =
        target.x + radius * Math.sin((theta * Math.PI) / 180) * Math.cos((phi * Math.PI) / 180);
    temp.y =
        target.y + radius * Math.sin((phi * Math.PI) / 180);
    temp.z =
        target.z + radius * Math.cos((theta * Math.PI) / 180) * Math.cos((phi * Math.PI) / 180);

    self.postMessage(temp)
}

self.onmessage=(e=>{
    if(e?.data){
        calcPosition(e.data)
    }
})