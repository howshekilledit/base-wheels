
let cnvs;
function setup(){
  //cnvs = SVG().addTo('body').size(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight);
}

function draw(){
  background(0);
  noFill();
  stroke(255);
  strokeWeight(1);
  translate(width/2, height/2);
  beginShape();
  for(let i = 0; i < 1000; i++){
    let r = 100 + 50 * sin(i/10);
    let x = r * cos(i);
    let y = r * sin(i);
    vertex(x, y);
  }
  endShape();


}

function spin(r, f){
  var x = r * cos(f) + ctr.x;
  var y = r * sin(f) + ctr.y;
  return createVector(x, y);
}