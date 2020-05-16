/// <reference path="./color.ts" /> 
/// <reference path="./Vector3.ts" /> 

class Triangle {

    public p1 : Vector3; // top
    public p2 : Vector3; // right
    public p3 : Vector3; // left     

    public c1 : Color; // top color
    public c2 : Color; // right color
    public c3 : Color; // left color

    public w1 : number;
    public w2 : number;
    public w3 : number;

    private finalColor : number;
    
    private graphic : PIXI.Graphics;

    constructor (top : Vector3, right : Vector3, left : Vector3) {            
        this.p1 = top;
        this.p2 = right;
        this.p3 = left;
        
        // this.finalColor = this.rgb2hex(255,255,0);

        this.c1 = new Color (255,0,0);
        this.c2 = new Color (0,255,0);
        this.c3 = new Color (0,0,255);

        this.w1 = 0;
        this.w2 = 0;
        this.w3 = 0;
    }

    public draw () : PIXI.Graphics {
        if (this.graphic == null) {
            this.graphic = new PIXI.Graphics();                              
        }
        
        this.graphic.clear();
        this.graphic.beginFill(this.finalColor); // Dark blue gray 'ish

        // this.graphic.lineStyle(5, this.finalColor, 1);
        this.graphic.moveTo(this.p1.x, this.p1.y);
        this.graphic.lineTo(this.p2.x, this.p2.y);
        this.graphic.lineTo(this.p3.x, this.p3.y);
        this.graphic.lineTo(this.p1.x, this.p1.y);
        this.graphic.endFill(); // Dark blue gray 'ish

        return this.graphic;
    }

    private clamp (x: number, min: number, max: number) {
        return Math.min(Math.max(x, min), max)
    }

    public isInside (p : Vector3) : boolean {            
        
        // barycentric coords: https://codeplea.com/triangular-interpolation
        var w1 = ((this.p2.y-this.p3.y)*(p.x-this.p3.x) + (this.p3.x - this.p2.x)*(p.y-this.p3.y)) / 
        ((this.p2.y-this.p3.y)*(this.p1.x-this.p3.x)+(this.p3.x - this.p2.x)*(this.p1.y-this.p3.y));

        var w2 = ((this.p3.y - this.p1.y)*(p.x-this.p3.x) + (this.p1.x-this.p3.x)*(p.y-this.p3.y)) /
        ((this.p2.y - this.p3.y)*(this.p1.x-this.p3.x) + (this.p3.x - this.p2.x)*(this.p1.y-this.p3.y));

        var w3 = 1.0-this.w1-this.w2;    

        // different approach
        // var f1  = Vector3.Subtract (this.p1, p);
        // var f2  = Vector3.Subtract (this.p2, p);
        // var f3  = Vector3.Subtract (this.p3, p);
        // var a = Vector3.Cross(Vector3.Subtract(this.p1, this.p2), Vector3.Subtract(this.p1, this.p3)).Magnitude(); // main triangle area a            
        // this.w1 = this.clamp(Vector3.Cross(f2, f3).Magnitude() / a, 0, 1);
        // this.w2 = this.clamp(Vector3.Cross(f3, f1).Magnitude() / a, 0, 1); // p2's triangle area / a 
        // this.w3 = this.clamp(Vector3.Cross(f1, f2).Magnitude() / a, 0, 1); // p3's triangle area / a        
        
        var inside = w1 >= 0 && w2 >= 0 && (w1 + w2) < 1;

        if (inside) {
            this.w1 = w1, this.w2 = w2, this.w3 = w3;
                // mix the colours
            var top = this.c1.Multiply(this.w1);
            var left = this.c2.Multiply(this.w2);
            var right = this.c3.Multiply(this.w3);

            // work out a final color for the triangle
            var fc = new Color (top.r+left.r+right.r, top.g+left.g+right.g,top.b+left.b+right.b);
            var col = fc.Hex();
            this.finalColor = parseInt(col, 16);  
        }

        return inside;
    }

    private rgb2hex(r : number, g: number, b:number) {
        return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }         
}