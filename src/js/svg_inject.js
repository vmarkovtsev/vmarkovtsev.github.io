SVGInjector(document.querySelectorAll('#ms'), {
    evalScripts: false,
    each: function (svg) {
       svg.removeAttribute("width");
       svg.removeAttribute("height");
    }
});
