if (navigator.userAgent.search("Ubuntu") >= 0) {
    var download = $(".download");
    download.hide();
    var apt_get = $("<pre class=\"ubuntu-download\">" +
        "wget -O - https://velesnet.ml/apt/velesnet.ml.gpg.key | sudo apt-key add -\n" +
        "sudo apt-get update && sudo apt-get install python3-veles</pre>");
    download.after(apt_get);
}