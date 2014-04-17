var BotFire = cc.Sprite.extend({
    ctor: function( x, y, gameLayer ) {
        this._super();
        this.initWithFile( 'res/images/ball.png' );
        this.setScale(2);
        this.setAnchorPoint( 0.5, 0  );
        this.startX = x;
        this.x = x;
        this.y = y;
        this.dir = gameLayer.jumper.dir;
        this.gameLayer = gameLayer;
        
        this.updatePosition();
        this.gameLayer.addChild(this);
        this.scheduleUpdate();
    },
    
    updatePosition: function() {
        this.setPosition( cc.p( Math.round( this.x ),
                                Math.round( this.y ) ) );
    },
    
    update: function() {
        if (this.dir == Jumper.DIR.RIGHT) {
            this.x += 16;
            if (this.x > this.startX + 400) {
                this.gameLayer.removeElement(this.gameLayer.fires, this);
                this.gameLayer.removeChild(this);
            }
        }
        else if (this.dir == Jumper.DIR.LEFT) {
            this.x -= 16;
            if (this.x < this.startX - 400) {
                this.gameLayer.removeElement(this.gameLayer.fires, this);
                this.gameLayer.removeChild(this);
            }
        }
        
        this.updatePosition();
    }
});