class Color {
    public r : number;
    public g : number;
    public b : number;

    constructor (r : number, g : number, b :number) {
        this.r = r;
        this.g = g;  
        this.b = b;
    }

    public Multiply (x : number) : Color {
        return new Color (this.r * x, this.g * x, this.b* x);
    }

    // returns a hex string representation of the color
    // credit: https://stackoverflow.com/a/5624139
    public Hex () {
        return "0x" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
    }   
}
