var Demo = "avezila/presentation/gh-pages/md/example.md";
var Demo = "avezila/presentation/gh-pages/md/example2.md";

var KeyLeft = 37,
    KeyRight = 39,
    KeyDown = 40,
    KeyUp = 38,
    KeyEnter = 13,
    KeySpace = 32,
    KeyPgdwn = 34,
    KeyPgup = 33,
    KeyEsc = 27;

var Main = (function() {
    function Main() {

        this.workspace = new Workspace(this);

        this.workspace.ImportGit(Demo, function(ret, err) {
            console.log(ret, err);
        });

        this.workspace.ImportGit(Demo2, function(ret, err) {
            console.log(ret, err);
        });
    }

    return Main
})();

document.addEventListener("DOMContentLoaded", function() {
    var main = new Main();
    window.main = main;
});