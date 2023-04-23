import { select, pointer } from 'd3-selection';
import { scaleOrdinal, scaleLinear } from 'd3-scale';
import { schemePaired } from 'd3-scale-chromatic';
import { axisLeft, axisRight, axisTop, axisBottom } from 'd3-axis';
import { zoomTransform, zoom } from 'd3-zoom';
import d3Tip from 'd3-tip';
import gsap from 'gsap';
import heatmap from 'heatmap.js';
import Kapsule from 'kapsule';
import accessorFn from 'accessor-fn';

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === 'undefined') {
    return;
  }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".hilbert-chart {\n  font-family: Sans-serif;\n}\n\n.hilbert-chart .hilbert-segment path {\n  fill: none;\n  stroke-linecap: square;\n\n  opacity: 1;\n  transition: opacity 0.4s;\n}\n\n.hilbert-chart .hilbert-segment path:hover {\n  opacity: 0.8;\n  transition: opacity 0.2s;\n}\n\n.hilbert-chart .hilbert-segment text {\n  pointer-events: none;\n}\n\n.hilbert-chart .hilbert-heatmap {\n  position: absolute;\n  pointer-events: none;\n}\n\n.hilbert-tooltip {\n  color: #eee;\n  background: rgba(0, 0, 0, 0.6);\n  padding: 5px;\n  border-radius: 3px;\n  font: 11px sans-serif;\n  text-align: center;\n  pointer-events: none;\n}\n\n.hilbert-tooltip#val-tooltip {\n  display: none;\n  position: absolute;\n  margin-top: 20px;\n  margin-left: -10px;\n }\n\n.hilbert-tooltip#range-tooltip {\n  display: none;\n  position: absolute;\n  margin-top: -44px;\n  transform: translateX(-50%);\n}\n";
styleInject(css_248z);

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

function d3Hilbert () {
  // Hilbert curve algo, from https://en.wikipedia.org/wiki/Hilbert_curve#Applications_and_mapping_algorithms
  var hilbert = function () {
    //rotate/flip a quadrant appropriately
    function rot(n, xy, rx, ry) {
      if (ry == 0) {
        if (rx == 1) {
          xy[0] = n - 1 - xy[0];
          xy[1] = n - 1 - xy[1];
        }

        //Swap x and y
        xy.push(xy.shift());
      }
    }

    // Note: this function will start breaking down for n > 2^26 (MAX_SAFE_INTEGER = 2^53)
    // x,y: cell coordinates, n: sqrt of num cells (square side size)
    function point2Distance(x, y, n) {
      var rx,
        ry,
        d = 0,
        xy = [x, y];
      for (var s = n / 2; s >= 1; s /= 2) {
        rx = (xy[0] & s) > 0;
        ry = (xy[1] & s) > 0;
        d += s * s * (3 * rx ^ ry);
        rot(s, xy, rx, ry);
      }
      return d;
    }

    // d: distance, n: sqrt of num cells (square side size)
    function distance2Point(d, n) {
      var rx,
        ry,
        t = d,
        xy = [0, 0];
      //   const maxY = n - 1;

      for (var s = 1; s < n; s *= 2) {
        rx = 1 & t / 2;
        ry = 1 & (t ^ rx);
        rot(s, xy, rx, ry);
        xy[0] += s * rx;
        xy[1] += s * ry;
        t /= 4;
      }
      //   xy[1] = maxY - xy[1];
      return xy;
    }
    return {
      point2Distance: point2Distance,
      distance2Point: distance2Point
    };
  }();
  var hilbertLayout = {},
    canvasWidth = 1,
    order = 4,
    simplifyCurves = true;
  hilbertLayout.canvasWidth = function (_) {
    if (!arguments.length) return canvasWidth;
    canvasWidth = +_;
    return hilbertLayout;
  };

  // Note: Maximum safe order is 26, due to JS numbers upper-boundary of 53 bits
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
  hilbertLayout.order = function (_) {
    if (!arguments.length) return order;
    order = +_;
    return hilbertLayout;
  };
  hilbertLayout.simplifyCurves = function (_) {
    if (!arguments.length) return simplifyCurves;
    simplifyCurves = _;
    return hilbertLayout;
  };
  hilbertLayout.layout = function (range) {
    var d = getHilbertPath(range.start, range.length, order, canvasWidth, simplifyCurves);
    range.cellWidth = d.cellWidth;
    range.startCell = d.startCell;
    range.pathVertices = d.pathVertices;
    range.vec = d.vec;
    return _objectSpread2(_objectSpread2({}, range), d);
  };
  hilbertLayout.getValAtXY = function (x, y) {
    var n = Math.pow(2, order),
      xy = [x, y].map(function (coord) {
        return Math.floor(coord * n / canvasWidth);
      });
    return hilbert.point2Distance(xy[0], xy[1], n);
  };
  hilbertLayout.getXyAtVal = function (val) {
    if (val > Math.pow(4, order) || val < 0) {
      console.error('Value is outside hilbert space boundaries.');
      return null;
    } else {
      return hilbert.distance2Point(val, Math.pow(2, order));
    }
  };
  return hilbertLayout;

  //

  function getHilbertPath(start, length, order, sideSize, simplifyCurves) {
    if (simplifyCurves) {
      // Adjust resolution
      while (!Number.isInteger(start) || !Number.isInteger(length)) {
        start *= 4;
        length *= 4;
        order += 1;
      }

      // resolution simplification
      while (!(start % 4) && !(length % 4) && order > 0) {
        start /= 4;
        length /= 4;
        order -= 1;
      }
    }

    // prevent overflow
    var maxPos = Math.pow(4, order);
    start = Math.min(start, maxPos);
    length = Math.min(length, maxPos - start);

    // nSide is on a binary boundary 2^0, 2^1, 2^2, ...
    var nSide = Math.pow(2, order),
      cellWidth = sideSize / nSide;
    var startCell = hilbert.distance2Point(start, nSide),
      vertices = [],
      prevPnt = startCell,
      pnt;
    for (var i = 1; i < length; i++) {
      pnt = hilbert.distance2Point(start + i, nSide);
      vertices.push(pnt[0] > prevPnt[0] ? 'R' : pnt[0] < prevPnt[0] ? 'L' : pnt[1] > prevPnt[1] ? 'D' : 'U');
      prevPnt = pnt;
    }
    var pp = hilbert.distance2Point(start + 1, nSide);
    var startPP = startCell;
    var vec = pp[0] > startPP[0] ? 'R' : pp[0] < startPP[0] ? 'L' : pp[1] > startPP[1] ? 'D' : 'U';
    return {
      cellWidth: cellWidth,
      startCell: startCell,
      pathVertices: vertices,
      vec: vec
    };
  }
}

