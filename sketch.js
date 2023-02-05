
let cnvs;
let ctr;
let gearpts = [];
let tgear; //32 teeth gear
let sgear; //16 teeth gear
function setup(){
  cnvs = SVG().addTo('body').size(windowWidth, windowHeight);
  //createCanvas(windowWidth, windowHeight);
  ctr = createVector(windowWidth/2, windowHeight/2);
  
  //set mode to degrees
  angleMode(DEGREES);
  //noLoop(); 
  frameRate(10);
  //gearpts = round_polygon(ctr.x, ctr.y, 100,4);
  // gearpts = gear_polygon(ctr.x, ctr.y, 200, 32, 1.2);
  // gearpts = gearpts.map(pt => [pt.x, pt.y]);
  // gear = cnvs.polyline(gearpts).fill('none').stroke({width: 1, color: '#000'});
  tgear = new gear(32, ctr, 200, 1.2);
  tgear.draw_svg();
  sgear = new gear(16, createVector(ctr.x +280, ctr.y+13), 100, 1.4);
  sgear.draw_svg();


}

function draw(){
 
  noFill();
  stroke(255);
  strokeWeight(1);

  tgear.svg_gear.rotate(1);
  sgear.svg_gear.rotate(-2);

}



//function that generates coordinates along a circle
function round_polygon(x, y, r, n){
  var pts = [];
  var angle = 360/n;
  for(var i = 0; i < n; i++){
    var pt = spin(r, i*angle);
    pts.push(pt);
  }
  pts.push(pts[0]);
  return pts;
}

//function that generates coordiantes along a gear
//arguments: center x, center y, radius, number of teeth, ratio of inner radius to outer radius
function gear_polygon(x, y, r, n, m){
  var pts = [];
  var angle = 360/n;
  for(var i = 0; i < n; i++){
    var pt = spin(r, i*angle);
    pts.push(pt);
    var pt = spin(r/m, i*angle + angle/2);
    pts.push(pt);
  }
  pts.push(pts[0]);
  return pts;
}

