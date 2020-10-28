(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Rub"] = factory();
	else
		root["Rub"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/javascript-state-machine/state-machine.js":
/*!****************************************************************!*\
  !*** ./node_modules/javascript-state-machine/state-machine.js ***!
  \****************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_exports__ */
/*! CommonJS bailout: module.exports is used directly at 206:41-55 */
/*! CommonJS bailout: module.exports is used directly at 207:16-30 */
/*! CommonJS bailout: exports is used directly at 207:6-13 */
/***/ (function(module, exports) {

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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! namespace exports */
/*! export default [provided] [maybe used in rub, rub.min (runtime-defined)] [usage prevents renaming] */
/*! other exports [not provided] [maybe used in rub, rub.min (runtime-defined)] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Rub; }
/* harmony export */ });
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! javascript-state-machine */ "./node_modules/javascript-state-machine/state-machine.js");
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Mod_mouse_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Mod/mouse-handler */ "./src/modules/mouse-handler.ts");
/* harmony import */ var Mod_touch_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Mod/touch-handler */ "./src/modules/touch-handler.ts");
/* harmony import */ var Mod_recorder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Mod/recorder */ "./src/modules/recorder.ts");
/* harmony import */ var Mod_dataset__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! Mod/dataset */ "./src/modules/dataset.ts");





const MIN_INTERVAL = 4;
const BOUNDS_ID = 'rb-bounds';
const { abs, max } = Math;
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
let id = 0;
function genId() {
    id += 1;
    return id;
}
class Rub {
    constructor(container, callback) {
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
        const boundsContainer = this.container.querySelector(`.${BOUNDS_ID}`);
        const els = Array.from(boundsContainer.children);
        for (let i = 0, l = els.length; i < l; i += 1) {
            const el = els[i];
            const identifier = el.dataset.boundsType;
            if (identifier == null) {
                throw new Error('cannot find identified class name');
            }
            const targetEls = el.childElementCount > 0 ? Array.from(el.children) : [el];
            const Handler = !isTouchEnabled() ? Mod_mouse_handler__WEBPACK_IMPORTED_MODULE_1__.default : Mod_touch_handler__WEBPACK_IMPORTED_MODULE_2__.default;
            this.bounds.set(identifier, {
                recorder: new Mod_recorder__WEBPACK_IMPORTED_MODULE_3__.default(targetEls),
                event: new Handler(targetEls),
            });
        }
        const [key] = Array.from(this.bounds.keys());
        const bounds = this.bounds.get(key);
        this.currentBoundsType = key;
        this.recorder = bounds.recorder;
        this.event = bounds.event;
        this.event.addListeners(this.container);
        this.media = javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__.create(Mod_dataset__WEBPACK_IMPORTED_MODULE_4__.default.media);
        if (callback != null) {
            this.addLoopCallback(callback);
        }
        this.output = () => {
            if (this.loopCallbacks.length > 0) {
                const frames = this.recorder.getFrames();
                for (let i = 0, l = this.loopCallbacks.length; i < l; i += 1) {
                    this.loopCallbacks[i](frames);
                }
            }
            this.outputId = requestAnimationFrame(this.output);
        };
        this.input = (ctime) => {
            let velocity = 0;
            let targetIndex = -1;
            if (this.event.isAttached()) {
                const count = this.event.getEventTrackCount();
                if (count > this.offset) {
                    const track = this.event.getEventTrack();
                    const [t, x, y] = Array.from(track);
                    if (this.t0 > 0) {
                        const dt = t - this.t0;
                        const dx = x - this.x0;
                        const dy = y - this.y0;
                        if (dt > MIN_INTERVAL) {
                            velocity = getVelocity(dt, dx, dy);
                        }
                    }
                    this.t0 = t;
                    this.x0 = x;
                    this.y0 = y;
                    this.offset = count;
                }
                targetIndex = this.event.getActiveTargetIndex();
            }
            this.recorder.update(ctime, velocity, targetIndex);
            this.inputId = requestAnimationFrame(this.input);
        };
    }
    getId() {
        return this.id;
    }
    /* ポインターイベントの速度計測とその出力を開始または再開する。 */
    startLoop() {
        this.inputId = requestAnimationFrame(this.input);
        this.outputId = requestAnimationFrame(this.output);
    }
    /* レコーディングを一時停止する。経過時間は停止した時点のまま */
    stopLoop() {
        this.recorder.suspend();
        cancelAnimationFrame(this.inputId);
        cancelAnimationFrame(this.outputId);
    }
    /* レコーディングの状態を初期に戻す */
    clearLoop() {
        this.t0 = 0;
        this.x0 = 0;
        this.y0 = 0;
        this.offset = 0;
        this.resetBoundsType();
    }
    getCurrentBoundsType() {
        return this.currentBoundsType;
    }
    setBoundsType(key) {
        const bounds = this.bounds.get(key);
        if (bounds == null) {
            throw new Error('this is assigned undefined');
        }
        this.currentBoundsType = key;
        this.resetBoundsType();
        this.removeEventHandler();
        this.recorder = bounds.recorder;
        this.event = bounds.event;
        this.setEventHandler();
    }
    setMediaCallback(callback) {
        Object.assign(this.media, callback);
    }
    addLoopCallback(callback) {
        if (!Array.isArray(callback)) {
            this.loopCallbacks.push(callback.bind(this));
        }
        else {
            for (let i = 0, l = callback.length; i < l; i += 1) {
                this.loopCallbacks.push(callback[i].bind(this));
            }
        }
    }
    clearLoopCallback() {
        this.loopCallbacks.length = 0;
    }
    setEventHandler() {
        if (!this.event.isAttached()) {
            this.event.addListeners(this.container);
        }
    }
    removeEventHandler() {
        if (this.event.isAttached()) {
            this.event.removeListeners(this.container);
        }
    }
    resetBoundsType() {
        this.event.clearEventTracks();
        this.recorder.resetFrames();
    }
}


