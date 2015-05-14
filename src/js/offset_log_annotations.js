var parent_height = $("#loader-sample").innerHeight();
var line_height = $("#loader-sample > span").height();
var la = $(".log-annotation");
var la_height = la.height();

la.each(function() {
    var top = $(this).next().position().top;
    var new_top = top - (la_height - line_height) / 2;
    var new_top_pt = new_top / parent_height * 100;
    $(this).css({top: new_top_pt + "%"});
});
