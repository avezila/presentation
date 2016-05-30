var Header = (function() {
    function Header(dom) {
        this.dom = dom;

        this.btn_new = this.dom.getElementsByClassName('header__button-new')[0];
        this.btn_new.onclick = this.onNew.bind(this);
    }
    Header.prototype.onNew = function() {

    }
    Header.prototype.Render = function() {
        var html = marked(this.md);

        this.dom.innerHTML = html;
    }

    return Header;
})();