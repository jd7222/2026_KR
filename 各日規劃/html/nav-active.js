// Keeps the sticky top nav's "current" tab in sync with whichever
// section/anchor is actually scrolled into view. Works on any page whose
// nav.tabs links point to in-page #anchors (Daily.html day tabs,
// GuideLine.html notice/prep/days, nearby.html n01-n07).
(function () {
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('nav.tabs a[href^="#"]')
  );
  if (!navLinks.length) return;

  var targets = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) targets.push({ id: id, el: el, link: link });
  });
  if (!targets.length) return;

  function setCurrent(id) {
    navLinks.forEach(function (l) { l.classList.remove('current'); });
    targets.forEach(function (t) {
      if (t.id === id) {
        t.link.classList.add('current');
        // keep the active tab scrolled into view within the horizontally
        // scrollable nav row on narrow screens
        if (typeof t.link.scrollIntoView === 'function') {
          t.link.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      }
    });
  }

  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (!visible.length) return;
      visible.sort(function (a, b) {
        return a.boundingClientRect.top - b.boundingClientRect.top;
      });
      setCurrent(visible[0].target.id);
    },
    {
      // trigger a section as "active" once it's scrolled just below the
      // sticky nav bar, and stop counting it once it's mostly scrolled past
      rootMargin: '-64px 0px -70% 0px',
      threshold: 0,
    }
  );

  targets.forEach(function (t) { observer.observe(t.el); });
})();
