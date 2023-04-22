import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Hilbert Curve

A simple representation of the [Hilbert curve](https://en.wikipedia.org/wiki/Hilbert_curve), using [d3-hilbert](https://github.com/vasturiano/d3-hilbert) layout.
Use the slider to modify the curve order (number of iterations).
On mouse hover, XY coordinates are reversely converted to curve distance.
Zoom/pan the canvas using mouse-wheel/drag events.

See also [Morton (Z-order) curve](https://observablehq.com/@vasturiano/morton-z-order-curve).
`
)}

function _domEl(d3,canvasWidth,hilbert)
{
  // static html
  const domEl = document.createElement('div');
  
  const root = d3.select(domEl)
    .style('text-align', 'center');
  
  const svg = root.append('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasWidth);
  
  const canvas = svg.append('g');
  canvas.append('path').attr('class', 'skeleton');
  canvas.append('path');
  
  // Canvas zoom/pan
  svg.call(d3.zoom()
    .translateExtent([[0, 0], [canvasWidth, canvasWidth]])
    .scaleExtent([1, Infinity])
    .on('zoom', () => canvas.attr('transform', d3.event.transform))
  );
  
  // Value tooltip
  const valTooltip = root.append('div')
    .attr('id', 'val-tooltip');
  
  svg.on('mouseover', () => valTooltip.style('display', 'inline'))
    .on('mouseout', () => valTooltip.style('display', 'none'))
    .on('mousemove', () => {
      const coords = d3.mouse(canvas.node());    
      valTooltip
        .text(hilbert.getValAtXY(coords[0], coords[1]))
        .style('left', `${d3.event.pageX}px`)
        .style('top', `${coords[1]}px`);    
    });
  
  return domEl;
}


function _order(slider){return(
slider({
  min: 0, 
  max: 9, 
  step: 1,
  value: 3,
  description: "Order"
})
)}

function _4(d3,domEl,hilbertData,order)
{ // d3 digest
  const svg = d3.select(domEl).select('svg');
  
  const getHilbertPath = vertices => {
    let path = 'M0 0L0 0';

    vertices.forEach(vert => {
      switch(vert) {
        case 'U': path += 'v-1'; break;
        case 'D': path += 'v1'; break;
        case 'L': path += 'h-1'; break;
        case 'R': path += 'h1'; break;
      }
    });
    return path;
  }
  
  svg.selectAll('path')
    .datum(hilbertData)
    .attr('d', d => getHilbertPath(d.pathVertices))
    .attr('transform', d => `scale(${d.cellWidth}) translate(${d.startCell[0] + .5}, ${d.startCell[1] + .5})`);

  svg.select('path:not(.skeleton)')
    .transition().duration(order * 1000).ease(d3.easePoly)
    .attrTween('stroke-dasharray', function () {
      const l = this.getTotalLength();
      const i = d3.interpolateString("0," + l, l + "," + l);
      return t => i(t);
    });
}


function _hilbertData(order,hilbert)
{ 
  const hilbertData = {
    start: 0,
    length: Math.pow(4, order)
  };
  
  hilbert.order(order).layout(hilbertData);
  
  return hilbertData;               
}


function _hilbert(d3,canvasWidth){return(
d3.hilbert()
  .canvasWidth(canvasWidth)
  .simplifyCurves(false)
)}

function _canvasWidth(width){return(
Math.min(width, 480)
)}

function _8(md){return(
md`**Style**`
)}

function _9(html){return(
html`<style>
svg path {
  fill: none;
  stroke: #3A5894;
  stroke-width: 0.3;
  stroke-linecap: square;
}

svg path.skeleton {
  stroke: #EEE;
  stroke-width: 0.1;
}

#val-tooltip {
  display: none;
  position: absolute;
  margin-top: 22px;
  margin-left: -1px;
  padding: 5px;
  border-radius: 3px;
  font: 11px sans-serif;
  color: #eee;
  background: rgba(0,0,140,0.9);
  text-align: center;
  pointer-events: none;
}
</style>`
)}

function _10(md){return(
md `**Dependencies**`
)}

function _d3(require){return(
require('d3@5', 'd3-hilbert')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("domEl")).define("domEl", ["d3","canvasWidth","hilbert"], _domEl);
  main.variable(observer("viewof order")).define("viewof order", ["slider"], _order);
  main.variable(observer("order")).define("order", ["Generators", "viewof order"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","domEl","hilbertData","order"], _4);
  main.variable(observer("hilbertData")).define("hilbertData", ["order","hilbert"], _hilbertData);
  main.variable(observer("hilbert")).define("hilbert", ["d3","canvasWidth"], _hilbert);
  main.variable(observer("canvasWidth")).define("canvasWidth", ["width"], _canvasWidth);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["html"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  return main;
}
