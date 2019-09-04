"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_listeners_1 = require("./utils/event-listeners");
var Slider = /** @class */ (function () {
    function Slider(_a) {
        var _b = _a.target, target = _b === void 0 ? document.querySelector(".slider") : _b, _c = _a.dotsWrapper, dotsWrapper = _c === void 0 ? document.querySelector(".dots-wrapper") : _c, _d = _a.arrowLeft, arrowLeft = _d === void 0 ? document.querySelector(".arrow-left") : _d, _e = _a.arrowRight, arrowRight = _e === void 0 ? document.querySelector(".arrow-right") : _e, _f = _a.swipe, swipe = _f === void 0 ? true : _f, _g = _a.autoHeight, autoHeight = _g === void 0 ? true : _g, _h = _a.afterChangeSlide, afterChangeSlide = _h === void 0 ? function () {
        } : _h, _j = _a.transition, transition = _j === void 0 ? { speed: 300, easing: "" } : _j;
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
    Slider.prototype.registerEventListeners = function () {
        this.dotsWrapper.addEventListener("click", this.handleDotsClick);
        window.addEventListener("resize", this.updateSliderDimension);
    };
    Slider.prototype.handleDotsClick = function (event) {
        var target = event.target;
        if (target.nodeName === "BUTTON") {
            this.curSlide = parseInt(target.getAttribute("data-slide"));
            this.gotoSlide();
        }
    };
    Slider.prototype.buildDots = function () {
        for (var i = 0; i < this.slidesCount; i++) {
            var dot = document.createElement("li");
            dot.insertAdjacentHTML('beforeend', "<button data-slide=\"" + (i + 1) + "\">slide-" + (i + 1) + "</button>");
            this.dotsWrapper.appendChild(dot);
        }
    };
    Slider.prototype.getCurLeft = function () {
        this.curLeft = parseInt(window.getComputedStyle(this.sliderInner).getPropertyValue('transform').split(',')[4], 10);
    };
    Slider.prototype.gotoSlide = function () {
        var _this = this;
        this.sliderInner.style.transition = "transform " + this.transition.speed + "ms " + this.transition.easing;
        this.sliderInner.style.transform = "translateX(" + -this.curSlide * this.slideW + "px)";
        this.sliderContainer.classList.add('isAnimating');
        setTimeout(function () {
            _this.sliderInner.style.transition = "";
            _this.sliderContainer.classList.remove('isAnimating');
        }, this.transition.speed);
        this.setDot();
        if (this.autoHeight) {
            this.sliderContainer.style.height = this.allSlides[this.curSlide].offsetHeight + "px";
        }
        this.afterChangeSlide(this);
    };
    Slider.prototype.init = function () {
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
            event_listeners_1.addMultiListener({ el: this.sliderInner, events: ['mousedown', 'touchstart'], callback: this.startSwipe });
        }
        this.isAnimating = false;
    };
    Slider.prototype.addSliderInner = function () {
        var nowHTML = this.sliderContainer.innerHTML;
        this.sliderContainer.innerHTML = '<div class="slider-inner">' + nowHTML + "</div>";
    };
    Slider.prototype.addSlideWidth = function () {
        var _this = this;
        this.sliderInner.style.width = (this.slidesCount + 2) * 100 + "%";
        this.allSlides.forEach(function (slide) {
            slide.style.width = 100 / (_this.slidesCount + 2) + "%";
            _this.loadedImg(slide);
        });
    };
    Slider.prototype.appendClones = function () {
        var allSlides = this.sliderInner.querySelectorAll('.slide');
        var cloneFirst = allSlides[0].cloneNode(true);
        this.sliderInner.appendChild(cloneFirst);
        var cloneLast = allSlides[allSlides.length - 1].cloneNode(true);
        this.sliderInner.insertBefore(cloneLast, this.sliderInner.firstChild);
    };
    Slider.prototype.loadedImg = function (el) {
        var _this = this;
        var loaded = false;
        var loadHandler = function () {
            if (loaded) {
                return;
            }
            loaded = true;
            _this.loadedCnt++;
            if (_this.loadedCnt >= _this.slidesCount + 2) {
                _this.updateSliderDimension();
            }
        };
        var img = el.querySelector("img");
        if (img) {
            img.onload = loadHandler;
            img.src = img.getAttribute("data-src");
            img.style.display = "block";
            if (img.complete) {
                loadHandler();
            }
        }
        else {
            this.updateSliderDimension();
        }
    };
    Slider.prototype.startSwipe = function (e) {
        var touch = e;
        this.getCurLeft();
        if (!this.isAnimating) {
            if (e.type === "touchstart") {
                touch = e.targetTouches[0] || e.changedTouches[0];
            }
            this.startX = touch.pageX;
            this.startY = touch.pageY;
            event_listeners_1.addMultiListener({ el: this.sliderInner, events: ['mousemove', 'touchmove'], callback: this.swipeMove });
            event_listeners_1.addMultiListener({ el: document.body, events: ['mouseup', 'touchend'], callback: this.swipeEnd });
        }
    };
    Slider.prototype.swipeMove = function (e) {
        var touch = e;
        if (e.type === "touchmove") {
            touch = e.targetTouches[0] || e.changedTouches[0];
        }
        this.moveX = touch.pageX;
        this.moveY = touch.pageY;
        // for scrolling up and down
        if (Math.abs(this.moveX - this.startX) < 40)
            return;
        this.isAnimating = true;
        this.sliderContainer.classList.add('isAnimating');
        e.preventDefault();
        if (this.curLeft + this.moveX - this.startX > 0 && this.curLeft == 0) {
            this.curLeft = -this.slidesCount * this.slideW;
        }
        else if (this.curLeft + this.moveX - this.startX < -(this.slidesCount + 1) * this.slideW) {
            this.curLeft = -this.slideW;
        }
        this.sliderInner.style.transform = "translateX(" + (this.curLeft + this.moveX - this.startX) + "px)";
    };
    Slider.prototype.swipeEnd = function () {
        this.getCurLeft();
        var xMinusY = Math.abs(this.moveX - this.startX);
        if (xMinusY == 0)
            return;
        this.stayAtCur = xMinusY < 40 || typeof this.moveX == "undefined";
        this.dir = this.startX < this.moveX ? "left" : "right";
        if (!this.stayAtCur) {
            this.dir == "left" ? this.curSlide-- : this.curSlide++;
            if (this.curSlide < 0) {
                this.curSlide = this.slidesCount;
            }
            else if (this.curSlide == this.slidesCount + 2) {
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
        event_listeners_1.removeMultiListener({ el: this.sliderInner, events: ['mousemove', 'touchmove'], callback: this.swipeMove });
        event_listeners_1.removeMultiListener({ el: document.body, events: ['mouseup', 'touchend'], callback: this.swipeEnd });
    };
    Slider.prototype.handleLeftArrowClick = function () {
        var _this = this;
        if (!this.sliderContainer.classList.contains('isAnimating')) {
            if (this.curSlide == 1) {
                this.curSlide = this.slidesCount + 1;
                this.sliderInner.style.transform = "translateX(" + -this.curSlide * this.slideW + "px)";
            }
            this.curSlide--;
            setTimeout(function () {
                _this.gotoSlide();
            }, 20);
        }
    };
    Slider.prototype.handleRightArrowClick = function () {
        var _this = this;
        if (!this.sliderContainer.classList.contains('isAnimating')) {
            if (this.curSlide == this.slidesCount) {
                this.curSlide = 0;
                this.sliderInner.style.transform = "translateX(" + -this.curSlide * this.slideW + "px)";
            }
            this.curSlide++;
            setTimeout(function () {
                _this.gotoSlide();
            }, 20);
        }
    };
    Slider.prototype.initArrows = function () {
        if (this.arrowLeft)
            this.arrowLeft.addEventListener("click", this.handleLeftArrowClick, false);
        if (this.arrowRight)
            this.arrowRight.addEventListener("click", this.handleRightArrowClick, false);
    };
    Slider.prototype.setDot = function () {
        var targetDot = this.curSlide - 1;
        for (var j = 0; j < this.slidesCount; j++) {
            this.dotsWrapper.querySelectorAll("li")[j].classList.remove('active');
        }
        if (this.curSlide - 1 < 0) {
            targetDot = this.slidesCount - 1;
        }
        else if (this.curSlide - 1 > this.slidesCount - 1) {
            targetDot = 0;
        }
        this.dotsWrapper.querySelectorAll("li")[targetDot].classList.add('active');
    };
    Slider.prototype.updateSliderDimension = function () {
        this.slideW = parseInt(this.sliderContainer.querySelectorAll(".slide")[0].offsetWidth, 10);
        this.sliderInner.style.transform = "translateX(" + -this.slideW * this.curSlide + ")px";
        if (this.autoHeight) {
            this.sliderContainer.style.height = this.allSlides[this.curSlide].offsetHeight + "px";
        }
        else {
            for (var i = 0; i < this.slidesCount + 2; i++) {
                if (this.allSlides[i].offsetHeight > this.sliderContainer.offsetHeight) {
                    this.sliderContainer.style.height = this.allSlides[i].offsetHeight + "px";
                }
            }
        }
        this.afterChangeSlide(this);
    };
    return Slider;
}());
exports.Slider = Slider;