/** Render text along a path in a Canvas
*	Adds extra functionality to the CanvasRenderingContext2D by extending its prototype.
*	Extent the global object with options:
*		- textOverflow {undefined|visible|ellipsis|string} the text to use on overflow, default "" (hidden)
*		- textJustify {undefined|boolean} used to justify text (otherwise use textAlign), default false
*		- textStrokeMin {undefined|number} the min length (in pixel) for the support path to draw the text upon, default 0
* 
* @param {string} text the text to render
* @param {Array<Number>} path an array of coordinates as support for the text (ie. [x1,y1,x2,y2,...]
*/
(function () {
  /* Usefull function */
  function dist2D(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /* Add new properties on CanvasRenderingContext2D */
  CanvasRenderingContext2D.prototype.textOverflow = "";
  CanvasRenderingContext2D.prototype.textJustify = false;
  CanvasRenderingContext2D.prototype.textStrokeMin = 0;
  var state = [];
  var save = CanvasRenderingContext2D.prototype.save;
  CanvasRenderingContext2D.prototype.save = function () {
    state.push({
      textOverflow: this.textOverflow,
      textJustify: this.textJustify,
      textStrokeMin: this.textStrokeMin
    });
    save.call(this);
  };
  var restore = CanvasRenderingContext2D.prototype.restore;
  CanvasRenderingContext2D.prototype.restore = function () {
    restore.call(this);
    var s = state.pop();
    this.textOverflow = s.textOverflow;
    this.textJustify = s.textJustify;
    this.textStrokeMin = s.textStrokeMin;
  };

  /* textPath function */
  CanvasRenderingContext2D.prototype.textPath = function (text, path) {
    // Helper to get a point on the path, starting at dl 
    // (return x, y and the angle on the path)
    var di,
      dpos = 0;
    var pos = 2;
    function pointAt(dl) {
      if (!di || dpos + di < dl) {
        for (; pos < path.length;) {
          di = dist2D(path[pos - 2], path[pos - 1], path[pos], path[pos + 1]);
          if (dpos + di > dl) break;
          pos += 2;
          if (pos >= path.length) break;
          dpos += di;
        }
      }
      var x,
        y,
        dt = dl - dpos;
      if (pos >= path.length) {
        pos = path.length - 2;
      }
      if (!dt) {
        x = path[pos - 2];
        y = path[pos - 1];
      } else {
        x = path[pos - 2] + (path[pos] - path[pos - 2]) * dt / di;
        y = path[pos - 1] + (path[pos + 1] - path[pos - 1]) * dt / di;
      }
      return [x, y, Math.atan2(path[pos + 1] - path[pos - 1], path[pos] - path[pos - 2])];
    }
    var letterPadding = this.measureText(" ").width * 0.25;

    // Calculate length
    var d = 0;
    for (var i = 2; i < path.length; i += 2) {
      d += dist2D(path[i - 2], path[i - 1], path[i], path[i + 1]);
    }
    if (d < this.minWidth) return;
    var nbspace = text.split(" ").length - 1;

    // Remove char for overflow
    if (this.textOverflow != "visible") {
      if (d < this.measureText(text).width + (text.length - 1 + nbspace) * letterPadding) {
        var overflow = this.textOverflow == "ellipsis" ? "\u2026" : this.textOverflow || "";
        var dt = overflow.length - 1;
        do {
          if (text[text.length - 1] === " ") nbspace--;
          text = text.slice(0, -1);
        } while (text && d < this.measureText(text + overflow).width + (text.length + dt + nbspace) * letterPadding);
        text += overflow;
      }
    }

    // Calculate start point
    var start = 0;
    switch (this.textJustify || this.textAlign) {
      case true: // justify
      case "center":
      case "end":
      case "right":
        {
          // Justify
          if (this.textJustify) {
            start = 0;
            letterPadding = (d - this.measureText(text).width) / (text.length - 1 + nbspace);
          }
          // Text align
          else {
            start = d - this.measureText(text).width - (text.length + nbspace) * letterPadding;
            if (this.textAlign == "center") start /= 2;
          }
          break;
        }
    }

    // Do rendering
    for (var t = 0; t < text.length; t++) {
      var letter = text[t];
      var wl = this.measureText(letter).width;
      var p = pointAt(start + wl / 2);
      this.save();
      this.textAlign = "center";
      this.translate(p[0], p[1]);
      this.rotate(p[2]);
      if (this.lineWidth > 0.1) this.strokeText(letter, 0, 0);
      this.fillText(letter, 0, 0);
      this.restore();
      start += wl + letterPadding * (letter == " " ? 2 : 1);
    }
  };
})();

var N_TICKS = Math.pow(2, 3); // Force place ticks on bit boundaries

var hilbert = Kapsule({
  props: {
    isSelectedError: {
      "default": false,
      triggerUpdate: true
    },
    width: {},
    margin: {
      "default": 90
    },
    hilbertOrder: {
      "default": 4
    },
    // 0-255 default
    data: {
      "default": []
    },
    rangeLabel: {
      "default": 'name'
    },
    rangeColor: {},
    rangePadding: {
      "default": 0
    },
    valFormatter: {
      "default": function _default(d) {
        return d;
      }
    },
    showValTooltip: {
      "default": true,
      triggerUpdate: false
    },
    showRangeTooltip: {
      "default": true,
      triggerUpdate: false
    },
    rangeTooltipContent: {
      triggerUpdate: false
    },
    onRangeClick: {
      triggerUpdate: false
    },
    onRangeHover: {
      triggerUpdate: false
    },
    activeMap: {
      "default": {},
      triggerUpdate: true
    }
  },
  methods: {
    hilbert: function hilbert(state) {
      return state.hilbert;
    },
    focusOn: function focusOn(state, pos, length, transitionDuration) {
      setTimeout(function () {
        // async so that it runs after initialization
        var N_SAMPLES = Math.pow(4, 2) + 1; // +1 to sample outside of bit boundaries
        var pnts = [{
          start: pos,
          length: 1
        }].concat(_toConsumableArray(_toConsumableArray(Array(N_SAMPLES).keys()).map(function (n) {
          return {
            start: pos + Math.round(length * (n + 1) / N_SAMPLES),
            length: 1
          };
        })));
        pnts.forEach(state.hilbert.layout);

        // Figure out bounding box (in side bit units)
        var tl = [Math.min.apply(Math, _toConsumableArray(pnts.map(function (p) {
          return p.startCell[0];
        }))), Math.min.apply(Math, _toConsumableArray(pnts.map(function (p) {
          return p.startCell[1];
        })))];
        var br = [Math.max.apply(Math, _toConsumableArray(pnts.map(function (p) {
          return p.startCell[0];
        }))), Math.max.apply(Math, _toConsumableArray(pnts.map(function (p) {
          return p.startCell[1];
        })))];
        var side = Math.max(br[0] - tl[0], br[1] - tl[1]);
        var destination = {
          x: -tl[0] * state.canvasWidth / side,
          y: -tl[1] * state.canvasWidth / side,
          k: Math.pow(2, state.hilbertOrder) / side
        };
        var zoomTransform$1 = zoomTransform(state.zoom.__baseElem.node());
        if (!transitionDuration) {
          // no animation
          state.zoom.transform(state.zoom.__baseElem, Object.assign(zoomTransform$1, destination));
        } else {
          gsap.to(zoomTransform$1, Object.assign({
            duration: transitionDuration / 1000,
            ease: 'power1.inOut',
            onUpdate: function onUpdate() {
              return state.zoom.transform(state.zoom.__baseElem, zoomTransform$1);
            }
          }, destination));
        }
      });
      return this;
    },
    addMarker: function addMarker(state, pos, markerUrl, width, height, tooltipFormatter) {
      if (state.useCanvas) return this; // not supported in canvas mode

      tooltipFormatter = tooltipFormatter || function (d) {
        return state.valFormatter(d.start);
      };
      var range = {
        start: pos,
        length: 1
      };
      state.hilbert.layout(range);
      var marker = state.svg.select('.markers-canvas').append('svg:image').attr('xlink:href', markerUrl).attr('width', width).attr('height', height).attr('x', range.startCell[0] * range.cellWidth - width / 2).attr('y', range.startCell[1] * range.cellWidth - height / 2);

      // Tooltip
      var markerTooltip = d3Tip().attr('class', 'hilbert-tooltip').offset([-15, 0]).html(tooltipFormatter);
      state.svg.call(markerTooltip);
      marker.on('mouseover', function (ev, d) {
        return markerTooltip.show(d);
      });
      marker.on('mouseout', function (ev, d) {
        return markerTooltip.hide(d);
      });
      return this;
    },
    addHeatmap: function addHeatmap(pnts) {
      if (state.useCanvas) return this; // not supported in canvas mode

      var hmData = pnts.map(function (pnt) {
        var hPnt = {
          start: pnt,
          length: 1
        };
        state.hilbert.layout(hPnt);
        return {
          x: Math.round(hPnt.startCell[0] * hPnt.cellWidth),
          y: Math.round(hPnt.startCell[1] * hPnt.cellWidth),
          value: 1
        };
      });
      var svgBox = state.svg.node().getBoundingClientRect();
      var hmElem = select(state.nodeElem).append('div').attr('class', 'hilbert-heatmap').style('top', svgBox.top + state.margin + 'px').style('left', svgBox.left + state.margin + 'px').append('div').style('width', state.canvasWidth + 'px').style('height', state.canvasWidth + 'px');
      heatmap.create({
        container: hmElem.node()
      }).setData({
        max: 100,
        data: hmData
      });
      return this;
    },
    _refreshAxises: function _refreshAxises(state) {
      // Adjust axises
      var axises = state.axises;
      var axisScaleX = state.zoomedAxisScaleX || state.axisScaleX;
      var axisScaleY = state.zoomedAxisScaleY || state.axisScaleY;
      axisScaleX.range([0, state.canvasWidth]);
      axisScaleY.range([0, state.canvasWidth]);
      state.axisScaleX.range([0, state.canvasWidth]);
      state.axisScaleY.range([0, state.canvasWidth]);
      axises.select('.axis-left').call(state.axisLeft.scale(axisScaleY));
      axises.select('.axis-right').call(state.axisRight.scale(axisScaleY));
      axises.select('.axis-top').call(state.axisTop.scale(axisScaleX)).selectAll('text').attr('x', 9).attr('dy', '.35em').attr('transform', 'rotate(-45)').style('text-anchor', 'start');
      axises.select('.axis-bottom').call(state.axisBottom.scale(axisScaleX)).selectAll('text').attr('x', -9).attr('dy', '.35em').attr('transform', 'rotate(-45)').style('text-anchor', 'end');
      return this;
    },
    toggleLinepaths: function toggleLinepaths(state) {
      state.showLinepaths = !state.showLinepaths;
      return this;
    },
    toggleOriginal: function toggleOriginal(state) {
      state.showOriginal = !state.showOriginal;
      return this;
    },
    addActiveNode: function addActiveNode(state, hIndex) {
      state.activeMap = _objectSpread2(_objectSpread2({}, state.activeMap), {}, _defineProperty({}, hIndex, true));
      console.log(state);
      return true;
    },
    resetActiveNodes: function resetActiveNodes(state) {
      state.activeMap = {};
      return true;
    }
  },
  stateInit: function stateInit() {
    return {
      showOriginal: false,
      showLinepaths: false,
      hilbert: d3Hilbert().simplifyCurves(true),
      defaultColorScale: scaleOrdinal(schemePaired),
      zoomBox: [[0, 0], [N_TICKS, N_TICKS]],
      axisScaleX: scaleLinear().domain([0, N_TICKS]),
      axisScaleY: scaleLinear().domain([0, N_TICKS])
    };
  },
  init: function init(el, state, _ref) {
    var _this = this;
    var _ref$useCanvas = _ref.useCanvas,
      useCanvas = _ref$useCanvas === void 0 ? false : _ref$useCanvas;
    var isD3Selection = !!el && _typeof(el) === 'object' && !!el.node && typeof el.node === 'function';
    var d3El = select(isD3Selection ? el.node() : el);
    d3El.html(null); // Wipe DOM

    // Dom
    state.nodeElem = d3El.node();
    state.useCanvas = useCanvas;
    var svg = state.svg = d3El.attr('class', 'hilbert-chart').append('svg').style('display', 'block');
    state.canvasWidth = state.width || Math.min(window.innerWidth, window.innerHeight) - state.margin * 2;

    // zoom interaction
    state.zoom = zoom().on('zoom', function (ev) {
      var zoomTransform = ev.transform;

      // Adjust axes
      var xScale = state.zoomedAxisScaleX = zoomTransform.rescaleX(state.axisScaleX);
      var yScale = state.zoomedAxisScaleY = zoomTransform.rescaleY(state.axisScaleY);
      state.zoomBox[0] = [xScale.domain()[0], yScale.domain()[0]];
      state.zoomBox[1] = [xScale.domain()[1], yScale.domain()[1]];

      // Apply transform to chart
      if (!useCanvas) {
        // svg
        state.hilbertCanvas.attr('transform', zoomTransform);
        _this._refreshAxises();
      } else {
        // canvas
        // reapply zoom transform on rerender (without recalculating layout)
        state.skipRelayout = true;
        requestAnimationFrame(state._rerender);
      }
    });
    var hilbertCanvas;
    if (!useCanvas) {
      // svg mode
      var defs = state.defs = svg.append('defs');
      var zoomCanvas = state.zoomCanvas = svg.append('g');
      hilbertCanvas = state.hilbertCanvas = zoomCanvas.append('g').attr('class', 'hilbert-canvas');
      hilbertCanvas.append('rect').attr('class', 'zoom-trap').attr('x', 0).attr('y', 0).attr('opacity', 0);
      hilbertCanvas.append('g').attr('class', 'ranges-canvas');
      hilbertCanvas.append('g').attr('class', 'markers-canvas');
      hilbertCanvas.append('g').attr('class', 'pathlines-canvas');

      // Zoom binding
      zoomCanvas.call(state.zoom);
      state.zoom.__baseElem = zoomCanvas; // Attach controlling elem for easy access

      defs.append('clipPath').attr('id', 'canvas-cp').append('rect').attr('x', 0).attr('y', 0);
      zoomCanvas.attr('clip-path', 'url(#canvas-cp)');
    } else {
      // Canvas mode
      hilbertCanvas = state.hilbertCanvas = d3El.style('position', 'relative').append('canvas').attr('class', 'hilbert-canvas').style('display', 'block').style('position', 'absolute');
      state.hilbertCanvasCtx = hilbertCanvas.node().getContext('2d');

      // Zoom binding
      hilbertCanvas.call(state.zoom);
      state.zoom.__baseElem = hilbertCanvas; // Attach controlling elem for easy access
    }

    // Range Tooltip
    var rangeTooltip = select('#range-tooltip');
    if (rangeTooltip.empty()) {
      rangeTooltip = select('body').append('div').attr('id', 'range-tooltip');
    }
    rangeTooltip.classed('hilbert-tooltip', true);
    state.rangeTooltip = rangeTooltip;

    // Value Tooltip
    var valTooltip = select('#val-tooltip');
    if (valTooltip.empty()) {
      valTooltip = select('body').append('div').attr('id', 'val-tooltip');
    }
    valTooltip.classed('hilbert-tooltip', true);
    hilbertCanvas.on('mouseover', function () {
      return state.showValTooltip && valTooltip.style('display', 'inline');
    });
    hilbertCanvas.on('mouseout', function () {
      return valTooltip.style('display', 'none');
    });
    hilbertCanvas.on('mousemove', function (ev) {
      if (state.showValTooltip) {
        var coords = pointer(ev);
        if (state.useCanvas) {
          // Need to consider zoom on canvas
          var zoomTransform$1 = zoomTransform(state.zoom.__baseElem.node());
          coords[0] -= zoomTransform$1.x;
          coords[0] /= zoomTransform$1.k;
          coords[1] -= zoomTransform$1.y;
          coords[1] /= zoomTransform$1.k;
        }
        valTooltip.text(state.valFormatter(state.hilbert.getValAtXY(coords[0], coords[1]))).style('left', "".concat(ev.pageX, "px")).style('top', "".concat(ev.pageY, "px"));
      }
      if (state.showRangeTooltip) {
        rangeTooltip.style('left', "".concat(ev.pageX, "px")).style('top', "".concat(ev.pageY, "px"));
      }
    });

    // Setup axises
    state.axisLeft = axisLeft().tickFormat(getTickFormatter(0));
    state.axisRight = axisRight().tickFormat(getTickFormatter(1));
    state.axisTop = axisTop().tickFormat(getTickFormatter(null, 0));
    state.axisBottom = axisBottom().tickFormat(getTickFormatter(null, 1));
    state.axises = state.svg.append('g').attr('class', 'hilbert-axises');
    state.axises.append('g').attr('class', 'axis-left');
    state.axises.append('g').attr('class', 'axis-right');
    state.axises.append('g').attr('class', 'axis-top');
    state.axises.append('g').attr('class', 'axis-bottom');

    //

    function getTickFormatter(xZoomBoxIdx, yZoomBoxIdx) {
      return function (d) {
        // Convert to canvas coordinates
        var relD = d * state.canvasWidth / N_TICKS;
        var zoomBox = state.zoomBox;
        var nCells = Math.pow(2, state.hilbertOrder);
        var xy = [xZoomBoxIdx != null ? state.axisScaleX(zoomBox[xZoomBoxIdx][0]) : relD, yZoomBoxIdx != null ? state.axisScaleY(zoomBox[yZoomBoxIdx][1]) : relD].map(function (coord) {
          return (
            // Prevent going off canvas
            Math.min(coord, state.canvasWidth * (1 - 1 / nCells))
          );
        });
        return state.valFormatter(state.hilbert.getValAtXY(xy[0], xy[1]));
      };
    }
  },
  update: function update(state) {
    console.log({
      state: state
    });
    var canvasWidth = state.canvasWidth = state.width || Math.min(window.innerWidth, window.innerHeight) - state.margin * 2;
    var labelAcessor = accessorFn(state.rangeLabel);
    var colorAccessor = state.rangeColor ? accessorFn(state.rangeColor) : function (d) {
      return state.defaultColorScale(labelAcessor(d));
    };
    var _paddingAccessorFn = accessorFn(state.rangePadding);
    var paddingAccessor = function paddingAccessor(d) {
      return Math.max(0, Math.min(1, _paddingAccessorFn(d)));
    }; // limit to [0, 1] range

    state.hilbert.order(state.hilbertOrder).canvasWidth(canvasWidth);

    // resizing
    state.svg.attr('width', canvasWidth + state.margin * 2).attr('height', canvasWidth + state.margin * 2);
    state.zoom.scaleExtent([1, Math.pow(2, state.hilbertOrder)]).translateExtent([[0, 0], [canvasWidth, canvasWidth].map(function (w) {
      return w + (state.useCanvas ? 0 : state.margin * 2);
    })]); // fix margin glitch on svg

    state.axises.attr('transform', "translate(".concat(state.margin, ", ").concat(state.margin, ")"));
    state.axises.select('.axis-right').attr('transform', "translate(".concat(canvasWidth, ",0)"));
    state.axises.select('.axis-bottom').attr('transform', "translate(0,".concat(canvasWidth, ")"));
    this._refreshAxises();
    if (!state.skipRelayout) {
      // compute layout
      state.data.forEach(state.hilbert.layout);
    } else {
      state.skipRelayout = false;
    }
    state.useCanvas ? canvasUpdate() : svgUpdate();

    //

    function svgUpdate() {
      // chart resizing
      state.zoomCanvas.attr('transform', "translate(".concat(state.margin, ", ").concat(state.margin, ")"));
      state.hilbertCanvas.select('.zoom-trap').attr('width', canvasWidth).attr('height', canvasWidth);
      state.defs.select('#canvas-cp rect').attr('width', state.canvasWidth).attr('height', state.canvasWidth);

      // D3 digest
      // line START
      if (state.showLinepaths) {
        var _pathlinePaths = state.svg.select('.pathlines-canvas').selectAll('.pathline-segment').data(state.data.slice());
        _pathlinePaths.exit().remove();
        var newLinePaths = _pathlinePaths.enter().append('g').attr('class', 'pathline-segment');
        newLinePaths.append('path');
        newLinePaths.append('line');
        _pathlinePaths = _pathlinePaths.merge(newLinePaths);
        var maxNums = Math.pow(Math.pow(2, state.hilbertOrder), 2);
        _pathlinePaths.selectAll('line').attr('class', 'pathline').attr('x1', function (d) {
          if (d.vec === 'U' || d.vec === 'D') {
            return 0.1;
          }
          return 0;
        }).attr('y1', function (d) {
          if (d.vec === 'L' || d.vec === 'R') {
            return 0.1;
          }
          return 0;
        }).attr('transform', function (d) {
          switch (d.vec) {
            case 'U':
              return "translate(-0.05, -0.45)";
            case 'D':
              return "translate(-0.05, 0.45)";
            case 'L':
              return "translate(-0.45, -0.05)";
            case 'R':
              return "translate(0.45, -0.05)";
          }
        }).style('stroke', function (d) {
          var index = d.start + d.val;
          if (index === maxNums) {
            return 'transparent';
          }
          return floatRateToRgb(d.start / maxNums);
        });
        _pathlinePaths.selectAll('path') //.transition()
        .attr('d', function (d) {
          return getHilbertPath(d.pathVertices);
        }).style('stroke', 'transparent') // colorAccessor, background Color
        .style('stroke-width', function (d) {
          return 1 - paddingAccessor(d);
        }).style('cursor', state.onRangeClick ? 'pointer' : null);
        _pathlinePaths.attr('transform', function (d) {
          return "scale(".concat(d.cellWidth, ") translate(").concat(d.startCell[0] + .5, ",").concat(d.startCell[1] + .5, ")");
        });
      } else {
        pathlinePaths = state.svg.select('.pathlines-canvas').selectAll('.pathline-segment').data([]);
        pathlinePaths.exit().remove();
      }

      // range START
      var rangePaths = state.svg.select('.ranges-canvas').selectAll('.hilbert-segment').data(state.data.slice());
      rangePaths.exit().remove();
      var newPaths = rangePaths.enter().append('g').attr('class', 'hilbert-segment').on('click', function (ev, d) {
        return state.onRangeClick && state.onRangeClick(d);
      }).on('mouseover', function (ev, d) {
        state.rangeTooltip.style('display', 'none');
        if (state.showRangeTooltip) {
          state.rangeTooltip.style('display', 'inline');
          if (state.rangeTooltipContent) {
            state.rangeTooltip.html(accessorFn(state.rangeTooltipContent)(d));
          } else {
            // default tooltip
            var rangeLabel = accessorFn(state.rangeLabel);
            var rangeFormatter = function rangeFormatter(d) {
              return state.valFormatter(d.start) + (d.length > 1 ? ' - ' + state.valFormatter(d.start + d.length - 1) : '');
            };
            state.rangeTooltip.html("<b>".concat(rangeLabel(d), "</b>: ").concat(rangeFormatter(d)));
          }
        }
        state.onRangeHover && state.onRangeHover(d);
      }).on('mouseout', function () {
        state.rangeTooltip.style('display', 'none');
        state.onRangeHover && state.onRangeHover(null);
      });
      newPaths.append('path');
      newPaths.append('text').attr('dy', 0.035).append('textPath')
      // Label that follows the path contour
      .attr('xlink:href', function (d) {
        var id = 'textPath-' + Math.round(Math.random() * 1e10);
        state.defs.append('path').attr('id', id).attr('d', getHilbertPath(d.pathVertices));
        return '#' + id;
      }).text(function (d) {
        var MAX_TEXT_COMPRESSION = 8;
        var name = labelAcessor(d);
        return !d.pathVertices.length || name.length / (d.pathVertices.length + 1) > MAX_TEXT_COMPRESSION ? '' : name;
      }).attr('textLength', function (d) {
        var MAX_TEXT_EXPANSION = 0.4;
        return Math.min(d.pathVertices.length, labelAcessor(d).length * MAX_TEXT_EXPANSION);
      }).attr('startOffset', function (d) {
        if (!d.pathVertices.length) return '0';
        return (1 - select(this).attr('textLength') / d.pathVertices.length) / 2 * 100 + '%';
      });

      // Ensure propagation of data binding into sub-elements
      // rangePaths.select('line');

      // <line id="line" x1="10" y1="10" x2="90" y2="90" stroke="red" />

      rangePaths.select('path');
      rangePaths = rangePaths.merge(newPaths);
      var getColor = function getColor(d) {
        if (state.showOriginal) {
          return d.color;
        }
        if (d.isDisabled) {
          return 'grey';
        }
        if (d.isDisabled && state.activeMap[d.start]) {
          return 'red';
        }
        if (state.activeMap[d.start] && state.isSelectedError) {
          return 'red';
        }
        if (state.activeMap[d.start] && d.color) {
          return d.color;
        }
        return state.activeMap[d.start] ? '#3ff341' : '#c1c1c1';
      };
      rangePaths.selectAll('path') //.transition()
      .attr('d', function (d) {
        return getHilbertPath(d.pathVertices);
      }).style('stroke', getColor) // colorAccessor, background Color
      .style('stroke-width', function (d) {
        return 1 - paddingAccessor(d);
      }).style('cursor', state.onRangeClick ? 'pointer' : null);
      rangePaths.attr('transform', function (d) {
        return "scale(".concat(d.cellWidth, ") translate(").concat(d.startCell[0] + .5, ",").concat(d.startCell[1] + .5, ")");
      });
      rangePaths.selectAll('text').attr('font-size', function (d) {
        return Math.min.apply(Math, [0.25,
        // Max 25% of path height
        (d.pathVertices.length + 1 - paddingAccessor(d)) * 0.25,
        // Max 25% path length
        canvasWidth / d.cellWidth * 0.03 // Max 3% of canvas size
        ]);
      }).attr('textLength', function (d) {
        var MAX_TEXT_EXPANSION;
        var name = labelAcessor(d);
        if (d.pathVertices.length) {
          // Include it on text element for Firefox support
          MAX_TEXT_EXPANSION = 0.4;
          return Math.min(d.pathVertices.length, name.length * MAX_TEXT_EXPANSION);
        } else {
          MAX_TEXT_EXPANSION = 0.15;
          return Math.min(0.95 * (1 - paddingAccessor(d)), name.length * MAX_TEXT_EXPANSION);
        }
      }).filter(function (d) {
        return !d.pathVertices.length;
      })
      // Those with no path (plain square)
      .text(function (d) {
        var MAX_TEXT_COMPRESSION = 10;
        var name = labelAcessor(d);
        return name.length > MAX_TEXT_COMPRESSION ? '' : name;
      }).attr('text-anchor', 'middle');

      //

      function getHilbertPath(vertices) {
        console.log('getHilbertPath');
        var path = 'M0 0L0 0';
        vertices.forEach(function (vert) {
          switch (vert) {
            case 'U':
              path += 'v-1';
              break;
            case 'D':
              path += 'v1';
              break;
            case 'L':
              path += 'h-1';
              break;
            case 'R':
              path += 'h1';
              break;
          }
        });
        return path;
      }
    }
    function canvasUpdate() {
      var pxScale = window.devicePixelRatio; // 2 on retina displays
      var ctx = state.hilbertCanvasCtx;

      // canvas resize (and clear)
      state.hilbertCanvas.style('top', "".concat(state.margin, "px")).style('left', "".concat(state.margin, "px")).style('width', "".concat(canvasWidth, "px")).style('height', "".concat(canvasWidth, "px")).attr('width', state.canvasWidth * pxScale).attr('height', state.canvasWidth * pxScale);
      ctx.clearRect(0, 0, canvasWidth, canvasWidth);

      // Apply zoom transform (respecting pxScale)
      var zoomTransform$1 = zoomTransform(state.zoom.__baseElem.node());
      ctx.translate(zoomTransform$1.x * pxScale, zoomTransform$1.y * pxScale);
      ctx.scale(zoomTransform$1.k * pxScale, zoomTransform$1.k * pxScale);
      var viewWindow = {
        // in px
        x: -zoomTransform$1.x / zoomTransform$1.k,
        y: -zoomTransform$1.y / zoomTransform$1.k,
        len: canvasWidth / zoomTransform$1.k
      };
      var _loop = function _loop() {
        var d = state.data[i];
        var w = d.cellWidth;
        var scaledW = w * zoomTransform$1.k;
        var relPadding = paddingAccessor(d);
        if (d.pathVertices.length === 0) {
          // single cell -> draw a square
          var _d$startCell$map = d.startCell.map(function (c) {
              return c * w;
            }),
            _d$startCell$map2 = _slicedToArray(_d$startCell$map, 2),
            x = _d$startCell$map2[0],
            y = _d$startCell$map2[1];
          if (x > viewWindow.x + viewWindow.len || x + w < viewWindow.x || y > viewWindow.y + viewWindow.len || y + w < viewWindow.y) {
            return "continue"; // cell out of view, no need to draw
          }
          var rectPadding = relPadding * w / 2;
          var rectW = w * (1 - relPadding);
          ctx.fillStyle = colorAccessor(d);
          ctx.fillRect(x + rectPadding, y + rectPadding, rectW, rectW);
          if (scaledW > 12) {
            // Hide labels on small square cells
            var name = labelAcessor(d);
            var fontSize = Math.min(20,
            // absolute
            scaledW * 0.25,
            // Max 25% of cell height
            scaledW * (1 - relPadding) / name.length * 1.5 // Fit text length
            ) / zoomTransform$1.k;
            ctx.font = "".concat(fontSize, "px Sans-Serif");
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText.apply(ctx, [name].concat(_toConsumableArray([x, y].map(function (c) {
              return c + w / 2;
            }))));
          }
        } else {
          var _ref4;
          // draw path (with textpath labels)
          var _d$startCell$map3 = d.startCell.map(function (c) {
              return c * w + w / 2;
            }),
            _d$startCell$map4 = _slicedToArray(_d$startCell$map3, 2),
            _x = _d$startCell$map4[0],
            _y = _d$startCell$map4[1];
          var path = [[_x, _y]].concat(_toConsumableArray(d.pathVertices.map(function (vert) {
            switch (vert) {
              case 'U':
                _y -= w;
                break;
              case 'D':
                _y += w;
                break;
              case 'L':
                _x -= w;
                break;
              case 'R':
                _x += w;
                break;
            }
            return [_x, _y];
          })));
          ctx.strokeStyle = colorAccessor(d);
          ctx.lineWidth = w * (1 - relPadding);
          ctx.lineCap = 'square';
          ctx.beginPath();
          ctx.moveTo.apply(ctx, _toConsumableArray(path[0]));
          path.slice(1).forEach(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
              x = _ref3[0],
              y = _ref3[1];
            return ctx.lineTo(x, y);
          });
          ctx.stroke();

          // extend path extremities to cell edges for textpath
          var pathStart = path[0].map(function (c, idx) {
            return c - (path[1][idx] - c) / 2;
          });
          var pathEnd = path[path.length - 1].map(function (c, idx) {
            return c - (path[path.length - 2][idx] - c) / 2;
          });
          path[0] = pathStart;
          path[path.length - 1] = pathEnd;
          var _name = labelAcessor(d);
          var _fontSize = Math.min(20,
          // absolute
          scaledW * 0.4,
          // Max 40% of cell height
          scaledW * (path.length - relPadding) / _name.length * 1.2 // Fit text length
          ) / zoomTransform$1.k;
          ctx.font = "".concat(_fontSize, "px Sans-Serif");
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.lineWidth = 0.01; // no stroke outline
          ctx.textPath(_name, (_ref4 = []).concat.apply(_ref4, _toConsumableArray(path)));
        }
      };
      for (var i = 0, len = state.data.length; i < len; i++) {
        var _ret = _loop();
        if (_ret === "continue") continue;
      }
    }
  }
});
function floatRateToRgb(floatRate) {
  return "hsl(".concat(Math.round(floatRate * 360), ", 100%, 50%)");
}

export { hilbert as default };
