var Demo = "avezila/presentation/gh-pages/md/example.md";
var Demo2 = "avezila/presentation/gh-pages/md/example2.md";

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

        this.workspace.ImportGit(Demo);
        this.workspace.ImportGit(Demo2);
    }

    return Main
})();

document.addEventListener("DOMContentLoaded", function() {
    var main = new Main();
    window.main = main;
});