/***/ }),

/***/ "./src/modules/dataset.ts":
/*!********************************!*\
  !*** ./src/modules/dataset.ts ***!
  \********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const dataset = {
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

/***/ "./src/modules/event-type.ts":
/*!***********************************!*\
  !*** ./src/modules/event-type.ts ***!
  \***********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ EventType; }
/* harmony export */ });
class EventType {
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


/***/ }),

/***/ "./src/modules/mouse-handler.ts":
/*!**************************************!*\
  !*** ./src/modules/mouse-handler.ts ***!
  \**************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MouseHandler; }
/* harmony export */ });
/* harmony import */ var _pointer_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pointer-handler */ "./src/modules/pointer-handler.ts");
/* harmony import */ var _event_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-type */ "./src/modules/event-type.ts");


const { documentElement } = document;
class MouseHandler extends _pointer_handler__WEBPACK_IMPORTED_MODULE_0__.default {
    constructor(els) {
        super(els);
        this.listener = {
            start: MouseHandler.start.bind(this, this.state),
            end: MouseHandler.end.bind(this, this.state),
            move: MouseHandler.move.bind(this, this.state),
            activate: MouseHandler.activate.bind(this),
            inactivate: MouseHandler.inactivate.bind(this),
        };
    }
    addListeners(el) {
        if (this.listener == null) {
            return;
        }
        this.attached = true;
        el.addEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseDown, this.listener.start, false);
        el.addEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseMove, this.listener.move, false);
        el.addEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseUp, this.listener.end, false);
        for (let i = 0, l = this.targets.length; i < l; i += 1) {
            const target = this.targets[i];
            target.el.addEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseEnter, this.listener.activate, false);
            target.el.addEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseLeave, this.listener.inactivate, false);
        }
    }
    removeListeners(el) {
        if (this.listener == null) {
            return;
        }
        this.attached = false;
        el.removeEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseDown, this.listener.start, false);
        el.removeEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseMove, this.listener.move, false);
        el.removeEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseUp, this.listener.end, false);
        for (let i = 0, l = this.targets.length; i < l; i += 1) {
            const target = this.targets[i];
            target.el.removeEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseEnter, this.listener.activate, false);
            target.el.removeEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.MouseLeave, this.listener.inactivate, false);
        }
    }
    static start(state, event) {
        if (!(event instanceof MouseEvent)) {
            return;
        }
        if (state.current !== 'idling') {
            return;
        }
        state.start();
        const t = performance.now();
        const rect = documentElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.coords.addTrack([t, x, y]);
    }
    static move(state, event) {
        if (!(event instanceof MouseEvent)) {
            return;
        }
        if (state.current !== 'running') {
            return;
        }
        const t = performance.now();
        const rect = documentElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.coords.addTrack([t, x, y]);
    }
    static end(state, event) {
        if (!(event instanceof MouseEvent)) {
            return;
        }
        if (state.current !== 'running') {
            return;
        }
        const t = performance.now();
        const rect = documentElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.coords.addTrack([t, x, y]);
        state.end();
    }
    static activate(event) {
        const index = this.findTargetIndex((t) => t.el === event.target);
        const target = this.targets[index];
        if (target == null) {
            return;
        }
        if (target.state.current !== 'inactive') {
            return;
        }
        target.state.activate();
    }
    static inactivate(event) {
        const index = this.findTargetIndex((t) => t.el === event.target);
        const target = this.targets[index];
        if (target == null) {
            return;
        }
        if (target.state.current !== 'active') {
            return;
        }
        target.state.inactivate();
    }
}


