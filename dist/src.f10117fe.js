// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/index.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/utils/event-listeners.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function addMultiListener(_a) {
  var el = _a.el,
      events = _a.events,
      callback = _a.callback;
  events.forEach(function (e) {
    return el.addEventListener(e, callback, false);
  });
}

exports.addMultiListener = addMultiListener;

function removeMultiListener(_a) {
  var el = _a.el,
      events = _a.events,
      callback = _a.callback;
  events.forEach(function (e) {
    return el.removeEventListener(e, callback, false);
  });
}

exports.removeMultiListener = removeMultiListener;
},{}],"src/slider.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var event_listeners_1 = require("./utils/event-listeners");

var Slider =
/** @class */
function () {
  function Slider(_a) {
    var _b = _a.target,
        target = _b === void 0 ? document.querySelector(".slider") : _b,
        _c = _a.dotsWrapper,
        dotsWrapper = _c === void 0 ? document.querySelector(".dots-wrapper") : _c,
        _d = _a.arrowLeft,
        arrowLeft = _d === void 0 ? document.querySelector(".arrow-left") : _d,
        _e = _a.arrowRight,
        arrowRight = _e === void 0 ? document.querySelector(".arrow-right") : _e,
        _f = _a.swipe,
        swipe = _f === void 0 ? true : _f,
        _g = _a.autoHeight,
        autoHeight = _g === void 0 ? true : _g,
        _h = _a.afterChangeSlide,
        afterChangeSlide = _h === void 0 ? function () {} : _h,
        _j = _a.transition,
        transition = _j === void 0 ? {
      speed: 300,
      easing: ""
    } : _j;
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
      event_listeners_1.addMultiListener({
        el: this.sliderInner,
        events: ['mousedown', 'touchstart'],
        callback: this.startSwipe
      });
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

    var loadHandler = function loadHandler() {
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
    } else {
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
      event_listeners_1.addMultiListener({
        el: this.sliderInner,
        events: ['mousemove', 'touchmove'],
        callback: this.swipeMove
      });
      event_listeners_1.addMultiListener({
        el: document.body,
        events: ['mouseup', 'touchend'],
        callback: this.swipeEnd
      });
    }
  };

  Slider.prototype.swipeMove = function (e) {
    var touch = e;

    if (e.type === "touchmove") {
      touch = e.targetTouches[0] || e.changedTouches[0];
    }

    this.moveX = touch.pageX;
    this.moveY = touch.pageY; // for scrolling up and down

    if (Math.abs(this.moveX - this.startX) < 40) return;
    this.isAnimating = true;
    this.sliderContainer.classList.add('isAnimating');
    e.preventDefault();

    if (this.curLeft + this.moveX - this.startX > 0 && this.curLeft == 0) {
      this.curLeft = -this.slidesCount * this.slideW;
    } else if (this.curLeft + this.moveX - this.startX < -(this.slidesCount + 1) * this.slideW) {
      this.curLeft = -this.slideW;
    }

    this.sliderInner.style.transform = "translateX(" + (this.curLeft + this.moveX - this.startX) + "px)";
  };

  Slider.prototype.swipeEnd = function () {
    this.getCurLeft();
    var xMinusY = Math.abs(this.moveX - this.startX);
    if (xMinusY == 0) return;
    this.stayAtCur = xMinusY < 40 || typeof this.moveX == "undefined";
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
    event_listeners_1.removeMultiListener({
      el: this.sliderInner,
      events: ['mousemove', 'touchmove'],
      callback: this.swipeMove
    });
    event_listeners_1.removeMultiListener({
      el: document.body,
      events: ['mouseup', 'touchend'],
      callback: this.swipeEnd
    });
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
    if (this.arrowLeft) this.arrowLeft.addEventListener("click", this.handleLeftArrowClick, false);
    if (this.arrowRight) this.arrowRight.addEventListener("click", this.handleRightArrowClick, false);
  };

  Slider.prototype.setDot = function () {
    var targetDot = this.curSlide - 1;

    for (var j = 0; j < this.slidesCount; j++) {
      this.dotsWrapper.querySelectorAll("li")[j].classList.remove('active');
    }

    if (this.curSlide - 1 < 0) {
      targetDot = this.slidesCount - 1;
    } else if (this.curSlide - 1 > this.slidesCount - 1) {
      targetDot = 0;
    }

    this.dotsWrapper.querySelectorAll("li")[targetDot].classList.add('active');
  };

  Slider.prototype.updateSliderDimension = function () {
    this.slideW = parseInt(this.sliderContainer.querySelectorAll(".slide")[0].offsetWidth, 10);
    this.sliderInner.style.transform = "translateX(" + -this.slideW * this.curSlide + ")px";

    if (this.autoHeight) {
      this.sliderContainer.style.height = this.allSlides[this.curSlide].offsetHeight + "px";
    } else {
      for (var i = 0; i < this.slidesCount + 2; i++) {
        if (this.allSlides[i].offsetHeight > this.sliderContainer.offsetHeight) {
          this.sliderContainer.style.height = this.allSlides[i].offsetHeight + "px";
        }
      }
    }

    this.afterChangeSlide(this);
  };

  return Slider;
}();

exports.Slider = Slider;
},{"./utils/event-listeners":"src/utils/event-listeners.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./index.scss");

var slider_1 = require("./slider");

var slider = new slider_1.Slider({
  target: document.querySelector(".slider"),
  dotsWrapper: document.querySelector(".dots-wrapper"),
  arrowLeft: document.querySelector(".arrow-left"),
  arrowRight: document.querySelector(".arrow-right")
});
},{"./index.scss":"src/index.scss","./slider":"src/slider.ts"}],"../../.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53671" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map