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
      var maxY = n - 1;
      for (var s = 1; s < n; s *= 2) {
        rx = 1 & t / 2;
        ry = 1 & (t ^ rx);
        rot(s, xy, rx, ry);
        xy[0] += s * rx;
        xy[1] += s * ry;
        t /= 4;
      }
      xy[1] = maxY - xy[1];
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

export { d3Hilbert as default };
//# sourceMappingURL=d3-hilbert.js.map
