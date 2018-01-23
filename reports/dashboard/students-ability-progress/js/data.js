
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityProgress = window.cet.dashboard.studentsAbilityProgress || {};
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
      if (!before) return;
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
          var abilityGrade = Math.round(before.questionnaires[i].students[j].ability / 10);
          var ability = abilities[i + abilityGrade];
          if (!ability) {
            ability = {
              "questionnaire-order": i + 1,
              "value": abilityGrade,
              "students": []
            }
          }

          var currentStudent = {}, avgAbilityForStudent = 0, avgScoreForStudent = 0;
          if (before.students) {
            currentStudent = before.students.filter(function (st) { return before.questionnaires[i].students[j].id === st.id })[0];
            avgAbilityForStudent = Number(currentStudent.avgAbility).toFixed(1);
            avgScoreForStudent = Number(currentStudent.avgScore).toFixed(1);
          }
          //if (before.questionnaires[i].students[j].isHighestSubmitted) {
            ability.students.push({
              "id": before.questionnaires[i].students[j].id,
              "firstName": before.questionnaires[i].students[j].firstName,
              "lastName": before.questionnaires[i].students[j].lastName,
              "finished": before.questionnaires[i].students[j].isScopeFinished,
              "highestSubmitted": before.questionnaires[i].students[j].isHighestSubmitted,
              "avgAbility": avgAbilityForStudent,
              "avgScore": avgScoreForStudent
              
            })
          //}
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
      
      document.body.dispatchEvent(new Event('ready'));
    }

    function getQuestionaireNameByOrder(order) {
      return cet.dashboard.studentsAbilityProgress.data.root.folder.questionnaires[order - 1].name
    }

    function resetSelectedAbilities() {
      cet.dashboard.studentsAbilityProgress.data.root.folder.abilities.forEach(function (ability) {
        ability.isSelected = false;
      });
    }

    function setSelectedAbilities(ability) {
      resetSelectedAbilities();
      ability.isSelected = true;

      window.document.body.dispatchEvent(new Event('data-selection'));
    }

    function on(eventName, method) {
      document.body.addEventListener(eventName, method);
    }

    function getAbilitiesOfHighestSubmitted() {

      var allAbilities = cet.dashboard.studentsAbilityProgress.data.root.folder.abilities;
      var result = [];
      for (var i = 0; i < allAbilities.length; i++) {
        
        var highestSubmittedStudents = allAbilities[i].students.filter((student) => { return student.highestSubmitted; })
        if (highestSubmittedStudents.length == 0)
          continue;
        var ability = {
          "questionnaire-order": allAbilities[i]["questionnaire-order"],
          "value": allAbilities[i].value,
          "students": highestSubmittedStudents,
        }
        ability.finishedFraction = getFinishedFraction(ability);
        result.push(ability);
        
      }
      return result;
    }

    return {

      init: init,
      root: root,
      getQuestionaireNameByOrder: getQuestionaireNameByOrder,
      setSelectedAbilities: setSelectedAbilities,
      on: on,
      getAbilitiesOfHighestSubmitted: getAbilitiesOfHighestSubmitted

    }

  })();

})();