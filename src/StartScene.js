var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        this.play();
    },
    
    gameOver: function() {
        var gameoverLayer = new GameOver();
        gameoverLayer.init(this);
        this.addChild(gameoverLayer)
    },
    
    play: function() {
        this.removeAllChildren();
        var layer = new GameLayer();
        layer.init(this);
        this.addChild(layer);
    },
});
