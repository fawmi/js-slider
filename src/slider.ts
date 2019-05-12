import {addMultiListener, removeMultiListener} from './utils/event-listeners';

interface SliderParameters {
    target: HTMLElement,
    dotsWrapper?: HTMLElement,
    arrowLeft?: HTMLElement,
    arrowRight?: HTMLElement,
    swipe?: Boolean,
    autoHeight?: Boolean,
    afterChangeSlide?: Function,
    transition?: { speed: 300, easing: "" }
}

export class Slider {
    private readonly target;
    private dotsWrapper: HTMLElement;
    private readonly arrowLeft: HTMLElement;
    private readonly arrowRight: HTMLElement;
    private readonly swipe: Boolean;
    private readonly autoHeight: Boolean;
    private transition: { speed: any, easing: any };
    private readonly afterChangeSlide: Function;
    private curSlide: number;
    private totalSlides: number;
    private sliderInner: HTMLElement;
    private curLeft: number;
    private slideW: number;
    private allSlides: number;
    private loadedCnt: number;
    private startX: number;
    private startY: number;
    private isAnimating: Boolean;
    private moveX: number;
    private moveY: number;
    private stayAtCur: Boolean;
    private dir: string;

    constructor(
        {
            target = document.querySelector(".slider"),
            dotsWrapper = document.querySelector(".dots-wrapper"),
            arrowLeft = document.querySelector(".arrow-left"),
            arrowRight = document.querySelector(".arrow-right"),
            swipe = true,
            autoHeight = true,
            afterChangeSlide = () => {
            },
            transition = {speed: 300, easing: ""}
        }: SliderParameters
    ) {
        this.target = target;
        this.dotsWrapper = dotsWrapper;
        this.arrowLeft = arrowLeft;
        this.arrowRight = arrowRight;
        this.swipe = swipe;
        this.autoHeight = autoHeight;
        this.transition = transition;

        this.afterChangeSlide = afterChangeSlide;
        this.startSwipe = this.startSwipe.bind(this);
        this.swipeEnd = this.swipeEnd.bind(this);
        this.swipeMove = this.swipeMove.bind(this);
        this.updateSliderDimension = this.updateSliderDimension.bind(this);
        this.handleDotsClick = this.handleDotsClick.bind(this);
        this.gotoSlide = this.gotoSlide.bind(this);
        this.handleLeftArrowClick = this.handleLeftArrowClick.bind(this);
        this.handleRightArrowClick = this.handleRightArrowClick.bind(this);

        this.init();
        this.registerEventListeners();
    }

    registerEventListeners(): void {
        this.dotsWrapper.addEventListener("click", this.handleDotsClick);
        window.addEventListener("resize", this.updateSliderDimension);
    }

    handleDotsClick(event) {
        if (event.target.nodeName === "LI") {
            this.curSlide = event.target.getAttribute("data-slide");
            this.gotoSlide();
        }
    }

    buildDots(): void {
        for (let i = 0; i < this.totalSlides; i++) {
            let dot = document.createElement("li");
            dot.setAttribute("data-slide", `${i + 1}`);
            this.dotsWrapper.appendChild(dot);
        }
    }

    getCurLeft(): void {
        this.curLeft = parseInt(window.getComputedStyle(this.sliderInner).getPropertyValue('transform').split(',')[4], 10);
    }

    gotoSlide(): void {
        this.sliderInner.style.transition = `transform ${this.transition.speed}ms ${this.transition.easing}`;
        this.sliderInner.style.transform = `translateX(${-this.curSlide * this.slideW }px)`;
        this.target.classList.add('isAnimating');


        setTimeout(() => {
            this.sliderInner.style.transition = "";
            this.target.classList.remove('isAnimating');
        }, this.transition.speed);
        this.setDot();
        if (this.autoHeight) {
            this.target.style.height = this.allSlides[this.curSlide].offsetHeight + "px";
        }
        this.afterChangeSlide(this);
    }

    init(): void {
        // wrap slider-inner
        let nowHTML = this.target.innerHTML;
        this.target.innerHTML = '<div class="slider-inner">' + nowHTML + "</div>";

        this.allSlides = 0;
        this.curSlide = 0;
        this.curLeft = 0;
        this.totalSlides = this.target.querySelectorAll(".slide").length;

        this.sliderInner = this.target.querySelector(".slider-inner");
        this.loadedCnt = 0;

        // append clones
        let cloneFirst = this.target.querySelectorAll(".slide")[0].cloneNode(true);
        this.sliderInner.appendChild(cloneFirst);
        let cloneLast = this.target.querySelectorAll(".slide")
            [this.totalSlides - 1].cloneNode(true);
        this.sliderInner.insertBefore(cloneLast, this.sliderInner.firstChild);

        this.curSlide++;
        this.allSlides = this.target.querySelectorAll(".slide");

        //_.def.target.style.height = "1px";
        this.sliderInner.style.width = (this.totalSlides + 2) * 100 + "%";
        for (let _i = 0; _i < this.totalSlides + 2; _i++) {
            this.allSlides[_i].style.width = 100 / (this.totalSlides + 2) + "%";
            this.loadedImg(this.allSlides[_i]);
        }

        this.buildDots();
        this.setDot();
        this.initArrows();

        if (this.swipe) {
            addMultiListener(this.sliderInner,
                ['mousedown', 'touchstart'],
                this.startSwipe);
        }

        this.isAnimating = false;
    }

