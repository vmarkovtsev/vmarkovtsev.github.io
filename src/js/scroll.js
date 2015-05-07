const navbar = $("nav");
const navbar_height = navbar.outerHeight();
const front_height = $("#promo").outerHeight();

$(window).on('scroll', function () {
    let opacity = 1 - ($(this).scrollTop() + navbar_height) / front_height;
    if (opacity < 0) {
        opacity = 0;
        navbar.hide();
    } else {
        navbar.show();
    }
    navbar.css({opacity: opacity});
});