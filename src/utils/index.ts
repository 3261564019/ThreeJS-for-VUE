/**
 * 防抖函数
 * @param func
 * @param wait
 * @returns {(function(): void)|*}
 */
function debounce(func, wait) {
    let timeout;
    return function () {
        // console.log(this);  //=>从中可以测试出this指向的container
        //保存this
        let _this = this;
        // 清空定时器
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(function () {
            // console.log(this)  //=>这里面的this指向window，也就是前面的count那的this是指向window
            //但是防抖函数的this应该是指向container
            func.apply(_this);

        }, wait)
    }

}


export {debounce}