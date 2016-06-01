var Slide = (function() {
    function Slide(src, width, height) {
        src = src || "";

        this.width = width;
        this.height = height;
        this.md = src;

        this.dom = document.createElement("slide");
        this.dom.style.width = width + "px";
        this.dom.style.height = height + "px";
        this.dom_content = document.createElement("div");
        this.dom_content.classList.add('slide__content');
        this.dom_content.classList.add('markdown-body');
        this.dom.appendChild(this.dom_content);

        this.Render();
    }

    Slide.prototype.Render = function() {
        this.dom_content.innerHTML = marked(this.md);
    }
    Slide.prototype.Export = function() {
        var src = "";
        var md = this.md.replace(/^[\s\n\r]+/, "");
        md = md.replace(/[\s\n\r]+$/, "");
        src += md + "\n\n";
        return src;
    }
    return Slide;
})();