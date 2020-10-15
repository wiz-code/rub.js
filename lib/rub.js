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

/***/ "./node_modules/javascript-state-machine/lib/state-machine.js":
/*!********************************************************************!*\
  !*** ./node_modules/javascript-state-machine/lib/state-machine.js ***!
  \********************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, top-level-this-exports */
/*! CommonJS bailout: this is used directly at 10:3-7 */
/*! CommonJS bailout: module.exports is used directly at 3:2-16 */
/***/ (function(module) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_563__(moduleId) {
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
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_563__);
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
/******/ 	__nested_webpack_require_563__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_563__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__nested_webpack_require_563__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__nested_webpack_require_563__.d = function(exports, name, getter) {
/******/ 		if(!__nested_webpack_require_563__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nested_webpack_require_563__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__nested_webpack_require_563__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__nested_webpack_require_563__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_563__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_563__(__nested_webpack_require_563__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __nested_webpack_require_3002__) {

"use strict";


module.exports = function(target, sources) {
  var n, source, key;
  for(n = 1 ; n < arguments.length ; n++) {
    source = arguments[n];
    for(key in source) {
      if (source.hasOwnProperty(key))
        target[key] = source[key];
    }
  }
  return target;
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __nested_webpack_require_3360__) {

"use strict";


//-------------------------------------------------------------------------------------------------

var mixin = __nested_webpack_require_3360__(0);

//-------------------------------------------------------------------------------------------------

module.exports = {

  build: function(target, config) {
    var n, max, plugin, plugins = config.plugins;
    for(n = 0, max = plugins.length ; n < max ; n++) {
      plugin = plugins[n];
      if (plugin.methods)
        mixin(target, plugin.methods);
      if (plugin.properties)
        Object.defineProperties(target, plugin.properties);
    }
  },

  hook: function(fsm, name, additional) {
    var n, max, method, plugin,
        plugins = fsm.config.plugins,
        args    = [fsm.context];

    if (additional)
      args = args.concat(additional)

    for(n = 0, max = plugins.length ; n < max ; n++) {
      plugin = plugins[n]
      method = plugins[n][name]
      if (method)
        method.apply(plugin, args);
    }
  }

}

//-------------------------------------------------------------------------------------------------


/***/ }),
/* 2 */
/***/ (function(module, exports, __nested_webpack_require_4531__) {

"use strict";


//-------------------------------------------------------------------------------------------------

function camelize(label) {

  if (label.length === 0)
    return label;

  var n, result, word, words = label.split(/[_-]/);

  // single word with first character already lowercase, return untouched
  if ((words.length === 1) && (words[0][0].toLowerCase() === words[0][0]))
    return label;

  result = words[0].toLowerCase();
  for(n = 1 ; n < words.length ; n++) {
    result = result + words[n].charAt(0).toUpperCase() + words[n].substring(1).toLowerCase();
  }

  return result;
}

//-------------------------------------------------------------------------------------------------

camelize.prepended = function(prepend, label) {
  label = camelize(label);
  return prepend + label[0].toUpperCase() + label.substring(1);
}

//-------------------------------------------------------------------------------------------------

module.exports = camelize;


/***/ }),
/* 3 */
/***/ (function(module, exports, __nested_webpack_require_5584__) {

"use strict";


//-------------------------------------------------------------------------------------------------

var mixin    = __nested_webpack_require_5584__(0),
    camelize = __nested_webpack_require_5584__(2);

//-------------------------------------------------------------------------------------------------

function Config(options, StateMachine) {

  options = options || {};

  this.options     = options; // preserving original options can be useful (e.g visualize plugin)
  this.defaults    = StateMachine.defaults;
  this.states      = [];
  this.transitions = [];
  this.map         = {};
  this.lifecycle   = this.configureLifecycle();
  this.init        = this.configureInitTransition(options.init);
  this.data        = this.configureData(options.data);
  this.methods     = this.configureMethods(options.methods);

  this.map[this.defaults.wildcard] = {};

  this.configureTransitions(options.transitions || []);

  this.plugins = this.configurePlugins(options.plugins, StateMachine.plugin);

}

//-------------------------------------------------------------------------------------------------

mixin(Config.prototype, {

  addState: function(name) {
    if (!this.map[name]) {
      this.states.push(name);
      this.addStateLifecycleNames(name);
      this.map[name] = {};
    }
  },

  addStateLifecycleNames: function(name) {
    this.lifecycle.onEnter[name] = camelize.prepended('onEnter', name);
    this.lifecycle.onLeave[name] = camelize.prepended('onLeave', name);
    this.lifecycle.on[name]      = camelize.prepended('on',      name);
  },

  addTransition: function(name) {
    if (this.transitions.indexOf(name) < 0) {
      this.transitions.push(name);
      this.addTransitionLifecycleNames(name);
    }
  },

  addTransitionLifecycleNames: function(name) {
    this.lifecycle.onBefore[name] = camelize.prepended('onBefore', name);
    this.lifecycle.onAfter[name]  = camelize.prepended('onAfter',  name);
    this.lifecycle.on[name]       = camelize.prepended('on',       name);
  },

  mapTransition: function(transition) {
    var name = transition.name,
        from = transition.from,
        to   = transition.to;
    this.addState(from);
    if (typeof to !== 'function')
      this.addState(to);
    this.addTransition(name);
    this.map[from][name] = transition;
    return transition;
  },

  configureLifecycle: function() {
    return {
      onBefore: { transition: 'onBeforeTransition' },
      onAfter:  { transition: 'onAfterTransition'  },
      onEnter:  { state:      'onEnterState'       },
      onLeave:  { state:      'onLeaveState'       },
      on:       { transition: 'onTransition'       }
    };
  },

  configureInitTransition: function(init) {
    if (typeof init === 'string') {
      return this.mapTransition(mixin({}, this.defaults.init, { to: init, active: true }));
    }
    else if (typeof init === 'object') {
      return this.mapTransition(mixin({}, this.defaults.init, init, { active: true }));
    }
    else {
      this.addState(this.defaults.init.from);
      return this.defaults.init;
    }
  },

  configureData: function(data) {
    if (typeof data === 'function')
      return data;
    else if (typeof data === 'object')
      return function() { return data; }
    else
      return function() { return {};  }
  },

  configureMethods: function(methods) {
    return methods || {};
  },

  configurePlugins: function(plugins, builtin) {
    plugins = plugins || [];
    var n, max, plugin;
    for(n = 0, max = plugins.length ; n < max ; n++) {
      plugin = plugins[n];
      if (typeof plugin === 'function')
        plugins[n] = plugin = plugin()
      if (plugin.configure)
        plugin.configure(this);
    }
    return plugins
  },

  configureTransitions: function(transitions) {
    var i, n, transition, from, to, wildcard = this.defaults.wildcard;
    for(n = 0 ; n < transitions.length ; n++) {
      transition = transitions[n];
      from  = Array.isArray(transition.from) ? transition.from : [transition.from || wildcard]
      to    = transition.to || wildcard;
      for(i = 0 ; i < from.length ; i++) {
        this.mapTransition({ name: transition.name, from: from[i], to: to });
      }
    }
  },

  transitionFor: function(state, transition) {
    var wildcard = this.defaults.wildcard;
    return this.map[state][transition] ||
           this.map[wildcard][transition];
  },

  transitionsFor: function(state) {
    var wildcard = this.defaults.wildcard;
    return Object.keys(this.map[state]).concat(Object.keys(this.map[wildcard]));
  },

  allStates: function() {
    return this.states;
  },

  allTransitions: function() {
    return this.transitions;
  }

});

//-------------------------------------------------------------------------------------------------

module.exports = Config;

//-------------------------------------------------------------------------------------------------


/***/ }),
/* 4 */
/***/ (function(module, exports, __nested_webpack_require_10554__) {


var mixin      = __nested_webpack_require_10554__(0),
    Exception  = __nested_webpack_require_10554__(6),
    plugin     = __nested_webpack_require_10554__(1),
    UNOBSERVED = [ null, [] ];

//-------------------------------------------------------------------------------------------------

function JSM(context, config) {
  this.context   = context;
  this.config    = config;
  this.state     = config.init.from;
  this.observers = [context];
}

//-------------------------------------------------------------------------------------------------

mixin(JSM.prototype, {

  init: function(args) {
    mixin(this.context, this.config.data.apply(this.context, args));
    plugin.hook(this, 'init');
    if (this.config.init.active)
      return this.fire(this.config.init.name, []);
  },

  is: function(state) {
    return Array.isArray(state) ? (state.indexOf(this.state) >= 0) : (this.state === state);
  },

  isPending: function() {
    return this.pending;
  },

  can: function(transition) {
    return !this.isPending() && !!this.seek(transition);
  },

  cannot: function(transition) {
    return !this.can(transition);
  },

  allStates: function() {
    return this.config.allStates();
  },

  allTransitions: function() {
    return this.config.allTransitions();
  },

  transitions: function() {
    return this.config.transitionsFor(this.state);
  },

  seek: function(transition, args) {
    var wildcard = this.config.defaults.wildcard,
        entry    = this.config.transitionFor(this.state, transition),
        to       = entry && entry.to;
    if (typeof to === 'function')
      return to.apply(this.context, args);
    else if (to === wildcard)
      return this.state
    else
      return to
  },

  fire: function(transition, args) {
    return this.transit(transition, this.state, this.seek(transition, args), args);
  },

  transit: function(transition, from, to, args) {

    var lifecycle = this.config.lifecycle,
        changed   = this.config.options.observeUnchangedState || (from !== to);

    if (!to)
      return this.context.onInvalidTransition(transition, from, to);

    if (this.isPending())
      return this.context.onPendingTransition(transition, from, to);

    this.config.addState(to);  // might need to add this state if it's unknown (e.g. conditional transition or goto)

    this.beginTransit();

    args.unshift({             // this context will be passed to each lifecycle event observer
      transition: transition,
      from:       from,
      to:         to,
      fsm:        this.context
    });

    return this.observeEvents([
                this.observersForEvent(lifecycle.onBefore.transition),
                this.observersForEvent(lifecycle.onBefore[transition]),
      changed ? this.observersForEvent(lifecycle.onLeave.state) : UNOBSERVED,
      changed ? this.observersForEvent(lifecycle.onLeave[from]) : UNOBSERVED,
                this.observersForEvent(lifecycle.on.transition),
      changed ? [ 'doTransit', [ this ] ]                       : UNOBSERVED,
      changed ? this.observersForEvent(lifecycle.onEnter.state) : UNOBSERVED,
      changed ? this.observersForEvent(lifecycle.onEnter[to])   : UNOBSERVED,
      changed ? this.observersForEvent(lifecycle.on[to])        : UNOBSERVED,
                this.observersForEvent(lifecycle.onAfter.transition),
                this.observersForEvent(lifecycle.onAfter[transition]),
                this.observersForEvent(lifecycle.on[transition])
    ], args);
  },

  beginTransit: function()          { this.pending = true;                 },
  endTransit:   function(result)    { this.pending = false; return result; },
  failTransit:  function(result)    { this.pending = false; throw result;  },
  doTransit:    function(lifecycle) { this.state = lifecycle.to;           },

  observe: function(args) {
    if (args.length === 2) {
      var observer = {};
      observer[args[0]] = args[1];
      this.observers.push(observer);
    }
    else {
      this.observers.push(args[0]);
    }
  },

  observersForEvent: function(event) { // TODO: this could be cached
    var n = 0, max = this.observers.length, observer, result = [];
    for( ; n < max ; n++) {
      observer = this.observers[n];
      if (observer[event])
        result.push(observer);
    }
    return [ event, result, true ]
  },

  observeEvents: function(events, args, previousEvent, previousResult) {
    if (events.length === 0) {
      return this.endTransit(previousResult === undefined ? true : previousResult);
    }

    var event     = events[0][0],
        observers = events[0][1],
        pluggable = events[0][2];

    args[0].event = event;
    if (event && pluggable && event !== previousEvent)
      plugin.hook(this, 'lifecycle', args);

    if (observers.length === 0) {
      events.shift();
      return this.observeEvents(events, args, event, previousResult);
    }
    else {
      var observer = observers.shift(),
          result = observer[event].apply(observer, args);
      if (result && typeof result.then === 'function') {
        return result.then(this.observeEvents.bind(this, events, args, event))
                     .catch(this.failTransit.bind(this))
      }
      else if (result === false) {
        return this.endTransit(false);
      }
      else {
        return this.observeEvents(events, args, event, result);
      }
    }
  },

  onInvalidTransition: function(transition, from, to) {
    throw new Exception("transition is invalid in current state", transition, from, to, this.state);
  },

  onPendingTransition: function(transition, from, to) {
    throw new Exception("transition is invalid while previous transition is still in progress", transition, from, to, this.state);
  }

});

//-------------------------------------------------------------------------------------------------

module.exports = JSM;

//-------------------------------------------------------------------------------------------------


/***/ }),
/* 5 */
/***/ (function(module, exports, __nested_webpack_require_16556__) {

"use strict";


//-----------------------------------------------------------------------------------------------

var mixin    = __nested_webpack_require_16556__(0),
    camelize = __nested_webpack_require_16556__(2),
    plugin   = __nested_webpack_require_16556__(1),
    Config   = __nested_webpack_require_16556__(3),
    JSM      = __nested_webpack_require_16556__(4);

//-----------------------------------------------------------------------------------------------

var PublicMethods = {
  is:                  function(state)       { return this._fsm.is(state)                                     },
  can:                 function(transition)  { return this._fsm.can(transition)                               },
  cannot:              function(transition)  { return this._fsm.cannot(transition)                            },
  observe:             function()            { return this._fsm.observe(arguments)                            },
  transitions:         function()            { return this._fsm.transitions()                                 },
  allTransitions:      function()            { return this._fsm.allTransitions()                              },
  allStates:           function()            { return this._fsm.allStates()                                   },
  onInvalidTransition: function(t, from, to) { return this._fsm.onInvalidTransition(t, from, to)              },
  onPendingTransition: function(t, from, to) { return this._fsm.onPendingTransition(t, from, to)              },
}

var PublicProperties = {
  state: {
    configurable: false,
    enumerable:   true,
    get: function() {
      return this._fsm.state;
    },
    set: function(state) {
      throw Error('use transitions to change state')
    }
  }
}

//-----------------------------------------------------------------------------------------------

function StateMachine(options) {
  return apply(this || {}, options);
}

function factory() {
  var cstor, options;
  if (typeof arguments[0] === 'function') {
    cstor   = arguments[0];
    options = arguments[1] || {};
  }
  else {
    cstor   = function() { this._fsm.apply(this, arguments) };
    options = arguments[0] || {};
  }
  var config = new Config(options, StateMachine);
  build(cstor.prototype, config);
  cstor.prototype._fsm.config = config; // convenience access to shared config without needing an instance
  return cstor;
}

//-------------------------------------------------------------------------------------------------

function apply(instance, options) {
  var config = new Config(options, StateMachine);
  build(instance, config);
  instance._fsm();
  return instance;
}

function build(target, config) {
  if ((typeof target !== 'object') || Array.isArray(target))
    throw Error('StateMachine can only be applied to objects');
  plugin.build(target, config);
  Object.defineProperties(target, PublicProperties);
  mixin(target, PublicMethods);
  mixin(target, config.methods);
  config.allTransitions().forEach(function(transition) {
    target[camelize(transition)] = function() {
      return this._fsm.fire(transition, [].slice.call(arguments))
    }
  });
  target._fsm = function() {
    this._fsm = new JSM(this, config);
    this._fsm.init(arguments);
  }
}

//-----------------------------------------------------------------------------------------------

StateMachine.version  = '3.0.1';
StateMachine.factory  = factory;
StateMachine.apply    = apply;
StateMachine.defaults = {
  wildcard: '*',
  init: {
    name: 'init',
    from: 'none'
  }
}

//===============================================================================================

module.exports = StateMachine;


/***/ }),
/* 6 */
/***/ (function(module, exports, __nested_webpack_require_20240__) {

"use strict";


module.exports = function(message, transition, from, to, current) {
  this.message    = message;
  this.transition = transition;
  this.from       = from;
  this.to         = to;
  this.current    = current;
}


/***/ })
/******/ ]);
});

