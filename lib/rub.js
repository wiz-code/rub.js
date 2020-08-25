(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Rub"] = factory();
	else
		root["Rub"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/javascript-state-machine/state-machine.js":
/*!****************************************************************!*\
  !*** ./node_modules/javascript-state-machine/state-machine.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*

  Javascript State Machine Library - https://github.com/jakesgordon/javascript-state-machine

  Copyright (c) 2012, 2013, 2014, 2015, Jake Gordon and contributors
  Released under the MIT license - https://github.com/jakesgordon/javascript-state-machine/blob/master/LICENSE

*/

(function () {

  var StateMachine = {

    //---------------------------------------------------------------------------

    VERSION: "2.4.0",

    //---------------------------------------------------------------------------

    Result: {
      SUCCEEDED:    1, // the event transitioned successfully from one state to another
      NOTRANSITION: 2, // the event was successfull but no state transition was necessary
      CANCELLED:    3, // the event was cancelled by the caller in a beforeEvent callback
      PENDING:      4  // the event is asynchronous and the caller is in control of when the transition occurs
    },

    Error: {
      INVALID_TRANSITION: 100, // caller tried to fire an event that was innapropriate in the current state
      PENDING_TRANSITION: 200, // caller tried to fire an event while an async transition was still pending
      INVALID_CALLBACK:   300 // caller provided callback function threw an exception
    },

    WILDCARD: '*',
    ASYNC: 'async',

    //---------------------------------------------------------------------------

    create: function(cfg, target) {

      var initial      = (typeof cfg.initial == 'string') ? { state: cfg.initial } : cfg.initial; // allow for a simple string, or an object with { state: 'foo', event: 'setup', defer: true|false }
      var terminal     = cfg.terminal || cfg['final'];
      var fsm          = target || cfg.target  || {};
      var events       = cfg.events || [];
      var callbacks    = cfg.callbacks || {};
      var map          = {}; // track state transitions allowed for an event { event: { from: [ to ] } }
      var transitions  = {}; // track events allowed from a state            { state: [ event ] }

      var add = function(e) {
        var from = Array.isArray(e.from) ? e.from : (e.from ? [e.from] : [StateMachine.WILDCARD]); // allow 'wildcard' transition if 'from' is not specified
        map[e.name] = map[e.name] || {};
        for (var n = 0 ; n < from.length ; n++) {
          transitions[from[n]] = transitions[from[n]] || [];
          transitions[from[n]].push(e.name);

          map[e.name][from[n]] = e.to || from[n]; // allow no-op transition if 'to' is not specified
        }
        if (e.to)
          transitions[e.to] = transitions[e.to] || [];
      };

      if (initial) {
        initial.event = initial.event || 'startup';
        add({ name: initial.event, from: 'none', to: initial.state });
      }

      for(var n = 0 ; n < events.length ; n++)
        add(events[n]);

      for(var name in map) {
        if (map.hasOwnProperty(name))
          fsm[name] = StateMachine.buildEvent(name, map[name]);
      }

      for(var name in callbacks) {
        if (callbacks.hasOwnProperty(name))
          fsm[name] = callbacks[name]
      }

      fsm.current     = 'none';
      fsm.is          = function(state) { return Array.isArray(state) ? (state.indexOf(this.current) >= 0) : (this.current === state); };
      fsm.can         = function(event) { return !this.transition && (map[event] !== undefined) && (map[event].hasOwnProperty(this.current) || map[event].hasOwnProperty(StateMachine.WILDCARD)); }
      fsm.cannot      = function(event) { return !this.can(event); };
      fsm.transitions = function()      { return (transitions[this.current] || []).concat(transitions[StateMachine.WILDCARD] || []); };
      fsm.isFinished  = function()      { return this.is(terminal); };
      fsm.error       = cfg.error || function(name, from, to, args, error, msg, e) { throw e || msg; }; // default behavior when something unexpected happens is to throw an exception, but caller can override this behavior if desired (see github issue #3 and #17)
      fsm.states      = function() { return Object.keys(transitions).sort() };

      if (initial && !initial.defer)
        fsm[initial.event]();

      return fsm;

    },

    //===========================================================================

    doCallback: function(fsm, func, name, from, to, args) {
      if (func) {
        try {
          return func.apply(fsm, [name, from, to].concat(args));
        }
        catch(e) {
          return fsm.error(name, from, to, args, StateMachine.Error.INVALID_CALLBACK, "an exception occurred in a caller-provided callback function", e);
        }
      }
    },

    beforeAnyEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbeforeevent'],                       name, from, to, args); },
    afterAnyEvent:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafterevent'] || fsm['onevent'],      name, from, to, args); },
    leaveAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleavestate'],                        name, from, to, args); },
    enterAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenterstate'] || fsm['onstate'],      name, from, to, args); },
    changeState:     function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onchangestate'],                       name, from, to, args); },

    beforeThisEvent: function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbefore' + name],                     name, from, to, args); },
    afterThisEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafter'  + name] || fsm['on' + name], name, from, to, args); },
    leaveThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleave'  + from],                     name, from, to, args); },
    enterThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenter'  + to]   || fsm['on' + to],   name, from, to, args); },

    beforeEvent: function(fsm, name, from, to, args) {
      if ((false === StateMachine.beforeThisEvent(fsm, name, from, to, args)) ||
          (false === StateMachine.beforeAnyEvent( fsm, name, from, to, args)))
        return false;
    },

    afterEvent: function(fsm, name, from, to, args) {
      StateMachine.afterThisEvent(fsm, name, from, to, args);
      StateMachine.afterAnyEvent( fsm, name, from, to, args);
    },

    leaveState: function(fsm, name, from, to, args) {
      var specific = StateMachine.leaveThisState(fsm, name, from, to, args),
          general  = StateMachine.leaveAnyState( fsm, name, from, to, args);
      if ((false === specific) || (false === general))
        return false;
      else if ((StateMachine.ASYNC === specific) || (StateMachine.ASYNC === general))
        return StateMachine.ASYNC;
    },

    enterState: function(fsm, name, from, to, args) {
      StateMachine.enterThisState(fsm, name, from, to, args);
      StateMachine.enterAnyState( fsm, name, from, to, args);
    },

    //===========================================================================

    buildEvent: function(name, map) {
      return function() {

        var from  = this.current;
        var to    = map[from] || (map[StateMachine.WILDCARD] != StateMachine.WILDCARD ? map[StateMachine.WILDCARD] : from) || from;
        var args  = Array.prototype.slice.call(arguments); // turn arguments into pure array

        if (this.transition)
          return this.error(name, from, to, args, StateMachine.Error.PENDING_TRANSITION, "event " + name + " inappropriate because previous transition did not complete");

        if (this.cannot(name))
          return this.error(name, from, to, args, StateMachine.Error.INVALID_TRANSITION, "event " + name + " inappropriate in current state " + this.current);

        if (false === StateMachine.beforeEvent(this, name, from, to, args))
          return StateMachine.Result.CANCELLED;

        if (from === to) {
          StateMachine.afterEvent(this, name, from, to, args);
          return StateMachine.Result.NOTRANSITION;
        }

        // prepare a transition method for use EITHER lower down, or by caller if they want an async transition (indicated by an ASYNC return value from leaveState)
        var fsm = this;
        this.transition = function() {
          fsm.transition = null; // this method should only ever be called once
          fsm.current = to;
          StateMachine.enterState( fsm, name, from, to, args);
          StateMachine.changeState(fsm, name, from, to, args);
          StateMachine.afterEvent( fsm, name, from, to, args);
          return StateMachine.Result.SUCCEEDED;
        };
        this.transition.cancel = function() { // provide a way for caller to cancel async transition if desired (issue #22)
          fsm.transition = null;
          StateMachine.afterEvent(fsm, name, from, to, args);
        }

        var leave = StateMachine.leaveState(this, name, from, to, args);
        if (false === leave) {
          this.transition = null;
          return StateMachine.Result.CANCELLED;
        }
        else if (StateMachine.ASYNC === leave) {
          return StateMachine.Result.PENDING;
        }
        else {
          if (this.transition) // need to check in case user manually called transition() but forgot to return StateMachine.ASYNC
            return this.transition();
        }

      };
    }

  }; // StateMachine

  //===========================================================================

  //======
  // NODE
  //======
  if (true) {
    if ( true && module.exports) {
      exports = module.exports = StateMachine;
    }
    exports.StateMachine = StateMachine;
  }
  //============
  // AMD/REQUIRE
  //============
  else {}

}());


/***/ }),

