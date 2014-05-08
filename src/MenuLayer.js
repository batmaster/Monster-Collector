var MenuLayer = cc.LayerColor.extend({
    // initial part //
    init: function() {
        this._super(new cc.Color4B(127, 127, 127, 255));
        this.setPosition(new cc.Point(0, 0));
        
        this.lbl = cc.LabelTTF.create( '0', 'Arial', 40 );
        this.lbl.setPosition( new cc.Point( screenWidth/2, screenHeight/2 ) );
        this.lbl.setString("Press Enter to Start");
        
        this.setKeyboardEnabled(true);
        this.scheduleUpdate();
        return true;
    },
    
    // general part //
    onKeyDown: function(e) {
        switch(e) {
            case cc.KEY.enter:
                var director = cc.Director.getInstance();
                director.replaceScene(cc.TransitionFade.create(1.5, new GameScene()));
            break;
        }
    },

    onKeyUp: function(e) {
        
    },
    
    update: function() {
        
    }
});
