var md = "# Dillinger\n\nDillinger is a cloud-enabled, mobile-ready, offline-storage, AngularJS powered HTML5 Markdown editor.\n\n  - Type some Markdown on the left\n  - See HTML in the right\n  - Magic\n\nYou can also:\n  - Import and save files from GitHub, Dropbox, Google Drive and One Drive\n  - Drag and drop files into Dillinger\n  - Export documents as Markdown, HTML and PDF\n\nMarkdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site][df1]\n";



var Main = (function() {
    function Main() {
        this.workspace = new Workspace();
        this.loader = new Loader();

        this.loader.Import("md/example.md", function() {
            console.log(this.loader.file["md/example.md"]);
        });
    }

    return Main
})();


var main = new Main();


(function() {
    var count = 3;
    var now = 0;
    var width = 1100;
    var height = 700;
    var div = width / height;
    var header = document.getElementsByTagName("header_container")[0];
    var headerH = header.offsetHeight;
    var content = document.getElementsByTagName("content")[0];
    var boxes = document.getElementsByTagName("slide-box");
    var slides = document.getElementsByTagName("slide");
    var leftScroller = document.getElementsByClassName("scroll_bar--left")[0];
    var rightScroller = document.getElementsByClassName("scroll_bar--right")[0];
    slides[0].innerHTML = marked(md);

    function GetScale() {
        var real_width = (content.offsetHeight - headerH) * div;
        var real_heigh = content.offsetWidth / div;

        return Math.min(real_width / width, real_heigh / height);
    }

    function SetSize() {
        var scale = GetScale();
        for (var i = 0; i < boxes.length; i++) {
            slides[i].style.transform = " scale(" + scale + ")";
            //boxes[i].style.top = scale * height / 2 - (content.offsetHeight - headerH) * i + "px";
            /*
            boxes[i].style.width = sz.width + "px";
            if (sz.maxHeight) {
                boxes[i].style["max-height"] = sz.maxHeight + "px";
            } else {
                delete boxes[i].style["max-height"];
            }
            */
        }
        header.style.width = width * scale - 80 + "px";
    }

    var KeyLeft = 37,
        KeyRight = 39,
        KeyDown = 40,
        KeyUp = 38,
        KeyEnter = 13,
        KeySpace = 32,
        KeyPgdwn = 34,
        KeyPgup = 33;

    function scrollLeft() {
        if (now <= 0) return;
        now--;
        content.style.left = -100 * now + "%";
    }

    function scrollRight() {
        if (now >= (count - 1)) return;
        now++;
        content.style.left = -100 * now + "%";
    }
    leftScroller.onclick = scrollLeft;
    rightScroller.onclick = scrollRight;
    window.onkeydown = function onkeydown(e) {
        e = e || window.event;
        e = e.keyCode || e.which
        console.log(e)
        switch (e) {
            case KeyLeft:
            case KeyUp:
            case KeyPgup:
                scrollLeft();
                break;
            case KeyRight:
            case KeyDown:
            case KeySpace:
            case KeyEnter:
            case KeyPgdwn:
                scrollRight();
                break;
        }

    }

    window.onresize = function onresize(e) {
        SetSize();
    };
    SetSize();

    /*
        var onfullscreenchange = function(e) {
            console.log("change")
            var fullscreenElement =
                document.fullscreenElement ||
                document.mozFullscreenElement ||
                document.webkitFullscreenElement;
            var fullscreenEnabled =
                document.fullscreenEnabled ||
                document.mozFullscreenEnabled ||
                document.webkitFullscreenEnabled;
            console.log('fullscreenEnabled = ' + fullscreenEnabled, ',  fullscreenElement = ', fullscreenElement, ',  e = ', e);
        }

        // Событие об изменениии режима
        document.addEventListener("webkitfullscreenchange", onfullscreenchange,false);
        document.addEventListener("mozfullscreenchange", onfullscreenchange,false);
        document.addEventListener("fullscreenchange", onfullscreenchange,false);*/
    function fullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            console.log('click')
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullscreen) {
            element.mozRequestFullScreen();
        }
    }

    function clearSelection() {
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

    function onEnterFullscreen() {
        document.documentElement.classList.add('fullscreen')
    }

    function onExitFullscreen() {
        document.documentElement.classList.remove('fullscreen')
    }

    function toggleFullscreen() {
        if (BigScreen.enabled) {
            BigScreen.toggle(document.documentElement, onEnterFullscreen, onExitFullscreen, function() {});
        }

    }
    content.ondblclick = function() {
        toggleFullscreen();
        clearSelection();
    }
    document.getElementById('play').onclick = toggleFullscreen;
})();