var Fire = cc.Sprite.extend({
    ctor: function( x, y, gameLayer ) {
        this._super();
        this.initWithFile( 'res/images/ie.png' );
        this.setScale(2);
        this.setAnchorPoint( 0.5, 0  );
        this.startX = x;
        this.x = x;
        this.y = y;
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
        this.x += 16;
        if (this.x > this.startX + 400) {
            this.gameLayer.removeElement(this.gameLayer.fires, this);
            this.gameLayer.removeChild(this);
        }
        this.updatePosition();
    }
});