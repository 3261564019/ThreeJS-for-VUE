varying vec2 vUv;

float remap(float value,float originMin,float originMax,float destinationMin,float destinationMax){
    return destinationMin + (value - originMin) * (destinationMax -destinationMin)/(originMax - originMin);
}

void main() {

    float f=distance(vUv,vec2(0.5));

    f=remap(f,0.0,0.5,0.0,1.0);

    f=pow(f,3.0);

    gl_FragColor = vec4(vec3(f),1.0);
}
