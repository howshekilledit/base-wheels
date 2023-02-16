class gear {
    constructor(n, ctr, r, th = 10) {
        this.n = n; //number of teeth
        this.angle = 360 / n; //angle between teeth
        this.rotation = 0; //rotation of gear
        this.ctr = ctr; //center of gear
        this.r = r; //radius of gear
        this.th = th; //thickness of gear 
        this.m = r / (r - th); //ratio of inner radius to outer radius
        this.pts = []; //array of points
        this.rotate_amt = this.angle / 10; //amount to rotate gear on each frame
        for (var i = 0; i < n; i++) {
            this.pts.push(pt_on_round(r, i * this.angle, ctr)); //outer points
            this.pts.push(pt_on_round(r / this.m, i * this.angle + this.angle / 2, ctr)); //inner points
        }
        this.pts.push(this.pts[0]); //close the polygon

    }
    draw_svg() {
        this.rotation = 0; 
        var gearpts = this.pts.map(pt => [pt.x, pt.y]);
        this.svg_gear = cnvs.polyline(gearpts).fill('none').stroke({ width: 1, color: '#000' });
        //this.svg_gear.rotate(270);
    }
    label_svg(n, font_size = 20) { //label the gear teeth
        //parameters: n = base of gearset, font_size = size of font
        this.svg_gear = cnvs.group().add(this.svg_gear);
        this.lbls = []; //array of labels
        let exp = log(floor(this.pts.length / 2)) / log(n) - 1; //get exponent of gear
       
        for (let [i, pt] of this.pts.entries()) {
            if (i % 2 == 0 && i < this.pts.length - 1) {
                let index = floor(i / 2);
                //change direction of numbering based on wheel direction
                let lbl_txt; 
                if (this.rotate_amt < 0) {
                    lbl_txt = floor(index / (n ** exp));
                } else {
                    lbl_txt = floor((n ** exp - index / (n ** exp))%n);
                }
               
                let coord = pt_on_round(this.r - this.th, index * this.angle, this.ctr);
                let lbl = cnvs.text(lbl_txt).move(coord.x - font_size / 3, coord.y - font_size / 2).font({ size: font_size, family: 'Monospace', anchor: 'left', leading: '0em'});
                lbl.rotate(index * this.angle + 90);
                this.lbls.push(lbl);
                //let ccl = cnvs.circle(6).move(coord.x-3, coord.y-3);
                this.svg_gear.add(lbl);
                //this.svg_gear.add(ccl);
            }
        }
    }
    rotate_svg(angle = this.rotate_amt, update = true) {
        this.svg_gear.rotate(angle);
        if (update) {
            this.rotation = (this.rotation + angle) % 360;
        }
        //if(this.rotation % this.angle == 0){
            this.shift_colored_lbl();
        //}
    }
    shift_colored_lbl(){ //shift the colored label to the current tooth
        this.lbls.map(lbl => lbl.font({fill:'#000'}));
        let index = floor((this.rotation + this.angle/4) / this.angle);
        if (index < 0){
            index = abs(index)%this.n;
        } else {
            index = (this.n - index)%this.n;
        }
        let lbl = this.lbls[index];
        lbl.font({fill:'#f00'});
        this.focused_lbl = lbl.text();    
    }
    draw_focus_window(){ //draw circle around apex tooh of gear
        let window_ctr = pt_on_round(this.r - this.th, this.rotation - 90, this.ctr);
        this.window_ctr = window_ctr;
        let window_diam = min(this.th*2, 10*this.r/this.n);
        this.svg_window = cnvs.circle(window_diam).move(
            window_ctr.x-window_diam/2, window_ctr.y-window_diam/2).fill('none').stroke({width:1, color:'#f00'});
        //this.svg_gear.add(window);

    }
}


class gearset { 
    constructor(base, n_digits, max_r = 150,
        th = 20, offset = createVector(th, th), first = createVector(1000, 300)) {
        this.base = base;
        this.n_digits = n_digits;
        this.gears = [];
        this.th = th; //thickness of gears
        let r = max_r / (n_digits);
        let x = first.x; //x coordinate of first gear
        let y = first.y; //y coordinate of first gear
        for (var i = 1; i <= n_digits; i++) {
            let n = base ** i;

            r = max_r / (n_digits - i + 1);
            x -= r + offset.x;
            this.gears.push(new gear(n, createVector(x, y), r, th));
            if (i % 2) {
                this.gears[i - 1].rotate_amt *= -1;
            }
            x -= r - 1;
            if (i % 2) {
                y += offset.y;
            } else {
                y -= offset.y;
            }
        }
    }
    draw_svg() {
        for (let g of this.gears) {

            g.draw_svg();
        }
    }
    label_svg() {
        for (let g of this.gears) {
            g.label_svg(this.base);
        }
    }
    rotate_svg(angle = false, update = true) {
        for (var i = 0; i < this.n_digits; i++) {
            if (angle) {
                this.gears[i].rotate_svg(angle, update);
            } else {
                this.gears[i].rotate_svg();
            }
        }
    }

    addGear(gear) {
        this.gear.push(gear);
    }
    getGear() {
        return this.gear;
    }
    delete_svg(){
        for (let g of this.gears){
            g.svg_gear.remove();
            g.svg_window.remove();
        }
    }
    draw_focus_windows(){
        for (let g of this.gears){
            g.draw_focus_window();
        }
    }
    get_output(){
        let output = '';
        for (let g of this.gears){
            output  = g.focused_lbl + output ;
        }
        return output;
    }
}
//function that generates a coordinate along a circle
//parameters: radius, angle, center
function pt_on_round(r, f, ctr) {
    var x = r * cos(f) + ctr.x;
    var y = r * sin(f) + ctr.y;
    return createVector(x, y);
}