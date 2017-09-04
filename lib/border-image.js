
/** Get border image base64 string
 *
 * @param {string} color - border color
 *
 * @param {object} radius - border radius object
 *                          {
 *                             top: 0, left: 0, right: 0, bottom: 0
 *                          }
 *
 * @return {string} base64 image string
 *
 */
module.export = function getBorderImage(color, radius) {
  return getSVG(color, radius);
};

function getSVG(color, radius = 0) {
  let svg = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="10" height="10" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <rect
    x="1" y="1" rx="${radius}" ry="${radius}" width="8" height="8"
    style="fill:transparent;fill-opacity:0;
    stroke:${color};stroke-width:1;stroke-opacity:1"
  />
</svg>`;
  // const fs = require('fs');
  // fs.open('./test.svg', 'w', (err, fd) => {
  //   fs.write(fd, svg);
  // });
  return 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64');
}
// console.log(getSVG('blue', "50%"));
