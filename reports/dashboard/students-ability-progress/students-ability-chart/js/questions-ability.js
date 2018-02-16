
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {};
  cet.dashboard.studentsAbilityChart.questionsAbilityClass = function(options) {

    var self = this;
    this.measures = options.namespace.measures;
    this.questionsPopup = d34.select("." + options.chartClassName).append("div").attr("class", "students-ability-chart__questions-popup").style("opacity", 0).style("display", "none");
    this.questionsTable = this.questionsPopup.append('div').attr("class", "questions-popup__table-container").append('table');
    this.questionsPopup.append('span').attr("class", "questions-popup__close-button").html('x').on('click', function () {
      self.questionsPopup.style("display", "none");
      self.questionsPopup.transition().duration(350).style("opacity", .0);
    });

    //document.body.addEventListener('click', function (event) {
    //  abilityTip.transition().duration(350).style("opacity", .0).on("end", function () { abilityTip.style("display", "none") });
    //});








  }

  cet.dashboard.studentsAbilityChart.questionsAbilityClass.prototype.getQuestionsTablePosition = function() {
    var pos = {
      top: this.measures.height / 2,
      left: this.measures.width / 2
    }

    pos.top -= parseInt(this.questionsPopup.style('height')) / 2;
    var width = this.questionsPopup.style('width');
    width = width.indexOf('px') !== -1 ? parseInt(this.questionsPopup.style('width')) : ( parseInt(this.questionsPopup.style('width')) / 100 ) * this.measures.width;
    pos.left -= width / 2;

    return pos;
  }

  cet.dashboard.studentsAbilityChart.questionsAbilityClass.prototype.show = function(studentElement) {


    this.questionsTable.html(this.getQuestionsTableHtml(studentElement));
    var popupPosition = this.getQuestionsTablePosition();
    //if (cet.dashboard.lib.utils.isIE()) {
    this.questionsPopup.style("top", popupPosition.top + "px");
    this.questionsPopup.style("left", popupPosition.left + "px");
    //}

    this.questionsPopup.style("display", "");
    this.questionsPopup.transition().duration(350).style("opacity", 1);


  }

  cet.dashboard.studentsAbilityChart.questionsAbilityClass.prototype.getQuestionsTableHtml = function(studentElement) {
    var studentId = studentElement.getAttribute("data-id");
    var questionaireOrder = studentElement.parentElement.parentElement.parentElement.children[0].getAttribute('data-questionnaire-order');

    var questionsAbility = cet.dashboard.studentsAbilityProgress.data.getQuestionsAbility(questionaireOrder, studentId);
    var html = ['<table>',
                  '<thead>',
                    '<tr>',
                      '<th><span>שם הלומד/ת</span></th>',
                      '<th><span>ממוצע יכולות</span></th>'].join('');
    for (var i = 0; i < questionsAbility.length; i++) {
      html += ['<th><span>שאלה ', i, '</span></th>'].join('');
    }
    html += ['<tr>', '</thead> '].join('');
    html += ['<tbody>',
              '<tr>',
                '<td>', studentElement.innerText, '</td>',
                '<td>', studentElement.getAttribute("data-avg-ability"), '</td>'].join('');

    for (var i = 0; i < questionsAbility.length; i++) {
      html += ['<td>', questionsAbility[i], '</td>'].join('');
    }
    html += ['<tr>', '</tbody>', '</table>'].join('');
    return html;

  }

})();