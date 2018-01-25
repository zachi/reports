
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; cet.dashboard.studentsAbilityProgress = cet.dashboard.studentsAbilityProgress || {}
  cet.dashboard.studentsAbilityProgress.utils = (function () {

    return {
      isIE: function () { return !!window.MSInputMethodContext && !!document.documentMode;}
    }

  })();

  

})();