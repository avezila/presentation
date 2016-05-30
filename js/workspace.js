var Workspace = (function() {
    function Workspace() {
        this.state = "";
        this.header = new Header(document.getElementsByTagName("header")[0]);
        this.content = document.getElementsByTagName("content")[0];
        this.preview = new Preview(this.content);
        this.loader = new Loader();
        this.presentations = {};
        this.Preview();
        this.onKeydown = this.onKeydown.bind(this);
        window.addEventListener("keydown", this.onKeydown, false);
    }

    Workspace.prototype.ImportGit = function(git, cb) {
        this.loader.ImportGit(git, function(src, err) {
            if (err) return cb(null, err);

            var pres = new Presentation(this.content);
            err = pres.Src(git, src);
            if (err) return cb(null, err);
            this.presentations[git] = pres;
            if (this.state == "preview") {
                this.preview.Push([git, pres.slides[0]]);
                this.preview.Resize();
            }

        }.bind(this));
    }
    Workspace.prototype.ShowPresentation = function(name, index) {
        this.Clear();
        this.state = "presentation";
        this.state_data = name;
        this.presentations[this.state_data].Show(index);
    }
    Workspace.prototype.PreviewSlides = function(name) {
        this.Clear();
        presentation = this.presentations[name];
        var slides = [];
        for (var i in presentation.slides) {
            slides.push([i, presentation.slides[i]]);
        }
        this.preview.Show(slides, function(index) {
            this.ShowPresentation(name, index);
        }.bind(this));
        this.state = "previewSlides";
        this.state_data = name;
    }
    Workspace.prototype.Preview = function() {
        this.Clear();
        var slides = [];
        for (var key in this.presentations) {
            slides.push([key, this.presentations[key].slides[0]]);
        }
        this.preview.Show(slides, function(key) {
            this.PreviewSlides(key);
        }.bind(this));
        this.state = "preview";
    }
    Workspace.prototype.Clear = function() {
        switch (this.state) {
            case "preview":
            case "previewSlides":
                this.preview.Hide();
                break;
            case "presentation":
                this.presentations[this.state_data].Hide();
                break;
        }
    }
    Workspace.prototype.onKeydown = function(e) {
        e = e || window.event;
        e = e.keyCode || e.which

        switch (e) {
            case KeyEsc:
                switch (this.state) {
                    case "previewSlides":
                        this.Preview();
                        break;
                    case "presentation":
                        this.PreviewSlides(this.state_data);
                        break;
                }
                break;
        }
    }

    return Workspace;
})();