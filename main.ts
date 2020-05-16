/// <reference path="../pixi/pixi-typescript/pixi.js.d.ts" /> 
/// <reference path="./triangle.ts" /> 
/// <reference path="./Vector3.ts" /> 

class Main {
    private app: PIXI.Application;
    private stage: PIXI.Container;

    private triangle : Triangle;

    private w1text : PIXI.Text;
    private w2text : PIXI.Text;
    private w3text : PIXI.Text;
    private total : PIXI.Text;

    private pointer :PIXI.Graphics;

    private c1 :PIXI.Graphics;
    private c2 :PIXI.Graphics;
    private c3 :PIXI.Graphics;

    private animations: PIXI.extras.AnimatedSprite[];
    private animation: PIXI.extras.AnimatedSprite;
            
    constructor() {            
        this.app = new PIXI.Application({
            autoResize: true,
            resolution: devicePixelRatio 
        });
        this.stage = this.app.stage;
        
        var that = this;
        document.querySelector('#stage-barycentric').appendChild(this.app.view);
        var resize = ()=> {                                            
            const parent = that.app.view.parentElement;
            let ratioX = parent.clientWidth / 400;                
            this.app.renderer.resize(400*ratioX, 400*ratioX);
        };            
        window.addEventListener('resize', resize);
        
        this.triangle = new Triangle(
            new Vector3(200,100,0), // top point
            new Vector3(50,300,0), // right
            new Vector3(350,300,0) // left
        );
        this.app.stage.addChild(this.triangle.draw());
                    
        this.pointer = new PIXI.Graphics();
        this.pointer.lineStyle(5, 0x4A5FB4, 1);
        this.pointer.drawCircle(0,0,5);
        this.app.stage.addChild(this.pointer);

        // this.w1text = this.MakeText('w1', 200, 80);
        // this.w2text = this.MakeText('w2', 40, 210);
        // this.w3text = this.MakeText('w3', 350, 210);
        // this.total = this.MakeText('Total', 50, 50);
        
        this.c1 = new PIXI.Graphics;
        this.c2 = new PIXI.Graphics;
        this.c3 = new PIXI.Graphics;

        this.stage.addChild(this.c1);
        this.stage.addChild(this.c2);
        this.stage.addChild(this.c3);

        PIXI.loader            
        .add("animations", "graphics/sprite.json")
        .load ((loader: PIXI.loaders.Loader, resources: any)=>{this.onLoad(loader, resources)});

        this.app.stage.interactive = true;
        this.app.stage.on('mousemove', (event : PIXI.interaction.InteractionEvent)=>{
            var p = event.data.getLocalPosition(event.currentTarget);
            
            this.c1.clear();
            this.c1.lineStyle(1, parseInt(this.triangle.c1.Hex(), 16), 1);
            this.c1.moveTo(this.triangle.p1.x,this.triangle.p1.y);
            this.c1.lineTo(this.pointer.position.x, this.pointer.position.y);
            
            this.c2.clear();
            this.c2.lineStyle(1, parseInt(this.triangle.c2.Hex(), 16), 1);
            this.c2.moveTo(this.triangle.p2.x,this.triangle.p2.y);
            this.c2.lineTo(this.pointer.position.x, this.pointer.position.y);
            
            this.c3.clear();
            this.c3.lineStyle(1, parseInt(this.triangle.c3.Hex(), 16), 1);
            this.c3.moveTo(this.triangle.p3.x,this.triangle.p3.y);
            this.c3.lineTo(this.pointer.position.x, this.pointer.position.y);

            if (this.triangle.isInside(
                new Vector3 (
                    event.data.getLocalPosition(event.currentTarget).x,
                    event.data.getLocalPosition(event.currentTarget).y,
                    0
                )
            )) {
                this.pointer.position = p;
            }
            this.triangle.draw();
        }); 
                
        this.app.ticker.add (delta => this.update(delta));       
        resize();
    }

    // Callback for when all resources have loaded
    private onLoad (loader: PIXI.loaders.Loader, resources: any) {
        // load all our anims
        this.animations = [];

        var frames = [];
        var attackOne: PIXI.extras.AnimatedSprite;
        var attackTwo: PIXI.extras.AnimatedSprite;
        var attackThree: PIXI.extras.AnimatedSprite;

        attackOne = this.MakeAnimation("adventurer-attack1-", 5, 200, 300);
        this.app.stage.addChild(attackOne);
        this.animations.push(attackOne);

        attackTwo = this.MakeAnimation("adventurer-attack2-", 5, 50, 300);
        this.app.stage.addChild(attackTwo);
        this.animations.push(attackTwo);

        attackThree = this.MakeAnimation("adventurer-attack3-", 5, 350, 300);
        this.app.stage.addChild(attackThree);
        this.animations.push(attackThree);          
        
        // set up the current one to play
        this.newAnim();          
    }   

    // Create a new text component and add to the stage
    private MakeText (str: string, x: number, y: number) : PIXI.Text {
        const style = {
            font : 'bold italic 12px Arial',
            fill : '#F7EDCA',
            stroke : '#4a1850',
            strokeThickness : 5,
            dropShadow : true,
            dropShadowColor : '#000000',
            dropShadowAngle : Math.PI / 6,
            dropShadowDistance : 6,
            wordWrap : true,
            wordWrapWidth : 440
        };

        let text : PIXI.Text = new PIXI.Text(str, style);
        text.x = x;
        text.y = y;
        this.stage.addChild(text);
        return text;
    }

    // Create all animation objects in scene
    private MakeAnimation (ident: string, frameCount : number, x: number, y: number) : PIXI.extras.AnimatedSprite {
        var anim: PIXI.extras.AnimatedSprite;
        var frames = [];

        for (var i = 0; i < frameCount; i++) {
            var val = i < frameCount ? '0' + i : i;                
            frames.push(PIXI.Texture.fromFrame(ident + val + '.png'));
        }            
        
        anim = new PIXI.extras.AnimatedSprite(frames);     
        
        anim.position = new PIXI.Point(x-(anim.width*1.5)*.5, y);
        anim.scale = new PIXI.Point(1.5, 1.5)
        anim.animationSpeed = 0.25;    
        return anim;        
    }

    // What it says on the tin...
    private clamp (x: number, min: number, max: number) {
        return Math.min(Math.max(x, min), max)
    }

    // Calculate which animation to play next
    private newAnim () {        

        var w1 = this.clamp (this.triangle.w1, 0, 1);
        var w2 = this.clamp (this.triangle.w2, 0, 1);
        var w3 = this.clamp (this.triangle.w3, 0, 1);

        var weights = [w1, w2, w3];
        
        var weightedTotal = w1+w2+w3;           

        // pick a random number between 1 and total 
        var randomWeight = Math.random() * weightedTotal;

        // console.log("random weight:" + randomWeight);

        var animationIndex = 0;

        for (var i = 0; i < weights.length; i++) {
            randomWeight -= weights[i]
            if (randomWeight <= 0) {
                animationIndex = i;
                break;
            }
        }   
        this.animation = this.animations[animationIndex];               

        this.animation.onLoop = ()=> {                 
            this.animation.stop();
            this.newAnim(); 
        }            
        this.animation.play();
    }

    private update (delta : number) : void {
        // this.w1text.text = this.triangle.w1.toFixed(2);
        // this.w2text.text = this.triangle.w2.toFixed(2);
        // this.w3text.text = this.triangle.w3.toFixed(2);
        
        // this.total.text = "Total: "+(this.triangle.w1+this.triangle.w2+this.triangle.w3).toFixed(2);

        this.app.render();
    }
}

new Main();