/***/ }),

/***/ "./src/modules/pointer-handler.ts":
/*!****************************************!*\
  !*** ./src/modules/pointer-handler.ts ***!
  \****************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! javascript-state-machine */ "./node_modules/javascript-state-machine/state-machine.js");
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _target__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./target */ "./src/modules/target.ts");
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tracker */ "./src/modules/tracker.ts");
/* harmony import */ var _dataset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dataset */ "./src/modules/dataset.ts");




const BLOCK_SIZE = 3; // [t, x, y]
const TRACK_SIZE = 900000; // (bytes)
const isActive = (target) => target.isActive();
class PointerHandler {
    constructor(els) {
        this.attached = false;
        this.targets = els.map((el) => {
            const target = new _target__WEBPACK_IMPORTED_MODULE_1__.default(el);
            target.state.initialize();
            return target;
        });
        this.state = javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__.StateMachine.create(_dataset__WEBPACK_IMPORTED_MODULE_3__.default.pointer);
        this.state.initialize();
        this.coords = new _tracker__WEBPACK_IMPORTED_MODULE_2__.default(TRACK_SIZE, BLOCK_SIZE);
        this.listener = {};
    }
    findTargetIndex(predicate) {
        let result = -1;
        for (let i = 0, l = this.targets.length; i < l; i += 1) {
            const t = this.targets[i];
            if (predicate(t)) {
                result = i;
                break;
            }
        }
        return result;
    }
    getActiveTargetIndex() {
        const targetIndex = this.findTargetIndex(isActive);
        return targetIndex;
    }
    getEventTrackCount() {
        return this.coords.count;
    }
    getEventTrack() {
        return this.coords.getTrack();
    }
    clearEventTracks() {
        return this.coords.clearTracks();
    }
    isAttached() {
        return this.attached;
    }
}
/* harmony default export */ __webpack_exports__["default"] = (PointerHandler);


/***/ }),

/***/ "./src/modules/recorder.ts":
/*!*********************************!*\
  !*** ./src/modules/recorder.ts ***!
  \*********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Recorder; }
/* harmony export */ });
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tracker */ "./src/modules/tracker.ts");

