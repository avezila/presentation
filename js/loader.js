var Loader = (function() {
    var github = "https://raw.githubusercontent.com/";

    function Loader() {
        this.files = {};
    }

    Loader.prototype.ImportGit = function(file, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', github + file, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                cb(null, xhr.status + ': ' + xhr.statusText);
            } else {
                this.files[file] = xhr.responseText;
                cb(this.files[file]);
            }
        }.bind(this);
    }

    return Loader;
})();