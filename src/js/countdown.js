// Fix (as always) not working <use xlink:href="..." />
// Thanks, Jonathan Neal.
/MSIE|Trident/.test(navigator.userAgent) &&
    document.addEventListener('DOMContentLoaded', function () {
  for (let svg of document.querySelectorAll('svg.digit')) {
    let use = svg.querySelector('use');

    if (!use) {
      return;
    }
    let object = document.createElement('object');
    object.data = use.getAttribute('xlink:href');
    object.className = svg.getAttribute('class');
    svg.parentNode.replaceChild(object, svg);
  }
});

// Set the initial timer state according to the current time.
window.addEventListener('load', function() {
  const elements = ["hours tens", "hours ones", "minutes tens", "minutes ones",
                    "seconds tens", "seconds ones"].map(function(class_name) {
    return document.getElementsByClassName(
        "countdown-part " + class_name)[0].children[0];
  });
  const delay_property = Modernizr.prefixed('animationDelay')
      .replace(/([A-Z])/g, function(str, cap) { return '-' + cap.toLowerCase(); })
      .replace(/^ms-/,'-ms-');
  const delays = elements.map(function(element) {
    return Number(window.getComputedStyle(element)[delay_property]
        .replace(/[^\d\.-]/g, ''));
  });
  function adjustDelay(index, delta) {
    let old_element = elements[index], new_element = old_element.cloneNode(true);
    new_element.style.setProperty(
      delay_property, (delays[index] + delta) + "s");
    old_element.parentNode.replaceChild(new_element, old_element);
  }
  const now = new Date();
  const secs = now.getSeconds(), sec_part = now.getMilliseconds() / 1000;
  adjustDelay(5, -(secs % 10) - sec_part);
  adjustDelay(4, -(secs / 10) * 10 - sec_part);
  const mins = now.getMinutes(), min_part = secs + sec_part;
  adjustDelay(3, -(mins % 10) * 60 - min_part);
  adjustDelay(2, -(mins / 10) * 600 - min_part);
  const hours = now.getHours(), hour_part = mins * 60 + min_part;
  adjustDelay(1, -(hours % 10) * 3600 - hour_part);
  adjustDelay(0, -(hours / 10) * 36000 - hour_part);
});