/***/ "./src/dataset.ts":
/*!************************!*\
  !*** ./src/dataset.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var dataset = {
    pointer: {
        initial: 'created',
        events: [
            { name: 'initialize', from: 'created', to: 'idling' },
            { name: 'start', from: 'idling', to: 'running' },
            { name: 'end', from: 'running', to: 'idling' },
        ],
    },
    target: {
        initial: 'created',
        events: [
            { name: 'initialize', from: 'created', to: 'inactive' },
            { name: 'activate', from: 'inactive', to: 'active' },
            { name: 'inactivate', from: 'active', to: 'inactive' },
        ],
    },
    media: {
        initial: 'created',
        events: [
            { name: 'initialize', from: 'created', to: 'initialized' },
            { name: 'ready', from: 'initialized', to: 'idling' },
            { name: 'reset', from: ['idling', 'error'], to: 'initialized' },
            { name: 'start', from: 'idling', to: 'running' },
            { name: 'stop', from: 'running', to: 'idling' },
            { name: 'pause', from: 'running', to: 'pending' },
            { name: 'resume', from: 'pending', to: 'running' },
            { name: 'quit', from: 'pending', to: 'idling' },
            { name: 'abort', from: '*', to: 'error' },
        ],
    },
};
/* harmony default export */ __webpack_exports__["default"] = (dataset);


