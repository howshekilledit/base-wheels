class gear{
    constructor(n, ctr, r, th = 10) {
        this.n = n; //number of teeth
        this.angle = 360/n; //angle between teeth
        this.ctr = ctr; //center of gear
        this.r = r; //radius of gear
        this.th = th; //thickness of gear 
        this.m = r / (r - th); //ratio of inner radius to outer radius
        //this.m = 1.1;
        this.pts = []; //array of points
        this.rotate_amt = this.angle/10; //amount to rotate gear on each frame
        for(var i = 0; i < n; i++){
            this.pts.push(pt_on_round(r, i*this.angle, ctr)); //outer points
            this.pts.push(pt_on_round(r/this.m, i*this.angle + this.angle/2, ctr)); //inner points
        }
        this.pts.push(this.pts[0]); //close the polygon

    }
    draw_svg(){
        var gearpts = this.pts.map(pt => [pt.x, pt.y]);
        this.svg_gear = cnvs.polyline(gearpts).fill('none').stroke({width: 1, color: '#000'});
    }
    rotate_svg(){
        this.svg_gear.rotate(this.rotate_amt);
    }
}

class gearset {
    constructor(base, n_digits, max_r = 150, th = 10) {
        this.base = base;
        this.n_digits = n_digits;
        this.gears = [];
        this.th = th; //thickness of gears
        let r = max_r/(n_digits);
        let x = ctr.x; //x coordinate of center of gear
        let y = ctr.y; //y coordinate of center of gear
        for(var i = 1; i <= n_digits; i++){
            let n = base**i;
            console.log(n);
            r = max_r/(n_digits-i+1);
            x+=r-th/2; 
            this.gears.push(new gear(n, createVector(x, y), r, th));
            if(i%2){
                this.gears[i-1].rotate_amt *= -1;
            }
            x += r+1;
            if(i%2){
                y += th/2+1; 
            }else{
                y -= th/2+1;
            }
        }
    }
    draw_svg(){
        for(let g of this.gears){

            g.draw_svg();
        }
    }
    rotate_svg(){
        for(var i = 0; i < this.n_digits; i++){
           
            this.gears[i].rotate_svg();
        }
    }
    addGear(gear) {
        this.gear.push(gear);
    }
    getGear() {
        return this.gear;
    }
}
//function that generates coordinates along a circle
//arguments: radius, angle, center
function pt_on_round(r, f, ctr){ 
    var x = r * cos(f) + ctr.x;
    var y = r * sin(f) + ctr.y;
    return createVector(x, y);
  }