var Workspace = (function() {
    function Workspace(main) {
        this.main = main;
        this.state = "";
        this.header = new Header(document.getElementsByTagName("header")[0]);
        this.content = document.getElementsByTagName("content")[0];
        this.preview = new Preview(this.content);
        this.nav = {
            workspace: document.getElementsByClassName("header__nav-workspace")[0],
            presentation: document.getElementsByClassName("header__nav-presentation")[0],
            slide: document.getElementsByClassName("header__nav-slide")[0]
        };
        this.file_save_btn = document.getElementById("header__file_save");
        this.file_open_btn = document.getElementById('header__file_open');
        this.loader = new Loader();
        this.presentations = {};
        this.Preview();

        this.onKeydown = this.onKeydown.bind(this);
        this.navWorkspace = this.navWorkspace.bind(this);
        this.navPresentation = this.navPresentation.bind(this);
        this.fileSave = this.fileSave.bind(this);
        this.fileOpen = this.fileOpen.bind(this);

        window.addEventListener("keydown", this.onKeydown, false);
        this.file_open_btn.addEventListener('change', this.fileOpen, false);
        this.nav.workspace.onclick = this.navWorkspace;
        this.nav.presentation.onclick = this.navPresentation;
        this.file_save_btn.onclick = this.fileSave;


    }

    Workspace.prototype.ImportGit = function(git) {
        this.loader.ImportGit(git, function(src, err) {
            if (err) {
                alert(err);
                return;
            }
            this.Push("git:" + git, src);
        }.bind(this));
    }
    Workspace.prototype.Push = function(from, src) {
        var arr = src.split(/\/{4}presentation/mg);
        for (var i in arr) {
            var key = from;
            if (i > 0) key += ":" + (+i + 1);
            var pres = new Presentation(this.content, this.main);
            err = pres.Src(key, arr[i]);
            if (err) {
                alert(err);
                return;
            }
            this.presentations[key] = pres;
            if (this.state == "preview") {
                this.preview.Push([key, pres.slides[0], pres.title, key]);
                this.preview.Resize();
            }
        }
    }
    Workspace.prototype.ShowPresentation = function(name, index) {
        this.Clear();
        this.nav.workspace.classList.add("header__nav_text-active");
        this.nav.presentation.classList.add("header__nav_text-active");
        this.nav.presentation.parentNode.classList.remove("header__nav-hidden");
        this.nav.slide.parentNode.classList.remove("header__nav-hidden");
        this.nav.slide.innerHTML = "slide " + (+index + 1);
        this.nav.presentation.setAttribute("data", name);
        this.state = "presentation";
        this.state_data = name;
        this.presentations[this.state_data].Show(index);
        this.nav.presentation.innerHTML = this.presentations[this.state_data].title;
    }
    Workspace.prototype.PreviewSlides = function(name) {
        this.Clear();
        this.nav.workspace.classList.add("header__nav_text-active");
        this.nav.presentation.classList.remove("header__nav_text-active");
        this.nav.presentation.parentNode.classList.remove("header__nav-hidden");
        this.nav.slide.parentNode.classList.add("header__nav-hidden");
        this.nav.presentation.setAttribute("data", name);
        presentation = this.presentations[name];
        this.nav.presentation.innerHTML = presentation.title;
        var slides = [];
        for (var i in presentation.slides) {
            slides.push([i, presentation.slides[i], presentation.title + " - " + (+i + 1)]);
        }
        this.preview.Show(slides, function(index) {
            this.ShowPresentation(name, index);
        }.bind(this));
        this.state = "previewSlides";
        this.state_data = name;
    }
    Workspace.prototype.Preview = function() {
        this.Clear();
        this.nav.workspace.classList.remove("header__nav_text-active");
        this.nav.presentation.parentNode.classList.add("header__nav-hidden");
        this.nav.slide.parentNode.classList.add("header__nav-hidden");
        var slides = [];
        for (var key in this.presentations) {
            var pres = this.presentations[key];
            slides.push([key, pres.slides[0], pres.title, key]);
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
    Workspace.prototype.navWorkspace = function() {
        if (!this.nav.workspace.classList.contains("header__nav_text-active")) return;
        this.Preview();
    }
    Workspace.prototype.navPresentation = function() {
        if (!this.nav.presentation.classList.contains("header__nav_text-active")) return;
        this.PreviewSlides(this.nav.presentation.getAttribute("data"));
    }
    Workspace.prototype.fileSave = function(e) {
        switch (this.state) {
            case "previewSlides":
            case "presentation":
                var pres = this.presentations[this.state_data];
                var name = pres.title.replace(/[^\wа-яё-]/gmi, "_");
                if (!name) {
                    name = "presentation"
                }
                var data = "data:text/plain;charset=utf-8,";
                data += encodeURIComponent(pres.Export());
                this.file_save_btn.setAttribute("download", name + ".md");
                this.file_save_btn.setAttribute("href", data);
                break;
            case "preview":
                var data = "data:text/plain;charset=utf-8,";
                var src = "";
                for (var key in this.presentations) {
                    if (src) src += "////presentation\n\n";
                    var pres = this.presentations[key];
                    src += pres.Export();
                }
                data += encodeURIComponent(src);
                this.file_save_btn.setAttribute("download", "workspace.md");
                this.file_save_btn.setAttribute("href", data);
                break;
            default:
                e.preventDefault();
                return;
        }
    }

    Workspace.prototype.fileOpen = function(evt) {
        var files = evt.target.files; // FileList object
        for (var i = 0, f; f = files[i]; i++) {
            console.log(f.name, f.type, f.size, f.lastModifiedDate.toLocaleDateString());
            console.log(f);
            f.reader = new FileReader();

            f.reader.onload = function(f, e) {
                this.Push("file:" + f.name, e.target.result);
            }.bind(this, f);
            f.reader.readAsText(f);
        }
        /*
        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate.toLocaleDateString(), '</li>');
        }
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
        */
    }


    return Workspace;
})();