/***/ }),

/***/ "./src/event-type.ts":
/*!***************************!*\
  !*** ./src/event-type.ts ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var EventType = /** @class */ (function () {
    function EventType() {
    }
    EventType.MouseDown = 'mousedown';
    EventType.MouseUp = 'mouseup';
    EventType.MouseMove = 'mousemove';
    EventType.MouseEnter = 'mouseenter';
    EventType.MouseLeave = 'mouseleave';
    EventType.Click = 'click';
    EventType.DoubleClick = 'dblclick';
    EventType.ContextMenu = 'contextmenu';
    EventType.TouchStart = 'touchstart';
    EventType.TouchEnd = 'touchend';
    EventType.TouchMove = 'touchmove';
    EventType.TouchCancel = 'touchcancel';
    return EventType;
}());
/* harmony default export */ __webpack_exports__["default"] = (EventType);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! javascript-state-machine */ "./node_modules/javascript-state-machine/state-machine.js");
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mouse_handler_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mouse-handler.ts */ "./src/mouse-handler.ts");
/* harmony import */ var _touch_handler_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./touch-handler.ts */ "./src/touch-handler.ts");
/* harmony import */ var _recorder_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./recorder.ts */ "./src/recorder.ts");
/* harmony import */ var _dataset_ts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dataset.ts */ "./src/dataset.ts");





