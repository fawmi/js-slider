export function buildDots(dotsWrapper): void {
    for (let i = 0; i < this.totalSlides; i++) {
        let dot = document.createElement("li");
        dot.setAttribute("data-slide", `${i + 1}`);
        dotsWrapper.appendChild(dot);
    }
}

export function setDot(currentSlide, totalSlides, dotsWrapper) {
    let tardot = currentSlide - 1;

    for (let j = 0; j < totalSlides; j++) {
        dotsWrapper.querySelectorAll("li")[j].classList.remove('active');
    }

    if (currentSlide - 1 < 0) {
        tardot = this.totalSlides - 1;
    } else if (this.curSlide - 1 > totalSlides - 1) {
        tardot = 0;
    }
    dotsWrapper.querySelectorAll("li")[tardot].classList.add('active')
}
