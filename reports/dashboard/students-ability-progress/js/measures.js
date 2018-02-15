(function () {
  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityProgress = window.cet.dashboard.studentsAbilityProgress || {};
  cet.dashboard.studentsAbilityProgress.measures = (function () {
    function init(options) {
      var self = cet.dashboard.studentsAbilityProgress.measures;

      // Set default width and hegit when not passed in options
      if (!options || !options.width) {
        self.width = window.innerWidth * 0.85 - ((window.innerWidth > 1280) ? 210 : 0);
      }
      else {
        self.width = options.width;
      }
      if (!options || !options.height) {
        self.height = window.innerHeight * 0.85 - 102;
      }
      else {
        self.height = options.height;
      }

      var minWidth = 910;
      var minHeight = 670;
      var chartMargin = 12;

      self.width = self.width > minWidth ? self.width : minWidth;
      self.height = self.height > minHeight ? self.height : minHeight;


      var titleHeight = document.querySelector('.students-ability-dashboard__title').getBoundingClientRect().height
      var heightOfVerticalScroll = (self.height === minHeight) ? 20 : 0;
      var bottomBoxShadowHeight = 8;
      var chartsHeight = 0.5 * (self.height - titleHeight - chartMargin - heightOfVerticalScroll - bottomBoxShadowHeight);
      var chartsWidth = self.width - (chartMargin * 2)
      
      var studentAverageAbilityListWidth = chartsWidth * 0.25 < 240 ? 240 : chartsWidth * 0.25;

      
      self.studentsAbilityChart = { width: chartsWidth, height: chartsHeight    };
      self.studentsAbilityHistoryChart = { width: chartsWidth - studentAverageAbilityListWidth -chartMargin, height: chartsHeight };
      self.studentAverageAbilityList = { width: studentAverageAbilityListWidth, height: chartsHeight  };

  }
    return {
        init: init
  }
  })();
})();