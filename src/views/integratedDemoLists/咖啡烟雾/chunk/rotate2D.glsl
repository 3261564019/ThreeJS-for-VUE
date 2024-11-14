vec2 rotate2D(vec2 v, float a) {
    mat2 m = mat2(cos(a), -sin(a), sin(a), cos(a));
    return m * v;
}