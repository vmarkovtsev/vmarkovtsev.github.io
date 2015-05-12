$(function () {
    $("#locpie").drawPieChart([
        {title: "Java", value: 560, color: "#3366cc"},
        {title: "SASS", value: 982, color: "#ff9900"},
        {title: "HTML", value: 1078, color: " #dc3912"},
        {title: "OpenCL/CUDA", value: 2192, color: "#109618"},
        {title: "Javascript", value: 5114, color: "#990099"},
        {title: "C/C++", value: 7357, color: "#0099c6"},
        {title: "Python (tests)", value: 20850, color: "#dd4477"},
        {title: "Python (platform)", value: 30754, color: "#66aa00"}
    ]);
});