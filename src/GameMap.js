var GameMap = cc.LayerColor.extend({
    init: function(scene) {
        this._super(new cc.Color4B(127, 127, 127, 255));
        this.setPosition(new cc.Point(0, 0));
        
        this.scene = scene;
        
        //var map = new Map();
        //this.addChild(map);
        
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
        
    },
    
    update: function() {
        
    },
    
});