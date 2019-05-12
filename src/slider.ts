import {addMultiListener, removeMultiListener} from './utils/event-listeners';
import {ISliderParameters} from './types/slider-parameters.interface';

export class Slider {
    private readonly sliderContainer;
    private dotsWrapper: HTMLElement;
    private readonly arrowLeft: HTMLElement;
    private readonly arrowRight: HTMLElement;
    private readonly swipe: Boolean;
    private readonly autoHeight: Boolean;
    private transition: { speed: any, easing: any };
    private readonly afterChangeSlide: Function;
    private curSlide: number;
    private slidesCount: number;
    private sliderInner: HTMLElement;
    private curLeft: number;
    private slideW: number;
    private allSlides: Array<HTMLElement>;
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
        }: ISliderParameters
    ) {
        this.sliderContainer = target;
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

    private registerEventListeners(): void {
        this.dotsWrapper.addEventListener("click", this.handleDotsClick);
        window.addEventListener("resize", this.updateSliderDimension);
    }

    private handleDotsClick(event: MouseEvent): void {
        let target = event.target as HTMLButtonElement;
        if (target.nodeName === "BUTTON") {
            this.curSlide = parseInt(target.getAttribute("data-slide"));
            this.gotoSlide();
        }
    }

    private buildDots(): void {
        for (let i = 0; i < this.slidesCount; i++) {
            let dot = document.createElement("li");
            dot.insertAdjacentHTML('beforeend', `<button data-slide="${i + 1}">slide-${i + 1}</button>`);
            this.dotsWrapper.appendChild(dot);
        }
    }

    private getCurLeft(): void {
        this.curLeft = parseInt(window.getComputedStyle(this.sliderInner).getPropertyValue('transform').split(',')[4], 10);
    }

    private gotoSlide(): void {
        this.sliderInner.style.transition = `transform ${this.transition.speed}ms ${this.transition.easing}`;
        this.sliderInner.style.transform = `translateX(${-this.curSlide * this.slideW }px)`;
        this.sliderContainer.classList.add('isAnimating');


        setTimeout(() => {
            this.sliderInner.style.transition = "";
            this.sliderContainer.classList.remove('isAnimating');
        }, this.transition.speed);
        this.setDot();
        if (this.autoHeight) {
            this.sliderContainer.style.height = this.allSlides[this.curSlide].offsetHeight + "px";
        }
        this.afterChangeSlide(this);
    }

    private init(): void {
        this.addSliderInner();
        this.curLeft = 0;
        this.sliderInner = this.sliderContainer.querySelector(".slider-inner");
        this.loadedCnt = 0;
        this.curSlide = 1;
        this.appendClones();
        this.allSlides = Array.prototype.slice.call(this.sliderContainer.querySelectorAll(".slide"));
        this.slidesCount = this.allSlides.length;
        this.addSlideWidth();
        this.buildDots();
        this.setDot();
        this.initArrows();

        if (this.swipe) {
            addMultiListener({el: this.sliderInner, events: ['mousedown', 'touchstart'], callback: this.startSwipe});
        }

        this.isAnimating = false;
    }

    private addSliderInner() {
        let nowHTML = this.sliderContainer.innerHTML;
        this.sliderContainer.innerHTML = '<div class="slider-inner">' + nowHTML + "</div>";
    }

    private addSlideWidth(): void {
        this.sliderInner.style.width = (this.slidesCount + 2) * 100 + "%";
        this.allSlides.forEach(slide=> {
            slide.style.width = 100 / (this.slidesCount + 2) + "%";
            this.loadedImg(slide);
        });
    }

    private appendClones(): void {
        let allSlides = this.sliderInner.querySelectorAll('.slide');
        let cloneFirst = allSlides[0].cloneNode(true);
        this.sliderInner.appendChild(cloneFirst);
        let cloneLast = allSlides[allSlides.length - 1].cloneNode(true);
        this.sliderInner.insertBefore(cloneLast, this.sliderInner.firstChild);
    }

    private loadedImg(el): void {
        let loaded = false;
        let loadHandler = () => {
            if (loaded) {
                return;
            }
            loaded = true;
            this.loadedCnt++;
            if (this.loadedCnt >= this.slidesCount + 2) {
                this.updateSliderDimension();
            }
        };
        let img: HTMLImageElement = el.querySelector("img");
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

    private startSwipe(e): any {
        let touch = e;
        this.getCurLeft();
        if (!this.isAnimating) {
            if (e.type === "touchstart") {
                touch = e.targetTouches[0] || e.changedTouches[0];
            }
            this.startX = touch.pageX;
            this.startY = touch.pageY;

            addMultiListener({el: this.sliderInner, events: ['mousemove', 'touchmove'], callback: this.swipeMove});
            addMultiListener({el: document.body, events: ['mouseup', 'touchend'], callback: this.swipeEnd});
        }
    }

    private swipeMove(e): void {
        let touch = e;
        if (e.type === "touchmove") {
            touch = e.targetTouches[0] || e.changedTouches[0];
        }
        this.moveX = touch.pageX;
        this.moveY = touch.pageY;

        // for scrolling up and down
        if (Math.abs(this.moveX - this.startX) < 40) return;

        this.isAnimating = true;
        this.sliderContainer.classList.add('isAnimating');
        e.preventDefault();

        if (this.curLeft + this.moveX - this.startX > 0 && this.curLeft == 0) {
            this.curLeft = -this.slidesCount * this.slideW;
        } else if (this.curLeft + this.moveX - this.startX < -(this.slidesCount + 1) * this.slideW) {
            this.curLeft = -this.slideW;
        }
        this.sliderInner.style.transform = `translateX(${this.curLeft + this.moveX - this.startX}px)`;
    }

    private swipeEnd(): void {
        this.getCurLeft();

        let xMinusY = Math.abs(this.moveX - this.startX);

        if (xMinusY == 0) return;

        this.stayAtCur = xMinusY< 40 || typeof this.moveX == "undefined";
        this.dir = this.startX < this.moveX ? "left" : "right";

        if (!this.stayAtCur) {
            this.dir == "left" ? this.curSlide-- : this.curSlide++;

            if (this.curSlide < 0) {
                this.curSlide = this.slidesCount;
            } else if (this.curSlide == this.slidesCount + 2) {
                this.curSlide = 1;
            }
        }

        this.gotoSlide();

        this.startX = null;
        this.startY = null;
        this.moveX = null;
        this.moveY = null;

        this.isAnimating = false;
        this.sliderContainer.classList.remove('isAnimating');
        removeMultiListener({el: this.sliderInner, events: ['mousemove', 'touchmove'], callback: this.swipeMove});
        removeMultiListener({el: document.body, events: ['mouseup', 'touchend'], callback: this.swipeEnd});
    }

    private handleLeftArrowClick(): void {
        if (!this.sliderContainer.classList.contains('isAnimating')) {
            if (this.curSlide == 1) {
                this.curSlide = this.slidesCount + 1;
                this.sliderInner.style.transform =  `translateX(${-this.curSlide * this.slideW}px)`;
            }
            this.curSlide--;
            setTimeout(() => {
                this.gotoSlide();
            }, 20);
        }
    }

    private handleRightArrowClick(): void {
        if (!this.sliderContainer.classList.contains('isAnimating')) {
            if (this.curSlide == this.slidesCount) {
                this.curSlide = 0;
                this.sliderInner.style.transform = `translateX(${-this.curSlide * this.slideW}px)`;
            }
            this.curSlide++;
            setTimeout(() => {
                this.gotoSlide();
            }, 20);
        }
    }

    private initArrows(): void {
        if (this.arrowLeft) this.arrowLeft.addEventListener("click",this.handleLeftArrowClick, false);
        if (this.arrowRight) this.arrowRight.addEventListener("click", this.handleRightArrowClick, false);
    }

    private setDot(): void {
        let targetDot = this.curSlide - 1;

        for (let j = 0; j < this.slidesCount; j++) {
            this.dotsWrapper.querySelectorAll("li")[j].classList.remove('active');
        }

        if (this.curSlide - 1 < 0) {
            targetDot = this.slidesCount - 1;
        } else if (this.curSlide - 1 > this.slidesCount - 1) {
            targetDot = 0;
        }
        this.dotsWrapper.querySelectorAll("li")[targetDot].classList.add('active')
    }

    private updateSliderDimension(): void {
        this.slideW = parseInt(this.sliderContainer.querySelectorAll(".slide")[0].offsetWidth, 10);
        this.sliderInner.style.transform = `translateX(${-this.slideW * this.curSlide})px`;

        if (this.autoHeight) {
            this.sliderContainer.style.height = this.allSlides[this.curSlide].offsetHeight + "px";
        } else {
            for (let i = 0; i < this.slidesCount + 2; i++) {
                if (this.allSlides[i].offsetHeight > this.sliderContainer.offsetHeight) {
                    this.sliderContainer.style.height = this.allSlides[i].offsetHeight + "px";
                }
            }
        }
        this.afterChangeSlide(this);
    }
}
