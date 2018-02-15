
(function () {

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentsAbilityProgress = window.cet.dashboard.studentsAbilityProgress || {};
  cet.dashboard.studentsAbilityProgress.data = (function () {

    var root;
    var utils;
    var allAbilities;
    var allLines;
    var selectedStudentsAbilities = [];
    var selectedStudentsLines = [];
    var selectedStudents = [];
    var questionsAbility = [];
    var abilitiesOfHighestSubmitted;
    var rootElement;
    const ABILITY_NORMALIZE_FACTOR = 10;

    function init(rootElementP) {
      rootElement = rootElementP;
    }

    function load(initData) {
      selectedStudentsAbilities = [];
      selectedStudentsLines = [];
      selectedStudents = [];
      abilitiesOfHighestSubmitted = null;

      cet.dashboard.studentsAbilityProgress.data.root = loadDataFromQueryIfNecessary(initData);
      cet.dashboard.studentsAbilityProgress.data.root = performDataSchemeTransformation(cet.dashboard.studentsAbilityProgress.data.root);

      utils = cet.dashboard.studentsAbilityProgress.utils;
      allAbilities = cet.dashboard.studentsAbilityProgress.data.root.folder.abilities;
      allLines = cet.dashboard.studentsAbilityProgress.data.root.folder.lines;

      invokeReady();
    }

    function invokeReady() {
      rootElement.dispatchEvent(new CustomEvent('ready'));
    }

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
          "lines": [],
          "folders": []
        }

      };

      after.folder.lines = buildLinesArray(before.questionnaires);

      for (var i = 0; before.questionnaires && i < before.questionnaires.length; i++) {
        var abilities = {};
        questionsAbility.push({});
        for (var j = 0; j < before.questionnaires[i].students.length; j++) {
          var abilityGrade = normalizeAbility(before.questionnaires[i].students[j].ability);
          var ability = abilities[i + abilityGrade];
          if (!ability) {
            ability = {
              "questionnaire-order": i,
              "value": abilityGrade,
              "students": []
            }
          }

          var currentStudent = {}, avgAbilityForStudent = 0, avgScoreForStudent = 0;
          if (before.students) {
            currentStudent = before.students.filter(function (st) { return before.questionnaires[i].students[j].id === st.id })[0];
            avgAbilityForStudent = normalizeAbility(currentStudent.avgAbility);
            avgScoreForStudent = currentStudent.avgScore;
          }

          ability.students.push({
            "id": before.questionnaires[i].students[j].id,
            "firstName": before.questionnaires[i].students[j].firstName,
            "lastName": before.questionnaires[i].students[j].lastName,
            "finished": before.questionnaires[i].students[j].isScopeFinished,
            "highestSubmitted": before.questionnaires[i].students[j].isHighestSubmitted,
            "avgAbility": avgAbilityForStudent,
            "avgScore": avgScoreForStudent,
            "taskUrl": "http://productplayer.cet.ac.il/iframes/lms-teacher-dashboard/student-lo.html?&task=" + before.questionnaires[i].taskId + "&student=" + before.questionnaires[i].students[j].id + "&options=noauth"
          })
          
          questionsAbility[i][before.questionnaires[i].students[j].id] = before.questionnaires[i].students[j].questionsAbility;


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

    function normalizeAbility(ability) {
      return Math.round(ability / ABILITY_NORMALIZE_FACTOR);
    }

    function buildLinesArray(questionnaires) {

      /* comparator functions: */
      const findStartedLine = function (point, studentId) {
        return point.to === null && point.studentId === studentId
      };

      /* create lines array: */
      let linesArray = [];
      let questionnaireIndex = 1;
      let foundStartLine;
      if (questionnaires && questionnaires.length) {
        questionnaires.forEach(function (questionnaire) {
          questionnaire.students.forEach(function (student) {
            /* for each student, first identify if this point completes a started line: */
            foundStartLine = linesArray.filter(function (point) { return findStartedLine(point, student.id) })[0];
            if (foundStartLine) {
              foundStartLine.to = { x: questionnaireIndex, y: normalizeAbility(student.ability) }
              foundStartLine.skip = foundStartLine.to.x - foundStartLine.from.x > 1;
            }
            /* in any case, it's a starting of new line: */
            linesArray.push({
              from: { x: questionnaireIndex, y: normalizeAbility(student.ability) },
              to: null,
              studentId: student.id
            });
          });
          questionnaireIndex++;
        });

        /* finally, remove from the array the lines without ends: */
        for (let i = 0; i < linesArray.length; i++) {
          if (linesArray[i].to === null) {
            linesArray.splice(i, 1);
            i--;
          }
        }
      }
      return linesArray;
    }

    function getQuestionaireNameByOrder(order) {
      return cet.dashboard.studentsAbilityProgress.data.root.folder.questionnaires[order].name
    }

    function resetSelectedAbilities() {
      abilitiesOfHighestSubmitted.forEach(function (ability) {
        ability.isSelected = false;
      });
    }

    function setSelectedAbilities(ability) {
      abilitiesOfHighestSubmitted.forEach(function (currentAbility) {
        currentAbility.isSelected = currentAbility["questionnaire-order"] == ability["questionnaire-order"] && currentAbility.value == ability.value;
      });


      rootElement.dispatchEvent(new CustomEvent('abilities-selection-changed'));
    }

    function on(eventName, method) {
      rootElement.addEventListener(eventName, method);
    }

    function getAbilitiesOfHighestSubmitted() {
      if (abilitiesOfHighestSubmitted)
        return abilitiesOfHighestSubmitted;

      abilitiesOfHighestSubmitted = [];
      for (var i = 0; i < allAbilities.length; i++) {

        var highestSubmittedStudents = allAbilities[i].students.filter(function (student) { return student.highestSubmitted; })
        if (highestSubmittedStudents.length == 0)
          continue;
        var ability = {
          "questionnaire-order": allAbilities[i]["questionnaire-order"],
          "value": allAbilities[i].value,
          "students": highestSubmittedStudents,
        }
        ability.finishedFraction = getFinishedFraction(ability);
        abilitiesOfHighestSubmitted.push(ability);

      }
      return abilitiesOfHighestSubmitted;
    }

    function setSelectedStudents(students) {

      selectedStudents = utils.cloneJSON(students);

      updateAbilities(students);
      updatePaths(students);

      rootElement.dispatchEvent(new CustomEvent('students-selection-changed'));
    }

    function updateAbilities(students) {
      selectedStudentsAbilities = [];
      for (var i = 0; i < allAbilities.length; i++) {
        var ability = utils.cloneJSON(allAbilities[i]);
        for (var j = allAbilities[i].students.length - 1; j >= 0 ; j--) {
          var index = students.indexOf(allAbilities[i].students[j].id)
          if (index == -1)
            ability.students.splice(j, 1);
          else if (selectedStudents.filter(function (student) { return student.id == allAbilities[i].students[j].id; }).length == 0) {
            selectedStudents[index] = allAbilities[i].students[j];
          }
        }
        if (ability.students.length > 0) {
          selectedStudentsAbilities.push(ability);
        }
      }
    }

    function updatePaths(students) {
      let selectedStudentsIds = selectedStudents.map(function (selectedStudent) { return selectedStudent.id });
      selectedStudentsLines = allLines.filter(function (line) { return selectedStudentsIds.indexOf(line.studentId) > -1 });
    }

    function getSelectedStudentsAbilities() {
      return selectedStudentsAbilities;
    }
    function getSelectedStudentsLines() {
      return selectedStudentsLines;
    }

    function getSelectedStudents() {
      return selectedStudents;
    }

    function getQuestionsAbility(questionnaireOrder, studentId) {
      return questionsAbility[questionnaireOrder][studentId];
    }

    return {

      init: init,
      load: load,
      root: root,
      getQuestionaireNameByOrder: getQuestionaireNameByOrder,
      on: on,
      getAbilitiesOfHighestSubmitted: getAbilitiesOfHighestSubmitted,
      setSelectedAbilities: setSelectedAbilities,
      setSelectedStudents: setSelectedStudents,
      getSelectedStudents: getSelectedStudents,
      getSelectedStudentsAbilities: getSelectedStudentsAbilities,
      getSelectedStudentsLines: getSelectedStudentsLines,
      invokeReady: invokeReady,
      getQuestionsAbility: getQuestionsAbility
    }

  })();

})();