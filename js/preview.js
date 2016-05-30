var Preview = (function() {
    var maxScale = 2;
    var maxWidth = 600;

    function Preview(parentDiv) {
        this.maxScale = maxScale;
        this.parentDiv = parentDiv;
        this.dom = parentDiv.getElementsByTagName("preview")[0];
        this.nodes = [];
        this.clickbinds = [];
        this.Resize = this.Resize.bind(this);
    }

    Preview.prototype.Show = function(slides, cb) {
        this.dom.innerHtml = "";
        this.nodes = [];
        this.dom.style.display = "block";
        this.maxWidth = 10;
        this.maxHeight = 10;
        for (var i in slides) {
            var node = {
                div: document.createElement("div"),
                name: slides[i][0],
                slide: slides[i][1]
            };
            if (node.slide.width > this.maxWidth) {
                this.maxWidth = node.slide.width;
            }
            if (node.slide.height > this.maxHeight) {
                this.maxHeight = node.slide.height;
            }
            node.div.classList.add("preview__node");
            this.nodes.push(node);
            var hover = document.createElement("div");
            hover.classList.add('preview__node_hover');
            node.div.appendChild(hover);
            node.div.appendChild(node.slide.dom);
            this.dom.appendChild(node.div);
            var onclick = function(name) {
                cb(name);
            }.bind(this, node.name);
            this.clickbinds.push(onclick);
            node.div.addEventListener("click", onclick);
        }
        this.Resize();
        window.addEventListener("resize", this.Resize, false);
    }
    Preview.prototype.Resize = function() {
        var ow = this.dom.offsetWidth - 60;
        var n = Math.floor(ow / (this.maxWidth / this.maxScale));
        if (n > this.nodes.length / 2)
            n = Math.ceil(this.nodes.length / 2);
        var width = ow / n;
        if (n == this.nodes.length && (width > maxWidth)) width = maxWidth;
        var height = width * this.maxHeight / this.maxWidth;
        for (var i in this.nodes) {
            var node = this.nodes[i];
            node.div.style.width = width + "px";
            node.div.style.height = height + "px";
            node.slide.dom_content.style.transform = " scale(" + width / node.slide.width + ")";
        }
    }

    Preview.prototype.Hide = function() {
        window.removeEventListener("resize", this.Resize, false);
        this.dom.style.display = "none";
        this.dom.innerHtml = "";
        for (var i in this.clickbinds) {
            this.nodes[i].div.removeEventListener("click", this.clickbinds[i]);
            this.nodes[i].div.remove();
        }
        this.nodes = [];
        this.clickbinds = [];
    }
    return Preview;
})();