const TRACK_SIZE = 216000;
const FPS = 60;
const PER_FRAME = 1000 / FPS;
const { round } = Math;
class Recorder {
    constructor(els) {
        this.frames = 0;
        this.started = false;
        this.elapsedTime = 0;
        this.lastTime = 0;
        const targetNum = els.length;
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
    update(ctime, velocity, targetIndex) {
        const track = this.template.slice(0);
        const liveTracker = this.record.get('live');
        if (!this.started) {
            this.started = true;
            this.lastTime = ctime;
            track[0] = this.frames;
            liveTracker.setTrack(track, this.frames);
        }
        else {
            this.elapsedTime += ctime - this.lastTime;
            this.lastTime = ctime;
            const currentFrames = round(this.elapsedTime / PER_FRAME);
            if (currentFrames > this.frames) {
                this.frames = currentFrames;
                track[0] = this.frames;
                if (targetIndex > -1) {
                    track[targetIndex + 1] = velocity;
                }
                liveTracker.setTrack(track, this.frames);
            }
        }
    }
    createRecord() {
        const tracker = new _tracker__WEBPACK_IMPORTED_MODULE_0__.default(TRACK_SIZE, this.blockSize);
        tracker.writeFrames();
        return tracker;
    }
    getElapsedTime() {
        return this.elapsedTime;
    }
    getFrames() {
        return this.frames;
    }
    setFrames(frames) {
        const track = this.template.slice(0);
        track[0] = frames;
        this.record.get('live').setTrack(track, frames);
        const diff = frames - this.frames;
        const shift = diff * PER_FRAME;
        this.elapsedTime += shift;
        this.frames = frames;
    }
    suspend() {
        this.started = false;
    }
    resetFrames() {
        this.frames = 0;
        this.started = false;
        this.lastTime = 0;
        this.elapsedTime = 0;
    }
    clearRecord(mode = 'live') {
        this.record.get(mode).writeFrames();
    }
    getRecordCount(mode = 'live') {
        return this.record.get(mode).count;
    }
    getVelocities(offset = -1, mode = 'live') {
        const shifted = offset + this.shiftedFrames[mode];
        const track = this.record.get(mode).getTrack(shifted);
        const velocities = Array.from(track.subarray(1));
        return velocities;
    }
    getRecord(mode = 'live') {
        const tracker = this.record.get(mode);
        return tracker.getTrack(0, tracker.size);
    }
    setRecord(tracks, mode = 'live') {
        this.record.get(mode).setTrack(tracks);
    }
    addData(data) {
        this.record.get('live').addTrack(data);
    }
    getData(offset = -1, count = 1, mode = 'live') {
        const shifted = offset + this.shiftedFrames[mode];
        return this.record.get(mode).getTrack(shifted, count);
    }
    setData(track, offset = 0, mode = 'live') {
        this.record.get(mode).setTrack(track, offset);
    }
    setShiftedFrames(frames, mode = 'live') {
        this.shiftedFrames[mode] = frames;
    }
}


/***/ }),

/***/ "./src/modules/target.ts":
/*!*******************************!*\
  !*** ./src/modules/target.ts ***!
  \*******************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Target; }
/* harmony export */ });
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! javascript-state-machine */ "./node_modules/javascript-state-machine/state-machine.js");
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dataset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dataset */ "./src/modules/dataset.ts");


class Target {
    constructor(el) {
        this.el = el;
        this.state = javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__.StateMachine.create(_dataset__WEBPACK_IMPORTED_MODULE_1__.default.target);
    }
    isActive() {
        return this.state.current === 'active';
    }
}


/***/ }),

/***/ "./src/modules/touch-handler.ts":
/*!**************************************!*\
  !*** ./src/modules/touch-handler.ts ***!
  \**************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TouchHandler; }
/* harmony export */ });
/* harmony import */ var _pointer_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pointer-handler */ "./src/modules/pointer-handler.ts");
/* harmony import */ var _event_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-type */ "./src/modules/event-type.ts");


