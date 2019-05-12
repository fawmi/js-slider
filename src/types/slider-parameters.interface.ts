export interface ISliderParameters {
    target: HTMLElement,
    dotsWrapper?: HTMLElement,
    arrowLeft?: HTMLElement,
    arrowRight?: HTMLElement,
    swipe?: Boolean,
    autoHeight?: Boolean,
    afterChangeSlide?: Function,
    transition?: { speed: 300, easing: "" }
}
