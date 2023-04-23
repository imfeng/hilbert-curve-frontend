import d3Hilbert from '../docs/dist/d3-hilbert.js'
const args = process.argv.slice(2);
const order = parseInt(args[0]) || 6;
function main() {
  console.log(d3Hilbert)
  const H = d3Hilbert().simplifyCurves(true);
  const axies = []; 
  for (let index = 0; index < Math.pow(2, order); index++) {
    const xy = H.getXyAtVal(index);
    axies.push({
      index,
      xy,
    });
    // console.log(index, xy)
  }

  const sortedAxies = sortMap(axies);
  // console.log(sortedAxies)

  draw(sortedAxies);
}

main();

function sortMap(axies) {
  return axies.sort((a, b) => {
    const [aX, aY] = a.xy;
    const [bX, bY] = b.xy;
    if(aY === bY) {
      return aX - bX; // ASC
    }
    return bY - aY; // DESC
  })
}

function draw(paths) {
  let currentY = paths[0].xy[1];
  let line = '';
  for (let idx = 0; idx < paths.length; idx++) {
    const path = paths[idx];
    const { index, xy } = path;
    const [x, y] = xy;
    if(currentY !== y) {
      console.log(line);
      currentY = y;
      line = '';
    }
    line += index + '\t';

    if(idx === paths.length - 1) {
      console.log(line);
    }
  }
}

function sortDESC(a, b) {
  return b - a;
}