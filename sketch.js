
let cnvs;
let ctr;
let gearpts = [];
let gear; 
function setup(){
  cnvs = SVG().addTo('body').size(windowWidth, windowHeight);
  //createCanvas(windowWidth, windowHeight);
  ctr = createVector(windowWidth/2, windowHeight/2);
  
  //set mode to degrees
  angleMode(DEGREES);
  ///noLoop(); 
  //gearpts = round_polygon(ctr.x, ctr.y, 100,4);
  gearpts = gear_polygon(ctr.x, ctr.y, 100, 16, 1.5);
  gearpts = gearpts.map(pt => [pt.x, pt.y]);
  gear = cnvs.polyline(gearpts).fill('none').stroke({width: 1, color: '#000'});



}

function draw(){
 
  noFill();
  stroke(255);
  strokeWeight(1);
  let pt = spin(100, frameCount );
  ellipse(pt.x, pt.y, 10, 10);
  gear.rotate(1);

}

function spin(r, f){
  var x = r * cos(f) + ctr.x;
  var y = r * sin(f) + ctr.y;
  return createVector(x, y);
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