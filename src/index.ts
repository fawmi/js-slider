import './index.scss'
import {Slider} from './utils/slider';

let slider = new Slider({
    target: document.querySelector(".slider"),
    dotsWrapper: document.querySelector(".dots-wrapper"),
    arrowLeft: document.querySelector(".arrow-left"),
    arrowRight: document.querySelector(".arrow-right")
});
