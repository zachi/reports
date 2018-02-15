
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; cet.dashboard.lib = cet.dashboard.lib || {}
  cet.dashboard.lib.utils = (function () {

    return {
      isIE: function () { return !!window.MSInputMethodContext && !!document.documentMode; },
      cloneJSON: function (json) { return JSON.parse(JSON.stringify(json)); },
      findAncestor: function (el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
      }
    }

  })();



})();