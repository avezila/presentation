var Workspace = (function() {
    function Workspace() {
        this.loader = new Loader();
        this.presentations = {};
    }

    Workspace.prototype.ImportGit = function(git, cb) {
        this.loader.ImportGit(git, function(src, err) {
            if (err) return cb(null, err);

            var pres = new Presentation();
            err = pres.Src(git, src);
            if (err) return cb(null, err);
            this.presentations[git] = pres;

        }.bind(this));
    }
    Workspace.prototype.RenderPresentation = function(name) {
        if (!name) {
            name = Object.keys(this.loader.file)[0];
        }
        var src = this.loader.file[name];

    }
    return Workspace;
})();