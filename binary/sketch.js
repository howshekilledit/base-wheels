
let cnvs;
let ctr;
let ten_gearset; 
let bin_gearset; 
let set; 
let output_text; 
function setup(){
  cnvs = SVG().addTo('body').size(windowWidth, windowHeight);
  //createCanvas(windowWidth, windowHeight);
  ctr = createVector(200, windowHeight/2);
  
  
  //set mode to degrees
  angleMode(DEGREES);
  //noLoop(); 
  frameRate(10);
  ten_gearset = new gearset(10,2, 300, 40, createVector(0, 5));

 
  bin_gearset = new gearset(2, 5, 250, 20, createVector(-10, 20), createVector(windowWidth - 150, windowHeight/2));
  set = draw_set(bin_gearset);
  //create buttons to toggle between gearsets
  // let btn = createButton('Toggle Gearset');
  // btn.position(10, 10);
  // btn.mousePressed(function(){
  //   if(set == bin_gearset){
  //     set = draw_set(ten_gearset, bin_gearset);
  //   } else {
  //     set = draw_set(bin_gearset, ten_gearset);
  //   }
  // }); 
  output_text = cnvs.text(' ').move(10, 50).font({size: 20, family: 'Helvetica'});


}

function draw(){
  set.rotate_svg();
  // let output = set.get_output();
  // output_text.text(output);
  
  
 
  

}


function draw_set(set, other_set = false){
  if(other_set){
    other_set.delete_svg();
  } 
  set.draw_svg();
  set.label_svg();
  set.rotate_svg(270, false);
  set.draw_focus_windows(); 
  return set; 
}

