var Demo = "avezila/presentation/gh-pages/md/example.md";

var Main = (function() {
    function Main() {

        this.workspace = new Workspace(this);

        this.workspace.ImportGit(Demo, function(ret, err) {
            console.log(ret, err);
        });
    }

    return Main
})();


var main = new Main();