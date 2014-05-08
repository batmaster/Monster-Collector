var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        
        this.menuLayer = new MenuLayer();
        this.menuLayer.init(this);
        this.addChild(this.menuLayer);
    },
});
