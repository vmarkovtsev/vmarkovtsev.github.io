const navbar = $("nav");
const navbar_height = navbar.outerHeight();
const front_height = $("#promo").outerHeight();
const navbar_hide_height = front_height - navbar_height;
const rotating_thing = $("#master-slave-picture");
const rotating_thing_top = rotating_thing.offset().top;
const rotating_thing_bottom = rotating_thing_top + rotating_thing.outerHeight();
const video = $("video");
const $window = $(window);
const github = $(".github-fork-ribbon-wrapper");


function scroll() {
    const pos = $(this).scrollTop();
    let opacity = 1 - pos / navbar_hide_height;
    if (opacity < 0) {
        opacity = 0;
        github.css({visibility: "visible", opacity: "1"});

    } else {
        github.css({visibility: "hidden", opacity: "0"});
    }
    navbar.toggle(opacity > 0);
    navbar.css({opacity: opacity});
    // The next toggles fix buggy Chrome on Linux, though beneficial for other browsers, too.
    video.toggle(pos < front_height);
    rotating_thing.toggle(pos + $window.height() >= rotating_thing_top && pos < rotating_thing_bottom);
}

$window.on('scroll', scroll);
scroll.call(window);