SVGInjector(document.querySelectorAll('#ms'), {
    evalScripts: 'once',
    each: function (svg) {
       svg.removeAttribute("width");
       svg.removeAttribute("height");
    }
});