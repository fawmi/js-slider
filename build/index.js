"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var slider_1 = require("./slider");
var slider = new slider_1.Slider({
    target: document.querySelector(".slider"),
    dotsWrapper: document.querySelector(".dots-wrapper"),
    arrowLeft: document.querySelector(".arrow-left"),
    arrowRight: document.querySelector(".arrow-right")
});
