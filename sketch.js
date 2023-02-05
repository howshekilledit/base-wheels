
let cnvs;
let ctr;
let bin_gearset; 
function setup(){
  cnvs = SVG().addTo('body').size(windowWidth, windowHeight);
  //createCanvas(windowWidth, windowHeight);
  ctr = createVector(windowWidth/2, windowHeight/2);
  
  //set mode to degrees
  angleMode(DEGREES);
  //noLoop(); 
  frameRate(10);
  bin_gearset = new gearset(2, 6);


}

function draw(){
  bin_gearset.draw_svg();
 
  

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