/***/ }),

/***/ "./src/dataset.ts":
/*!************************!*\
  !*** ./src/dataset.ts ***!
  \************************/
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

/***/ "./src/event-type.ts":
/*!***************************!*\
  !*** ./src/event-type.ts ***!
  \***************************/
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
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! javascript-state-machine */ "./node_modules/javascript-state-machine/lib/state-machine.js");
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mouse_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mouse-handler */ "./src/mouse-handler.ts");
/* harmony import */ var _touch_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./touch-handler */ "./src/touch-handler.ts");
/* harmony import */ var _recorder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./recorder */ "./src/recorder.ts");
/* harmony import */ var _dataset__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dataset */ "./src/dataset.ts");





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
            const Handler = !isTouchEnabled() ? _mouse_handler__WEBPACK_IMPORTED_MODULE_1__.default : _touch_handler__WEBPACK_IMPORTED_MODULE_2__.default;
            this.bounds.set(identifier, {
                recorder: new _recorder__WEBPACK_IMPORTED_MODULE_3__.default(targetEls),
                event: new Handler(targetEls),
            });
        }
        const [key] = Array.from(this.bounds.keys());
        const bounds = this.bounds.get(key);
        this.currentBoundsType = key;
        this.recorder = bounds.recorder;
        this.event = bounds.event;
        this.event.addListeners(this.container);
        this.media = javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__.create(_dataset__WEBPACK_IMPORTED_MODULE_4__.default.media);
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

