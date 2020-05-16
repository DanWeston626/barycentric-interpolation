class Vector3 {
    public x: number;
    public y: number;
    public z : number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static Add (a: Vector3, b: Vector3) : Vector3 {
        return new Vector3 (a.x + b.x, a.y + b.y, a.z+ b.z);
    }

    public static Subtract (a: Vector3, b: Vector3) : Vector3 {
        return new Vector3 (a.x - b.x, a.y - b.y, a.z - b.z);
    }

    public static Divide (a: Vector3, x : number) : Vector3 {
        return new Vector3 (a.x / x, a.y / x, a.z / x);
    }

    public static Cross (a: Vector3, b: Vector3) : Vector3 {
        var x = (a.y*b.z)-(a.z*b.y);
        var y = (a.z*b.x)-(a.x*b.z);
        var z = (a.x*b.y)-(a.y*b.x);
        return new Vector3(x,y,z);
    }

    // return the dot product of a and b
    // tip: use this to check the proportional of two vectors pointing in same direction. 
    // Same direction: positive. 
    // Perpendicular: zero
    // Opposite: negative.
    public static Dot (a: Vector3, b : Vector3) : number { 
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    }

    // returns the length of the vector
    public Magnitude () : number {
        return Math.sqrt (this.x*this.x + this.y*this.y + this.z*this.z);            
    }

    // return the normalized length of the vector
    public Normalize () : Vector3 {
        var mag = this.Magnitude ();
        return mag > 0 ? new Vector3 (this.x / mag, this.y / mag, this.z / mag) : this;
    }    
}