var MIN_INTERVAL = 4;
var BOUNDS_ID = 'rb-bounds';
var abs = Math.abs, max = Math.max;
function isTouchEnabled() {
    return ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0);
}
function getVelocity(dt, dx, dy) {
    if (dt > 0) {
        return max(abs(dx / dt), abs(dy / dt));
    }
    return 0;
}
var id = 0;
function genId() {
    id += 1;
    return id;
}
var Rub = /** @class */ (function () {
    function Rub(container, callback) {
        var _this = this;
        this.container = container;
        this.bounds = new Map();
        this.inputId = 0;
        this.outputId = 0;
        this.loopCallbacks = [];
        this.offset = 0;
        this.t0 = 0;
        this.x0 = 0;
        this.y0 = 0;
        this.id = genId();
        var boundsContainer = this.container.querySelector("." + BOUNDS_ID);
        var els = Array.from(boundsContainer.children);
        for (var i = 0, l = els.length; i < l; i += 1) {
            var el = els[i];
            var identifier = el.dataset.boundsType;
            if (identifier == null) {
                throw new Error('cannot find identified class name');
            }
            var targetEls = el.childElementCount > 0 ? Array.from(el.children) : [el];
            var Handler = !isTouchEnabled() ? _mouse_handler_ts__WEBPACK_IMPORTED_MODULE_1__["default"] : _touch_handler_ts__WEBPACK_IMPORTED_MODULE_2__["default"];
            this.bounds.set(identifier, {
                recorder: new _recorder_ts__WEBPACK_IMPORTED_MODULE_3__["default"](targetEls),
                event: new Handler(targetEls),
            });
        }
        var key = Array.from(this.bounds.keys())[0];
        var bounds = this.bounds.get(key);
        this.currentBoundsType = key;
        this.recorder = bounds.recorder;
        this.event = bounds.event;
        this.event.addListeners(this.container);
        this.media = javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__["create"](_dataset_ts__WEBPACK_IMPORTED_MODULE_4__["default"].media);
        if (callback != null) {
            this.addLoopCallback(callback);
        }
        this.output = function () {
            if (_this.loopCallbacks.length > 0) {
                var frames_1 = _this.recorder.getFrames();
                for (var i = 0, l = _this.loopCallbacks.length; i < l; i += 1) {
                    _this.loopCallbacks[i](frames_1);
                }
            }
            _this.outputId = requestAnimationFrame(_this.output);
        };
        this.input = function (ctime) {
            var velocity = 0;
            var targetIndex = -1;
            if (_this.event.isAttached()) {
                var count = _this.event.getEventTrackCount();
                if (count > _this.offset) {
                    var track = _this.event.getEventTrack();
                    var _a = Array.from(track), t = _a[0], x = _a[1], y = _a[2];
                    if (_this.t0 > 0) {
                        var dt = t - _this.t0;
                        var dx = x - _this.x0;
                        var dy = y - _this.y0;
                        if (dt > MIN_INTERVAL) {
                            velocity = getVelocity(dt, dx, dy);
                        }
                    }
                    _this.t0 = t;
                    _this.x0 = x;
                    _this.y0 = y;
                    _this.offset = count;
                }
                targetIndex = _this.event.getActiveTargetIndex();
            }
            _this.recorder.update(ctime, velocity, targetIndex);
            _this.inputId = requestAnimationFrame(_this.input);
        };
    }
    Rub.prototype.getId = function () {
        return this.id;
    };
    /* ポインターイベントの速度計測とその出力を開始または再開する。 */
    Rub.prototype.startLoop = function () {
        this.inputId = requestAnimationFrame(this.input);
        this.outputId = requestAnimationFrame(this.output);
    };
    /* レコーディングを一時停止する。経過時間は停止した時点のまま */
    Rub.prototype.stopLoop = function () {
        this.recorder.suspend();
        cancelAnimationFrame(this.inputId);
        cancelAnimationFrame(this.outputId);
    };
    /* レコーディングの状態を初期に戻す */
    Rub.prototype.clearLoop = function () {
        this.t0 = 0;
        this.x0 = 0;
        this.y0 = 0;
        this.offset = 0;
        this.resetBoundsType();
    };
    Rub.prototype.getCurrentBoundsType = function () {
        return this.currentBoundsType;
    };
    Rub.prototype.setBoundsType = function (key) {
        var bounds = this.bounds.get(key);
        if (bounds == null) {
            throw new Error('this is assigned undefined');
        }
        this.currentBoundsType = key;
        this.resetBoundsType();
        this.removeEventHandler();
        this.recorder = bounds.recorder;
        this.event = bounds.event;
        this.setEventHandler();
    };
    Rub.prototype.setMediaCallback = function (callback) {
        Object.assign(this.media, callback);
    };
    Rub.prototype.addLoopCallback = function (callback) {
        if (!Array.isArray(callback)) {
            this.loopCallbacks.push(callback.bind(this));
        }
        else {
            for (var i = 0, l = callback.length; i < l; i += 1) {
                this.loopCallbacks.push(callback[i].bind(this));
            }
        }
    };
    Rub.prototype.clearLoopCallback = function () {
        this.loopCallbacks.length = 0;
    };
    Rub.prototype.setEventHandler = function () {
        if (!this.event.isAttached()) {
            this.event.addListeners(this.container);
        }
    };
    Rub.prototype.removeEventHandler = function () {
        if (this.event.isAttached()) {
            this.event.removeListeners(this.container);
        }
    };
    Rub.prototype.resetBoundsType = function () {
        this.event.clearEventTracks();
        this.recorder.resetFrames();
    };
    return Rub;
}());
/* harmony default export */ __webpack_exports__["default"] = (Rub);


