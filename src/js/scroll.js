const navbar = $("nav");
const navbar_height = navbar.outerHeight();
const front_height = $("#promo").outerHeight();

function scroll() {
    let opacity = 1 - ($(this).scrollTop() + navbar_height) / front_height;
    if (opacity < 0) {
        opacity = 0;
        navbar.hide();
        $(".github-fork-ribbon-wrapper").css({visibility: "visible", opacity: "1"});

    } else {
        navbar.show();
        $(".github-fork-ribbon-wrapper").css({visibility: "hidden", opacity: "0"});
    }
    navbar.css({opacity: opacity});
}

$(window).on('scroll', scroll);
scroll.call(window);