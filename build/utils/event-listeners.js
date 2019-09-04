"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addMultiListener(_a) {
    var el = _a.el, events = _a.events, callback = _a.callback;
    events.forEach(function (e) { return el.addEventListener(e, callback, false); });
}
exports.addMultiListener = addMultiListener;
function removeMultiListener(_a) {
    var el = _a.el, events = _a.events, callback = _a.callback;
    events.forEach(function (e) { return el.removeEventListener(e, callback, false); });
}
exports.removeMultiListener = removeMultiListener;