/***/ }),

/***/ "./src/mouse-handler.ts":
/*!******************************!*\
  !*** ./src/mouse-handler.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pointer_handler_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pointer-handler.ts */ "./src/pointer-handler.ts");
/* harmony import */ var _event_type_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-type.ts */ "./src/event-type.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var documentElement = document.documentElement;
function start(state, event) {
    if (!(event instanceof MouseEvent)) {
        return;
    }
    if (state.current !== 'idling') {
        return;
    }
    state.start();
    var t = performance.now();
    var rect = documentElement.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    this.coords.addTrack([t, x, y]);
}
function move(state, event) {
    if (!(event instanceof MouseEvent)) {
        return;
    }
    if (state.current !== 'running') {
        return;
    }
    var t = performance.now();
    var rect = documentElement.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    this.coords.addTrack([t, x, y]);
}
function end(state, event) {
    if (!(event instanceof MouseEvent)) {
        return;
    }
    if (state.current !== 'running') {
        return;
    }
    var t = performance.now();
    var rect = documentElement.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    this.coords.addTrack([t, x, y]);
    state.end();
}
function activate(event) {
    var index = this.findTargetIndex(function (t) { return t.el === event.target; });
    var target = this.targets[index];
    if (target == null) {
        return;
    }
    if (target.state.current !== 'inactive') {
        return;
    }
    target.state.activate();
}
function inactivate(event) {
    var index = this.findTargetIndex(function (t) { return t.el === event.target; });
    var target = this.targets[index];
    if (target == null) {
        return;
    }
    if (target.state.current !== 'active') {
        return;
    }
    target.state.inactivate();
}
var MouseHandler = /** @class */ (function (_super) {
    __extends(MouseHandler, _super);
    function MouseHandler(els) {
        var _this = _super.call(this, els) || this;
        _this.listener = {
            start: start.bind(_this, _this.state),
            end: end.bind(_this, _this.state),
            move: move.bind(_this, _this.state),
            activate: activate.bind(_this),
            inactivate: inactivate.bind(_this),
        };
        return _this;
    }
    MouseHandler.prototype.addListeners = function (el) {
        if (this.listener == null) {
            return;
        }
        this.attached = true;
        el.addEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseDown, this.listener.start, false);
        el.addEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseMove, this.listener.move, false);
        el.addEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseUp, this.listener.end, false);
        for (var i = 0, l = this.targets.length; i < l; i += 1) {
            var target = this.targets[i];
            target.el.addEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseEnter, this.listener.activate, false);
            target.el.addEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseLeave, this.listener.inactivate, false);
        }
    };
    MouseHandler.prototype.removeListeners = function (el) {
        if (this.listener == null) {
            return;
        }
        this.attached = false;
        el.removeEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseDown, this.listener.start, false);
        el.removeEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseMove, this.listener.move, false);
        el.removeEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseUp, this.listener.end, false);
        for (var i = 0, l = this.targets.length; i < l; i += 1) {
            var target = this.targets[i];
            target.el.removeEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseEnter, this.listener.activate, false);
            target.el.removeEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].MouseLeave, this.listener.inactivate, false);
        }
    };
    return MouseHandler;
}(_pointer_handler_ts__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (MouseHandler);


/***/ }),

/***/ "./src/pointer-handler.ts":
/*!********************************!*\
  !*** ./src/pointer-handler.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! javascript-state-machine */ "./node_modules/javascript-state-machine/state-machine.js");
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _target_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./target.ts */ "./src/target.ts");
/* harmony import */ var _tracker_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tracker.ts */ "./src/tracker.ts");
/* harmony import */ var _dataset_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dataset.ts */ "./src/dataset.ts");




