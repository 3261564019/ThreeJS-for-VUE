
/**
 * 创建一个闭合范围的模型数据
 * @param arr
 * @param height
 */
export function generateVecData (arr,height=50) {
    const vec3List = [] // 顶点数组
    let faceList = [] // 三角面数组
    let faceVertexUvs = [] // 面的UV层队列，用于纹理和几何信息映射
    // t3---t2
    // |  \  |
    // t0---t1
    // UV面
    // 下三角[t0, t1, t3]
    // 上三角[t3, t1, t2]
    const t0 = [0, 0]
    const t1 = [1, 0]
    const t2 = [1, 1]
    const t3 = [0, 1]

    for (let i = 0; i < arr.length; i++) {
        const [x1, y1] = arr[i]
        vec3List.push([x1, y1, 0])
        vec3List.push([x1, y1, height])
    }

    // 1---3
    // | \ |
    // 0---2
    // 三角面顶点，没有顺序要求，但要跟UV面顺序一致
    // 下三角 [0,1,2]
    // 上三角 [1,2,3]
    for (let i = 0; i < vec3List.length - 2; i++) {
        if (i % 2 === 0) {
            // 下三角
            faceList = [...faceList, ...vec3List[i], ...vec3List[i + 2], ...vec3List[i + 1]]
            // UV
            faceVertexUvs = [...faceVertexUvs, ...t0, ...t1, ...t3]
        } else {
            // 上三角
            faceList = [...faceList, ...vec3List[i], ...vec3List[i + 1], ...vec3List[i + 2]]
            // UV
            faceVertexUvs = [...faceVertexUvs, ...t3, ...t1, ...t2]
        }
    }

    return {
        face: faceList,
        uvs: faceVertexUvs
    }
}

export function hexToRgba (hex, opacity = 1) {
    return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' +
        parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')'
}

export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

