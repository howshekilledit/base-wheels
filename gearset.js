class gear{
    constructor(n, ctr, r, m) {
        this.n = n; //number of teeth
        this.angle = 360/n; //angle between teeth
        this.ctr = ctr; //center of gear
        this.r = r; //radius of gear
        this.m = m; //ratio of inner radius to outer radius
        this.pts = []; //array of points
        for(var i = 0; i < n; i++){
            this.pts.push(pt_on_round(r, i*this.angle, ctr)); //outer points
            this.pts.push(pt_on_round(r/m, i*this.angle + this.angle/2, ctr)); //inner points
            this.pts.push(this.pts[0]); //close the polygon
        }
    }
   
    draw_svg(){
        var gearpts = this.pts.map(pt => [pt.x, pt.y]);
        this.svg_gear = cnvs.polyline(gearpts).fill('none').stroke({width: 1, color: '#000'});
    }
}

class gearset {
    constructor(base, n_digits) {
        this.base = base;
        this.n_digits = n_digits;
        this.gears = [];
        for(var i = 0; i < n_digits; i++){
            this.gears.push(new gear(base, i));
        }
    }
    addGear(gear) {
        this.gear.push(gear);
    }
    getGear() {
        return this.gear;
    }
}

function pt_on_round(r, f, ctr){
    var x = r * cos(f) + ctr.x;
    var y = r * sin(f) + ctr.y;
    return createVector(x, y);
  }