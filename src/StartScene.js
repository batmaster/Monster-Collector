var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        this.state = 0;
        this.play(0);
    },
    
    gameOver: function() {
        var gameoverLayer = new GameOver();
        gameoverLayer.init(this);
        this.addChild(gameoverLayer)
    },
    
    stateCleared: function() {
        var stateCleared = new StateCleared();
        stateCleared.init(this);
        this.addChild(stateCleared);
    },
    
    play: function(status) {
        this.state += status;
        this.removeAllChildren();
        this.layer = new GameLayer();
        this.layer.init(this, this.state);
        this.addChild(this.layer);
    },
    
    showMap: function() {
        var gameMap = new GameMap();
        gameMap.init(this);
        this.addChild(gameMap);
    },
});
