var Loader = (function() {
    function Loader() {
        this.file = {};
    }

    Loader.prototype.Import = function(file, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file,true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                this.file[file] = xhr.responseText; // responseText -- текст ответа.
            }
            cb();
        }
    }

    return Loader;
})();