/***/ "./src/mouse-handler.ts":
/*!******************************!*\
  !*** ./src/mouse-handler.ts ***!
  \******************************/
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
/* harmony import */ var _pointer_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pointer-handler */ "./src/pointer-handler.ts");
/* harmony import */ var _event_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-type */ "./src/event-type.ts");


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

/***/ "./src/pointer-handler.ts":
/*!********************************!*\
  !*** ./src/pointer-handler.ts ***!
  \********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_exports__, __webpack_require__.r, __webpack_require__.* */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! javascript-state-machine */ "./node_modules/javascript-state-machine/lib/state-machine.js");
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _target__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./target */ "./src/target.ts");
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tracker */ "./src/tracker.ts");
/* harmony import */ var _dataset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dataset */ "./src/dataset.ts");




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

/***/ "./src/recorder.ts":
/*!*************************!*\
  !*** ./src/recorder.ts ***!
  \*************************/
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
/* harmony import */ var _tracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tracker */ "./src/tracker.ts");

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

/***/ "./src/target.ts":
/*!***********************!*\
  !*** ./src/target.ts ***!
  \***********************/
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
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! javascript-state-machine */ "./node_modules/javascript-state-machine/lib/state-machine.js");
/* harmony import */ var javascript_state_machine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(javascript_state_machine__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dataset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dataset */ "./src/dataset.ts");


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

/***/ "./src/touch-handler.ts":
/*!******************************!*\
  !*** ./src/touch-handler.ts ***!
  \******************************/
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
/* harmony import */ var _pointer_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pointer-handler */ "./src/pointer-handler.ts");
/* harmony import */ var _event_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-type */ "./src/event-type.ts");


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

/***/ "./src/tracker.ts":
/*!************************!*\
  !*** ./src/tracker.ts ***!
  \************************/
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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