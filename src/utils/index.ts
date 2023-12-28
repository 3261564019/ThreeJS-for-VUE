/**
 * 防抖函数
 * @param func
 * @param wait
 * @param This
 * @returns {(function(): void)|*}
 */
function debounce(func:Function, wait:Number,This) {
    let timeout;
    return function (e) {
        // console.log(this);  //=>从中可以测试出this指向的container
        //保存this
        let _this = This;
        // 清空定时器
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(function () {
            //但是防抖函数的this应该是指向container
            func.apply(_this,[e]);
        }, wait)
    }

}

function throttle(fn, interval) {
    // 1.记录上次触发时间，第一次默认为0
    let lastTime = 0

    // 2. 实现节流的处理函数
    return function _throttle(...args) {
        // 3. 获取每次触发当前时间
        const nowTime = new Date().getTime()
        // 4. 获取下次触发节流响应函数的剩余时间
        const restTime = interval - (nowTime - lastTime)
        // 5. 当下次触发响应函数时间小于0时，说明达到节流时间间隔，执行函数
        if(restTime < 0) {
            // 绑定需要节流的时间this，以及传递的参数
            fn.apply(this, args)
            // 保留本次执行后的当前时间，供下次触发时做处理判断
            lastTime = nowTime
        }
    }
}

function timeOut(fn:Function,time:number){
    let timer=setTimeout(()=>{
        fn()
        clearTimeout(timer)
    },time)
}

export {debounce,throttle,timeOut}