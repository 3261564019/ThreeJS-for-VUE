class PointerLock {
    private _element: HTMLElement;

    private lastRequest:number=0;

    private locking:boolean=false
    constructor(_element: HTMLElement, autoLock = true) {
        this._element = _element;
        if (autoLock) {
            this.request();
        }
    }

    isLocked(): boolean {
        return!!document.pointerLockElement;
    }

    exit(): void {
        this.locking = false;
        document.exitPointerLock();
        this.removeListeners();
    }

    removeListeners(): void {
        document.removeEventListener('pointerlockchange', () => this.pointerLockChangeHandler());
        this._element.removeEventListener('pointerdown', () => this.pointerDownHandlerHandler());
    }

    pointerLockChangeHandler(): void {

        this.lastRequest=performance.now()

        if(!this.isLocked()){
            this.locking=false
        }
        console.log("pointerLockChangeHandler切换",this.locking)
    }

    pointerDownHandlerHandler(): void {
        if (this.locking) {
            return;
        }else{
            let now=performance.now()
            // console.log("请求1",now,this.lastRequest)
            let gap=now - this.lastRequest
            console.log("now - this.lastRequest",gap)
            //如果两次请求间隔小于3s
            if(
                (now>1500) && ( gap < 1500)){
                console.warn("请求频繁")
            }else{

                this._element.requestPointerLock();
                this.locking=true;
                this.lastRequest=now
            }
        }
    }

    request(): void {
        this._request();
    }

    private _request(): void {
        document.addEventListener('pointerlockchange', () => this.pointerLockChangeHandler(), false);
        if (document.pointerLockElement) {
            return;
        }
        this._element.addEventListener('pointerdown', () => this.pointerDownHandlerHandler(), false);
    }
}

export { PointerLock };