var BLOCK_SIZE = 3; // [t, x, y]
var TRACK_SIZE = 900000; // (bytes)
var isActive = function (target) { return target.isActive(); };
var PointerHandler = /** @class */ (function () {
    function PointerHandler(els) {
        this.attached = false;
        this.targets = els.map(function (el) {
            var target = new _target_ts__WEBPACK_IMPORTED_MODULE_1__["default"](el);
            target.state.initialize();
            return target;
        });
        this.state = javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__["StateMachine"].create(_dataset_ts__WEBPACK_IMPORTED_MODULE_3__["default"].pointer);
        this.state.initialize();
        this.coords = new _tracker_ts__WEBPACK_IMPORTED_MODULE_2__["default"](TRACK_SIZE, BLOCK_SIZE);
        this.listener = {};
    }
    PointerHandler.prototype.findTargetIndex = function (predicate) {
        var result = -1;
        for (var i = 0, l = this.targets.length; i < l; i += 1) {
            var t = this.targets[i];
            if (predicate(t)) {
                result = i;
                break;
            }
        }
        return result;
    };
    PointerHandler.prototype.getActiveTargetIndex = function () {
        var targetIndex = this.findTargetIndex(isActive);
        return targetIndex;
    };
    PointerHandler.prototype.getEventTrackCount = function () {
        return this.coords.count;
    };
    PointerHandler.prototype.getEventTrack = function () {
        return this.coords.getTrack();
    };
    PointerHandler.prototype.clearEventTracks = function () {
        return this.coords.clearTracks();
    };
    PointerHandler.prototype.isAttached = function () {
        return this.attached;
    };
    return PointerHandler;
}());
/* harmony default export */ __webpack_exports__["default"] = (PointerHandler);


/***/ }),

/***/ "./src/recorder.ts":
/*!*************************!*\
  !*** ./src/recorder.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tracker_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tracker.ts */ "./src/tracker.ts");

var TRACK_SIZE = 216000;
var FPS = 60;
var PER_FRAME = 1000 / FPS;
var round = Math.round;
var Recorder = /** @class */ (function () {
    function Recorder(els) {
        this.frames = 0;
        this.started = false;
        this.elapsedTime = 0;
        this.lastTime = 0;
        var targetNum = els.length;
        this.blockSize = targetNum + 1;
        this.record = new Map([
            ['live', this.createRecord()],
            ['playback', this.createRecord()],
            ['external', this.createRecord()],
        ]);
        this.shiftedFrames = {
            live: 0,
            playback: 0,
            external: 0,
        };
        this.template = Array(targetNum + 1).fill(0);
    }
    Recorder.prototype.update = function (ctime, velocity, targetIndex) {
        var track = this.template.slice(0);
        var liveTracker = this.record.get('live');
        if (!this.started) {
            this.started = true;
            this.lastTime = ctime;
            track[0] = this.frames;
            liveTracker.setTrack(track, this.frames);
        }
        else {
            this.elapsedTime += ctime - this.lastTime;
            this.lastTime = ctime;
            var currentFrames = round(this.elapsedTime / PER_FRAME);
            if (currentFrames > this.frames) {
                this.frames = currentFrames;
                track[0] = this.frames;
                if (targetIndex > -1) {
                    track[targetIndex + 1] = velocity;
                }
                liveTracker.setTrack(track, this.frames);
            }
        }
    };
    Recorder.prototype.createRecord = function () {
        var tracker = new _tracker_ts__WEBPACK_IMPORTED_MODULE_0__["default"](TRACK_SIZE, this.blockSize);
        tracker.writeFrames();
        return tracker;
    };
    Recorder.prototype.getElapsedTime = function () {
        return this.elapsedTime;
    };
    Recorder.prototype.getFrames = function () {
        return this.frames;
    };
    Recorder.prototype.setFrames = function (frames) {
        var track = this.template.slice(0);
        track[0] = frames;
        this.record.get('live').setTrack(track, frames);
        var diff = frames - this.frames;
        var shift = diff * PER_FRAME;
        this.elapsedTime += shift;
        this.frames = frames;
    };
    Recorder.prototype.suspend = function () {
        this.started = false;
    };
    Recorder.prototype.resetFrames = function () {
        this.frames = 0;
        this.started = false;
        this.lastTime = 0;
        this.elapsedTime = 0;
    };
    Recorder.prototype.clearRecord = function (mode) {
        if (mode === void 0) { mode = 'live'; }
        this.record.get(mode).writeFrames();
    };
    Recorder.prototype.getRecordCount = function (mode) {
        if (mode === void 0) { mode = 'live'; }
        return this.record.get(mode).count;
    };
    Recorder.prototype.getVelocities = function (offset, mode) {
        if (offset === void 0) { offset = -1; }
        if (mode === void 0) { mode = 'live'; }
        var shifted = offset + this.shiftedFrames[mode];
        var track = this.record.get(mode).getTrack(shifted);
        var velocities = Array.from(track.subarray(1));
        return velocities;
    };
    Recorder.prototype.getRecord = function (mode) {
        if (mode === void 0) { mode = 'live'; }
        var tracker = this.record.get(mode);
        return tracker.getTrack(0, tracker.size);
    };
    Recorder.prototype.setRecord = function (tracks, mode) {
        if (mode === void 0) { mode = 'live'; }
        this.record.get(mode).setTrack(tracks);
    };
    Recorder.prototype.addData = function (data) {
        this.record.get('live').addTrack(data);
    };
    Recorder.prototype.getData = function (offset, count, mode) {
        if (offset === void 0) { offset = -1; }
        if (count === void 0) { count = 1; }
        if (mode === void 0) { mode = 'live'; }
        var shifted = offset + this.shiftedFrames[mode];
        return this.record.get(mode).getTrack(shifted, count);
    };
    Recorder.prototype.setData = function (track, offset, mode) {
        if (offset === void 0) { offset = 0; }
        if (mode === void 0) { mode = 'live'; }
        this.record.get(mode).setTrack(track, offset);
    };
    Recorder.prototype.setShiftedFrames = function (frames, mode) {
        if (mode === void 0) { mode = 'live'; }
        this.shiftedFrames[mode] = frames;
    };
    return Recorder;
}());
/* harmony default export */ __webpack_exports__["default"] = (Recorder);


