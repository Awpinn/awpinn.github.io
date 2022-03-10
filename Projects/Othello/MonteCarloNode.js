class MonteCarloNode {
    constructor(parent, play, state, unexpandedPlays) {
        this.play = play;
        this.state = state;
        this.n_plays = 0;
        this.n_wins = 0;
        this.parent = parent;
        this.children = {};
        for (var play in unexpandedPlays) {
            this.children[play] = (play, None);
        }
    }
    
    childNode(play) {
        let child = this.children.get(play);
        if (child == null) {
            throw "No such play!";
        }
        return child[1];
    }

    expand(play, childState, unexpandedPlays) {
        if (this.children.get(play) == null) {
            throw "No such play!";
        }
        let childNode = this.MonteCarloNode(play, childState, unexpandedPlays);
        this.children[play] = [play, childNode];
        return childNode;
    }

    allPlays() {
        let ret = [];
        for (var child in this.children.values()) {
            ret.push(child[0]);
        }
        return ret;
    }

    unexpandedPlays() {
        let ret = [];
        for (var child in this.children.values()) {
            if (child[1] == null) {
                ret.push(child[0]);
            }
        }
        return ret;
    }

    isFullyExpanded() {
        for (var child in this.children.values()) {
            if (child[1] == null) {
                return false;
            }
        }
        return true;
    }
    
    isLeaf() {
        if (this.children.length == 0) {
            return true;
        }
        return false;
    }

    getUCB1(biasParam) {
        return (this.n_wins / this.n_plays) + math.sqrt(biasParam * math.log(this.parent.n_plays) / this.n_plays);
    }
}