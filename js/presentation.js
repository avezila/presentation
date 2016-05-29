var Presentation = (function() {
    function Presentation() {
        this.title = "Untitled";

    }
    Presentation.prototype.Src = function(name, src) {
        var m;
        if (m = src.match(/^\/{4}title (.*)$/)) {
            this.title = m[1];
        } else {
            if (m = name.match(/([^\/]+)\.\w+$/))
                this.title = m[1];
            else this.title = name;
        }
        console.log("title", this.title);
        return
    }
    return Presentation;
})();