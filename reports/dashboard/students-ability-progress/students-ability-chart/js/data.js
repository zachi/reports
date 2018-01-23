
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {};
  cet.dashboard.studentsAbilityProgress.data = (function () {

    var root;

    function getFinishedFraction(ability) {
      var finishedCounter = 0;

      for (var i = 0; i < ability.students.length; i++) {
        if (ability.students[i].finished)
          finishedCounter++;
      }
      var ssss = 0;

      return finishedCounter / ability.students.length;
    }


    function performDataSchemeTransformation(before) {
    
      var after = {
        "folder": {
          "id": before.id,
          "name": before.name,
          "questionnaires": [],
          "abilities": [],
          "folders": []
        }

      };


      for (var i = 0; before.questionnaires && i < before.questionnaires.length; i++) {
        
        var abilities = {};
        for (var j = 0; j < before.questionnaires[i].students.length; j++) {
          var abilityGrade = Math.round( before.questionnaires[i].students[j].ability / 10);
          var ability = abilities[i + abilityGrade];
          if (!ability) {
            ability = {
              "questionnaire-order": i + 1,
              "value": abilityGrade,
              "students": []
            }
          }

          ability.students.push({
            "id": before.questionnaires[i].students[j].id,
            "name": before.questionnaires[i].students[j].name,
            "finished": before.questionnaires[i].students[j].finished
          })
          abilities[i + abilityGrade] = ability;
        }

        var questionaire = {
          "id": before.questionnaires[i].id,
          "name": before.questionnaires[i].name,
          "abilities": []
        };
        for (var key in abilities) {
          abilities[key].finishedFraction = getFinishedFraction(abilities[key]);
          after.folder.abilities.push(abilities[key]);
        }

        after.folder.questionnaires.push(questionaire);

      }
      return after;
    }
    function loadDataFromQueryIfNecessary(response) {
      if (decodeURIComponent(document.location.search))
        return JSON.parse(decodeURIComponent(document.location.search.substring(1)));
      return response;
    }

    function init(initData) {

      cet.dashboard.studentsAbilityProgress.data.root = loadDataFromQueryIfNecessary(initData);
      cet.dashboard.studentsAbilityProgress.data.root = performDataSchemeTransformation(cet.dashboard.studentsAbilityProgress.data.root);

    }

    function getQuestionaireNameByOrder(order) {
      return cet.dashboard.studentsAbilityProgress.data.root.folder.questionnaires[order - 1].name
    }

    return {

      init: init,
      root: root,
      getQuestionaireNameByOrder: getQuestionaireNameByOrder

    }

  })();

})();