/***/ }),

/***/ "./src/target.ts":
/*!***********************!*\
  !*** ./src/target.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! javascript-state-machine */ "./node_modules/javascript-state-machine/state-machine.js");
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dataset_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dataset.ts */ "./src/dataset.ts");


var Target = /** @class */ (function () {
    function Target(el) {
        this.el = el;
        this.state = javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__["StateMachine"].create(_dataset_ts__WEBPACK_IMPORTED_MODULE_1__["default"].target);
    }
    Target.prototype.isActive = function () {
        return this.state.current === 'active';
    };
    return Target;
}());
/* harmony default export */ __webpack_exports__["default"] = (Target);


/***/ }),

/***/ "./src/touch-handler.ts":
/*!******************************!*\
  !*** ./src/touch-handler.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pointer_handler_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pointer-handler.ts */ "./src/pointer-handler.ts");
/* harmony import */ var _event_type_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-type.ts */ "./src/event-type.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var documentElement = document.documentElement;
function start(state, event) {
    if (!(event instanceof TouchEvent)) {
        return;
    }
    if (state.current !== 'idling') {
        return;
    }
    state.start();
    var t = performance.now();
    var rect = documentElement.getBoundingClientRect();
    var touch = Array.from(event.changedTouches)[0];
    var x = touch.clientX - rect.left;
    var y = touch.clientY - rect.top;
    this.coords.addTrack([t, x, y]);
}
function move(state, event) {
    if (!(event instanceof TouchEvent)) {
        return;
    }
    if (state.current !== 'running') {
        return;
    }
    var t = performance.now();
    var rect = documentElement.getBoundingClientRect();
    var touch = Array.from(event.changedTouches)[0];
    var cx = touch.clientX;
    var cy = touch.clientY;
    var x = cx - rect.left;
    var y = cy - rect.top;
    for (var i = 0, l = this.targets.length; i < l; i += 1) {
        var target = this.targets[i];
        var trect = target.el.getBoundingClientRect();
        var isActive = cx >= trect.left &&
            cx <= trect.left + trect.width &&
            cy >= trect.top &&
            cy <= trect.top + trect.height;
        if (isActive) {
            if (target.state.current !== 'active') {
                target.state.activate();
            }
        }
        else if (target.state.current !== 'inactive') {
            target.state.inactivate();
        }
    }
    this.coords.addTrack([t, x, y]);
}
function end(state, event) {
    if (!(event instanceof TouchEvent)) {
        return;
    }
    if (state.current !== 'running') {
        return;
    }
    var t = performance.now();
    var rect = documentElement.getBoundingClientRect();
    var touch = Array.from(event.changedTouches)[0];
    var x = touch.clientX - rect.left;
    var y = touch.clientY - rect.top;
    this.coords.addTrack([t, x, y]);
    state.end();
}
var TouchHandler = /** @class */ (function (_super) {
    __extends(TouchHandler, _super);
    function TouchHandler(els) {
        var _this = _super.call(this, els) || this;
        _this.listener = {
            start: start.bind(_this, _this.state),
            move: move.bind(_this, _this.state),
            end: end.bind(_this, _this.state),
        };
        return _this;
    }
    TouchHandler.prototype.addListeners = function (el) {
        if (this.listener == null) {
            return;
        }
        if (this.attached) {
            return;
        }
        this.attached = true;
        el.addEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].TouchStart, this.listener.start, false);
        el.addEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].TouchMove, this.listener.move, false);
        el.addEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].TouchEnd, this.listener.end, false);
        el.addEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].TouchCancel, this.listener.end, false);
    };
    TouchHandler.prototype.removeListeners = function (el) {
        if (this.listener == null) {
            return;
        }
        if (!this.attached) {
            return;
        }
        this.attached = false;
        el.removeEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].TouchStart, this.listener.start, false);
        el.removeEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].TouchMove, this.listener.move, false);
        el.removeEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].TouchEnd, this.listener.end, false);
        el.removeEventListener(_event_type_ts__WEBPACK_IMPORTED_MODULE_1__["default"].TouchCancel, this.listener.end, false);
    };
    return TouchHandler;
}(_pointer_handler_ts__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (TouchHandler);


/***/ }),