    loadedImg(el) {
        let loaded = false;
        let loadHandler = () => {
            if (loaded) {
                return;
            }
            loaded = true;
            this.loadedCnt++;
            if (this.loadedCnt >= this.totalSlides + 2) {
                this.updateSliderDimension();
            }
        };
        let img = el.querySelector("img");
        if (img) {
            img.onload = loadHandler;
            img.src = img.getAttribute("data-src");
            img.style.display = "block";
            if (img.complete) {
                loadHandler();
            }
        } else {
            this.updateSliderDimension();
        }
    }

    startSwipe(e) {
        let touch = e;
        this.getCurLeft();
        if (!this.isAnimating) {
            if (e.type === "touchstart") {
                touch = e.targetTouches[0] || e.changedTouches[0];
            }
            this.startX = touch.pageX;
            this.startY = touch.pageY;

            addMultiListener(this.sliderInner, ['mousemove', 'touchmove'], this.swipeMove);
            addMultiListener(document.body, ['mouseup', 'touchend'], this.swipeEnd);
        }
    }

    swipeMove(e) {
        let touch = e;
        if (e.type === "touchmove") {
            touch = e.targetTouches[0] || e.changedTouches[0];
        }
        this.moveX = touch.pageX;
        this.moveY = touch.pageY;

        // for scrolling up and down
        if (Math.abs(this.moveX - this.startX) < 40) return;

        this.isAnimating = true;
        this.target.classList.add('isAnimating');
        e.preventDefault();

        if (this.curLeft + this.moveX - this.startX > 0 && this.curLeft == 0) {
            this.curLeft = -this.totalSlides * this.slideW;
        } else if (
            this.curLeft + this.moveX - this.startX <
            -(this.totalSlides + 1) * this.slideW
        ) {
            this.curLeft = -this.slideW;
        }
        this.sliderInner.style.transform = `translateX(${this.curLeft + this.moveX - this.startX}px)`;
    }

    swipeEnd() {
        this.getCurLeft();

        let xMinusY = Math.abs(this.moveX - this.startX);

        if (xMinusY == 0) return;

        this.stayAtCur = xMinusY< 40 || typeof this.moveX == "undefined";
        this.dir = this.startX < this.moveX ? "left" : "right";

        if (!this.stayAtCur) {
            this.dir == "left" ? this.curSlide-- : this.curSlide++;

            if (this.curSlide < 0) {
                this.curSlide = this.totalSlides;
            } else if (this.curSlide == this.totalSlides + 2) {
                this.curSlide = 1;
            }
        }

        this.gotoSlide();

        this.startX = null;
        this.startY = null;
        this.moveX = null;
        this.moveY = null;

        this.isAnimating = false;
        this.target.classList.remove('isAnimating');
        removeMultiListener(this.sliderInner, ['mousemove', 'touchmove'], this.swipeMove);
        removeMultiListener(document.body, ['mouseup', 'touchend'], this.swipeEnd);
    }

    handleLeftArrowClick() {
        if (!this.target.classList.contains('isAnimating')) {
            if (this.curSlide == 1) {
                this.curSlide = this.totalSlides + 1;
                this.sliderInner.style.transform =  `translateX(${-this.curSlide * this.slideW}px)`;
            }
            this.curSlide--;
            setTimeout(() => {
                this.gotoSlide();
            }, 20);
        }
    }

    handleRightArrowClick() {
        if (!this.target.classList.contains('isAnimating')) {
            if (this.curSlide == this.totalSlides) {
                this.curSlide = 0;
                this.sliderInner.style.transform = `translateX(${-this.curSlide * this.slideW}px)`;
            }
            this.curSlide++;
            setTimeout(() => {
                this.gotoSlide();
            }, 20);
        }
    }

    initArrows() {
        if (this.arrowLeft) this.arrowLeft.addEventListener("click",this.handleLeftArrowClick, false);
        if (this.arrowRight) this.arrowRight.addEventListener("click", this.handleRightArrowClick, false);
    }

    setDot() {
        let tardot = this.curSlide - 1;

        for (let j = 0; j < this.totalSlides; j++) {
            this.dotsWrapper.querySelectorAll("li")[j].classList.remove('active');
        }

        if (this.curSlide - 1 < 0) {
            tardot = this.totalSlides - 1;
        } else if (this.curSlide - 1 > this.totalSlides - 1) {
            tardot = 0;
        }
        this.dotsWrapper.querySelectorAll("li")[tardot].classList.add('active')
    }

    updateSliderDimension() {
        this.slideW = parseInt(this.target.querySelectorAll(".slide")[0].offsetWidth, 10);
        this.sliderInner.style.transform = `translateX(${-this.slideW * this.curSlide})px`;

        if (this.autoHeight) {
            this.target.style.height = this.allSlides[this.curSlide].offsetHeight + "px";
        } else {
            for (let i = 0; i < this.totalSlides + 2; i++) {
                if (this.allSlides[i].offsetHeight > this.target.offsetHeight) {
                    this.target.style.height = this.allSlides[i].offsetHeight + "px";
                }
            }
        }
        this.afterChangeSlide(this);
    }
}
