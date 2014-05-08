var StateCleared = cc.Layer.extend({
    init: function(scene) {
        //this._super(new cc.Color4B(17, 17, 17, 255));
        this.setPosition(new cc.Point(0, 0));
        
        this.scene = scene;
        
        this.nextlbl = cc.LabelTTF.create( '0', 'Arial', 40 );
        this.nextlbl.setPosition( new cc.Point( screenWidth/2, screenHeight/2 ) );
        this.nextlbl.setString("Next State");
        this.addChild( this.nextlbl );
        
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
                this.scene.play(1);
            break;
        }
    },
    
    update: function() {
        
    },
});