var GameOver = cc.Layer.extend({
    init: function(scene) {
        //this._super(new cc.Color4B(17, 17, 17, 255));
        this.setPosition(new cc.Point(0, 0));
        
        this.scene = scene;
        
        this.gameoverlbl = cc.LabelTTF.create( '0', 'Arial', 40 );
        this.gameoverlbl.setPosition( new cc.Point( screenWidth/2, screenHeight/2 ) );
        this.gameoverlbl.setString("Game Over");
        this.addChild( this.gameoverlbl );
        
        this.setKeyboardEnabled(true);
        this.scheduleUpdate();
        return true;
    },
    
    onKeyDown: function(e) {
        switch(e){
            case cc.KEY.space:
            break;
        }
    },

    onKeyUp: function(e) {
        console.log(e);
        switch(e) {
            case cc.KEY.enter:
                this.scene.play(0);
            break;
        }
    },
    
    update: function() {
        
    },
});