/***/ "./src/tracker.ts":
/*!************************!*\
  !*** ./src/tracker.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var floor = Math.floor;
function SystemGetExecutedInLittleEndian() {
    if (new Uint8Array(new Uint16Array([0x00ff]).buffer)[0]) {
        return true;
    }
    return false;
}
var Tracker = /** @class */ (function () {
    function Tracker(length, blockSize) {
        this.end = 0;
        this.blockSize = blockSize;
        try {
            this.tracks = new Float32Array(length * this.blockSize);
        }
        catch (e) {
            throw new Error('cannot allocate memory');
        }
        if (!SystemGetExecutedInLittleEndian()) {
            throw new Error('required little endian system');
        }
    }
    Object.defineProperty(Tracker.prototype, "count", {
        get: function () {
            return floor(this.end / this.blockSize);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tracker.prototype, "size", {
        get: function () {
            return floor(this.tracks.length / this.blockSize);
        },
        enumerable: true,
        configurable: true
    });
    Tracker.prototype.setTrack = function (track, offset) {
        if (offset === void 0) { offset = 0; }
        if (track.length % this.blockSize !== 0) {
            throw new Error('Track size not matched');
        }
        var position = offset * this.blockSize;
        this.tracks.set(track, position);
        if (position + track.length >= this.end) {
            this.end = position + track.length;
        }
    };
    /* addTrack(), getLastTrack()はRecorderクラスでの使用を想定 */
    Tracker.prototype.addTrack = function (track) {
        if (track.length % this.blockSize !== 0) {
            throw new Error('Track size not matched');
        }
        this.tracks.set(track, this.end);
        this.end += track.length;
    };
    /* 任意の場所からトラックデータを取得する。引数に何も指定しない場合、最後のブロックを取得する */
    Tracker.prototype.getTrack = function (offset, count) {
        if (offset === void 0) { offset = -1; }
        if (count === void 0) { count = 1; }
        var position = offset < 0
            ? (this.count + offset) * this.blockSize
            : offset * this.blockSize;
        var end = position + count * this.blockSize;
        var track = this.tracks.subarray(position, end);
        return track;
    };
    Tracker.prototype.clearTracks = function () {
        this.end = 0;
        this.tracks.fill(0);
    };
    Tracker.prototype.writeFrames = function () {
        this.clearTracks();
        for (var i = 0, l = this.tracks.length, count = 0; i < l; i += 1) {
            if (i % this.blockSize === 0) {
                this.tracks.set([count], i);
                count += 1;
            }
        }
    };
    Tracker.create = function (length, blockSize) {
        return new Tracker(length, blockSize);
    };
    return Tracker;
}());
/* harmony default export */ __webpack_exports__["default"] = (Tracker);


/***/ })

/******/ });
});
//# sourceMappingURL=rub.js.map