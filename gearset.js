let odd_gear_color = '#ff0000';
let even_gear_color = '#0000ff';
let highlight_color = '#00ff00';
let stroke_color = '#ffffff';
let gear_color = '#000000';
let font_color = '#ffffff';
let stroke_width = 2;
let f_size = 18;

class gear {
    constructor(n, ctr, r, th = 10, color = gear_color) {
        this.n = n; //number of teeth
        this.angle = 360 / n; //angle between teeth
        this.rotation = 0; //rotation of gear
        this.ctr = ctr; //center of gear
        this.r = r; //radius of gear
        this.th = th; //thickness of gear 
        this.m = r / (r - th); //ratio of inner radius to outer radius
        this.pts = []; //array of points
        this.t = 0; //highlighted tooth
        this.f = 0; //rotating frames elapsed
        this.fr = 10; //rotating frames per tooth
        this.rotate_amt = this.angle / this.fr; //amount to rotate gear on each frame
	this.color = color; //color of gear
        //outer gear points
        for (var i = 0; i < n; i++) {
            //outer gear points
            this.pts.push(pt_on_round(r, i * this.angle, ctr)); //outer points
            this.pts.push(pt_on_round(r / this.m, i * this.angle + this.angle / 2, ctr)); //inner points
        }
        this.pts.push(this.pts[0]); //close the polygon
        this.inner_pts = []; //array of inner points
        let inner_radius = r - th * 1.5;
        for (var i = 0; i < n; i++) {
            this.inner_pts.push(pt_on_round(inner_radius, i * this.angle, ctr));
            this.inner_pts.push(pt_on_round(inner_radius / this.m, i * this.angle + this.angle / 2, ctr)); //inner points
        }
        this.inner_pts.push(this.inner_pts[0]); //close the polygon

    }
    draw_svg(clr = this.color) {
        this.rotation = 0;
        //generate random color
        this.color = clr;
        var gearpts = this.pts.map(pt => [pt.x, pt.y]);
        var innerpts = this.inner_pts.map(pt => [pt.x, pt.y]);
        this.svg_gear = cnvs.group();
	//outer gear
        this.svg_gear.add(cnvs.polyline(gearpts).fill(this.color));
	//inner gear
        this.svg_gear.add(cnvs.polyline(innerpts).fill(stroke_color));
        //this.svg_gear.rotate(270);
    }
    label_svg(n, font_size = f_size) { //label the gear teeth
        //parameters: n = base of gearset, font_size = size of font
        this.svg_gear = cnvs.group().add(this.svg_gear);
        this.lbls = []; //array of labels
        let exp = log(floor(this.pts.length / 2)) / log(n) - 1; //get exponent of gear

        for (let [i, pt] of this.pts.entries()) {
            if (i % 2 == 0 && i < this.pts.length - 1) {
                let index = floor(i / 2);
                //change direction of numbering based on wheel direction
                let lbl_txt;
                // if (this.rotate_amt < 0) {
                lbl_txt = floor(index / (n ** exp));
                // } else {
                //     lbl_txt = floor((n ** exp - index / (n ** exp))%n);
                // }
                let coord = pt_on_round(this.r - this.th, index * this.angle, this.ctr);
                let lbl = cnvs.text(lbl_txt).move(coord.x - font_size / 3, coord.y - font_size / 2).font({ size: font_size, family: 'Monospace', anchor: 'left', leading: '0em' });
                lbl.rotate(index * this.angle + 180);
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

            this.f++; //increment frame counter
            if (this.f % this.fr == 0) { //if a whole tooth has been rotated
                this.t = (this.t + 1) % this.n
                //this.t = this.t%this.n;
                this.shift_colored_lbl();
            }


        }

    }


    shift_colored_lbl() { //shift the colored label to the current tooth
        this.lbls.map(lbl => lbl.font({ fill: font_color }));
        this.lbls[this.t].font(({ fill: highlight_color}));
        this.focused_lbl = this.lbls[this.t].text();
        // let index = floor((this.rotation + this.angle/4) / this.angle);
        // if (index < 0){
        //     index = abs(index)%this.n;
        // } else {
        //     index = (this.n - index)%this.n;
        // }
        // let lbl = this.lbls[index];
        // lbl.font({fill:'#f00'});
        // this.focused_lbl = lbl.text();    
    }
    draw_focus_window() { //draw circle around apex tooh of gear
        let window_ctr = pt_on_round(this.r - this.th, this.rotation, this.ctr);
        this.window_ctr = window_ctr;
        let window_diam = min(this.th * 2, 10 * this.r / this.n);
        this.svg_window = cnvs.circle(window_diam).move(
            window_ctr.x - window_diam / 2, window_ctr.y - window_diam / 2).fill('none').stroke({ width: 2, color: highlight_color });
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
        let x = first.x; //x coordinate of first gear
        let y = first.y; //y coordinate of first gear
        let r = max_r;
        for (var i = n_digits; i >= 1; i--) {
            let n = base ** i;
            if (i < n_digits) {
                r /= base / 2;
                r -= th;
                x += r + 2 * th;
            }
		let gcolor;
	    if(i % 2){
		    gcolor = odd_gear_color;
		}
		else{
			gcolor = even_gear_color;
		}
            //x -= r + offset.x;
            let next_gear = new gear(n, createVector(x, y), r, th);
            x -= r;

            // if (i % 2) {
            next_gear.rotate_amt *= -1;
            //}
            this.gears.push(next_gear);
            //x -= r - 1;
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
    delete_svg() {
        for (let g of this.gears) {
            g.svg_gear.remove();
            //g.svg_window.remove();
        }
    }
    draw_focus_windows() {
        for (let g of this.gears) {
            g.draw_focus_window();
        }
    }
    get_output() {
        let output = '';
        for (let g of this.gears) {
            output = output + g.focused_lbl;
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
