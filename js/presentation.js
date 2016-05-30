var Presentation = (function() {
    var width = 1100;
    var height = 700;

    function Presentation(parentDiv) {
        this.now = 0;
        this.width = width;
        this.height = height;
        this.parentDiv = parentDiv;
        this.title = "Untitled";
        this.slides = [];
        this.scroll_left = document.getElementsByClassName("presentation__scroll_bar-left")[0];
        this.scroll_right = document.getElementsByClassName("presentation__scroll_bar-right")[0];

        this.dom = this.parentDiv.getElementsByTagName("presentation")[0];
        this.dom_content = this.dom.getElementsByClassName("presentation__content")[0];

        this.onResize = this.onResize.bind(this);
        this.scrollLeft = this.scrollLeft.bind(this);
        this.scrollRight = this.scrollRight.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
        this.onDblclick = this.onDblclick.bind(this);
        this.onEnterFullscreen = this.onEnterFullscreen.bind(this);
        this.onExitFullscreen = this.onExitFullscreen.bind(this);
    }
    Presentation.prototype.Src = function(name, src) {
        if (m = src.match(/^\/{4}title (.*)$/m)) {
            this.title = m[1];
            src = src.replace(/^\/{4}title (.*)$/m, '');
        } else {
            if (m = name.match(/([^\/]+)\.\w+$/))
                this.title = m[1];
            else this.title = name;
        }
        if (m = src.match(/^\/{4}width (.*)$/m)) {
            this.width = m[1];
            src = src.replace(/^\/{4}width (.*)$/m, '');
        }
        if (m = src.match(/^\/{4}height (.*)$/m)) {
            this.height = m[1];
            src = src.replace(/^\/{4}height (.*)$/m, '');
        }
        var slides = src.split(/\/{4}page/mg);
        this.dom_content.innerHTML = "";
        for (var i in slides) {
            var slide = new Slide(slides[i], this.width, this.height);
            this.slides.push(slide);
        }
        return null
    }
    Presentation.prototype.Render = function() {
        this.dom_content.innerHTML = "";
        for (var i in this.slides) {
            this.dom_content.appendChild(this.slides[i].dom);
            this.RenderMove(i);
        }
    }
    Presentation.prototype.RenderMove = function(i) {
        this.slides[i].dom.style.left = 50 + i * 100 + "%";
        this.slides[i].dom.style.transform = "translateX( -50% ) translateY( " + (-50 - i * 100) + "% )";
    }

    Presentation.prototype.RenderResize = function() {
        var scale = Math.min(this.dom_content.offsetHeight / this.height, this.dom_content.offsetWidth / this.width);

        for (var i in this.slides) {
            this.slides[i].dom_content.style.transform = " scale(" + scale + ")";
        }
    }
    Presentation.prototype.Show = function(index) {
        this.now = +index || 0;
        this.dom_content.style.left = -100 * this.now + "%";
        this.Render();
        this.dom.style.display = "block";
        this.RenderResize();
        this.scroll_left.addEventListener("click", this.scrollLeft, false);
        this.scroll_right.addEventListener("click", this.scrollRight, false);
        window.addEventListener("resize", this.onResize, false);
        window.addEventListener("keydown", this.onKeydown, false);
        this.dom_content.addEventListener("dblclick", this.onDblclick, false);
    }
    Presentation.prototype.Hide = function() {
        this.dom.style.display = "none";
        this.dom_content.innerHTML = "";
        this.scroll_left.removeEventListener("click", this.scrollLeft, false);
        this.scroll_right.removeEventListener("click", this.scrollRight, false);
        window.removeEventListener("resize", this.onResize, false);
        window.removeEventListener("keydown", this.onKeydown, false);
        this.dom_content.removeEventListener("dblclick", this.onDblclick, false);
    }

    Presentation.prototype.onResize = function() {
        if (this.resizeTimeout) return;
        this.resizeTimeout = setTimeout(function() {
            this.resizeTimeout = null;
            this.RenderResize();

        }.bind(this), 10);
    }

    Presentation.prototype.onKeydown = function(e) {
        e = e || window.event;
        e = e.keyCode || e.which
        console.log(e)
        switch (e) {
            case KeyLeft:
            case KeyUp:
            case KeyPgup:
                this.scrollLeft();
                break;
            case KeyRight:
            case KeyDown:
            case KeySpace:
            case KeyEnter:
            case KeyPgdwn:
                this.scrollRight();
                break;
        }
    }

    Presentation.prototype.scrollLeft = function() {
        this.clearSelection();
        if (this.now <= 0) return;
        this.now--;
        this.dom_content.style.left = -100 * this.now + "%";
    }


    Presentation.prototype.scrollRight = function() {
        this.clearSelection();
        if (this.now >= (this.slides.length - 1)) return;
        this.now++;
        this.dom_content.style.left = -100 * this.now + "%";
    }

    Presentation.prototype.clearSelection = function() {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {
            document.selection.empty();
        }
    }

    Presentation.prototype.onEnterFullscreen = function() {
        document.body.getElementsByTagName("content")[0].classList.add('fullscreen');
        document.body.getElementsByTagName("header")[0].classList.add('fullscreen');
        console.log("add");
        this.dom_content.addEventListener("click", this.scrollRight);
    }

    Presentation.prototype.onExitFullscreen = function() {
        document.body.getElementsByTagName("content")[0].classList.remove('fullscreen');
        document.body.getElementsByTagName("header")[0].classList.remove('fullscreen');
        //document.body.classList.remove('fullscreen');
        this.dom_content.removeEventListener("click", this.scrollRight);
    }

    Presentation.prototype.toggleFullscreen = function() {
        if (BigScreen.enabled) {
            BigScreen.toggle(document.documentElement, this.onEnterFullscreen, this.onExitFullscreen);
        }
    }
    Presentation.prototype.onDblclick = function() {
        this.clearSelection();
        this.toggleFullscreen();
    }

    return Presentation;
})();