const { documentElement } = document;
class TouchHandler extends _pointer_handler__WEBPACK_IMPORTED_MODULE_0__.default {
    constructor(els) {
        super(els);
        this.listener = {
            start: TouchHandler.start.bind(this, this.state),
            move: TouchHandler.move.bind(this, this.state),
            end: TouchHandler.end.bind(this, this.state),
        };
    }
    addListeners(el) {
        if (this.listener == null) {
            return;
        }
        if (this.attached) {
            return;
        }
        this.attached = true;
        el.addEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.TouchStart, this.listener.start, false);
        el.addEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.TouchMove, this.listener.move, false);
        el.addEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.TouchEnd, this.listener.end, false);
        el.addEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.TouchCancel, this.listener.end, false);
    }
    removeListeners(el) {
        if (this.listener == null) {
            return;
        }
        if (!this.attached) {
            return;
        }
        this.attached = false;
        el.removeEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.TouchStart, this.listener.start, false);
        el.removeEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.TouchMove, this.listener.move, false);
        el.removeEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.TouchEnd, this.listener.end, false);
        el.removeEventListener(_event_type__WEBPACK_IMPORTED_MODULE_1__.default.TouchCancel, this.listener.end, false);
    }
    static start(state, event) {
        if (!(event instanceof TouchEvent)) {
            return;
        }
        if (state.current !== 'idling') {
            return;
        }
        state.start();
        const t = performance.now();
        const rect = documentElement.getBoundingClientRect();
        const touch = Array.from(event.changedTouches)[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        this.coords.addTrack([t, x, y]);
    }
    static move(state, event) {
        if (!(event instanceof TouchEvent)) {
            return;
        }
        if (state.current !== 'running') {
            return;
        }
        const t = performance.now();
        const rect = documentElement.getBoundingClientRect();
        const touch = Array.from(event.changedTouches)[0];
        const cx = touch.clientX;
        const cy = touch.clientY;
        const x = cx - rect.left;
        const y = cy - rect.top;
        for (let i = 0, l = this.targets.length; i < l; i += 1) {
            const target = this.targets[i];
            const trect = target.el.getBoundingClientRect();
            const isActive = cx >= trect.left &&
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
    static end(state, event) {
        if (!(event instanceof TouchEvent)) {
            return;
        }
        if (state.current !== 'running') {
            return;
        }
        const t = performance.now();
        const rect = documentElement.getBoundingClientRect();
        const touch = Array.from(event.changedTouches)[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        this.coords.addTrack([t, x, y]);
        state.end();
    }
}


/***/ }),

/***/ "./src/modules/tracker.ts":
/*!********************************!*\
  !*** ./src/modules/tracker.ts ***!
  \********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Tracker; }
/* harmony export */ });
const { floor } = Math;
function SystemGetExecutedInLittleEndian() {
    if (new Uint8Array(new Uint16Array([0x00ff]).buffer)[0]) {
        return true;
    }
    return false;
}
class Tracker {
    constructor(length, blockSize) {
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
    get count() {
        return floor(this.end / this.blockSize);
    }
    get size() {
        return floor(this.tracks.length / this.blockSize);
    }
    setTrack(track, offset = 0) {
        if (track.length % this.blockSize !== 0) {
            throw new Error('Track size not matched');
        }
        const position = offset * this.blockSize;
        this.tracks.set(track, position);
        if (position + track.length >= this.end) {
            this.end = position + track.length;
        }
    }
    /* addTrack(), getLastTrack()はRecorderクラスでの使用を想定 */
    addTrack(track) {
        if (track.length % this.blockSize !== 0) {
            throw new Error('Track size not matched');
        }
        this.tracks.set(track, this.end);
        this.end += track.length;
    }
    /* 任意の場所からトラックデータを取得する。引数に何も指定しない場合、最後のブロックを取得する */
    getTrack(offset = -1, count = 1) {
        const position = offset < 0
            ? (this.count + offset) * this.blockSize
            : offset * this.blockSize;
        const end = position + count * this.blockSize;
        const track = this.tracks.subarray(position, end);
        return track;
    }
    clearTracks() {
        this.end = 0;
        this.tracks.fill(0);
    }
    writeFrames() {
        this.clearTracks();
        for (let i = 0, l = this.tracks.length, count = 0; i < l; i += 1) {
            if (i % this.blockSize === 0) {
                this.tracks.set([count], i);
                count += 1;
            }
        }
    }
    static create(length, blockSize) {
        return new Tracker(length, blockSize);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.ts");
/******/ })()
;
});
//# sourceMappingURL=rub.js.map