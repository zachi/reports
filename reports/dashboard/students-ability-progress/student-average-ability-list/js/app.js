
(function () {

  var app = (function () {
    var sortByProp = 'lastName', sortByDir = 1;
    var selectedItems = [];
    var sortByButtons;
    var sortingArrows;

    function handleSortBy(event) {
      event.preventDefault();
      Array.prototype.forEach.call(sortByButtons, function (btn) {
        btn.classList.remove('student-average-ability-list__sort--active');
      })
      var srcButton = event.target;
      if (!srcButton.classList.contains('student-average-ability-list__sort'))
        srcButton = cet.dashboard.lib.utils.findAncestor(srcButton, 'student-average-ability-list__sort');

      srcButton.classList.add('student-average-ability-list__sort--active')
      if (sortByProp === srcButton.dataset.type) {
        sortByDir *= -1;
      } else {
        sortByProp = srcButton.dataset.type;
        sortByDir = 1;
      }
      Array.prototype.forEach.call(sortingArrows, function (arrow) {
        arrow.classList.remove('student-average-ability-list__arrow--active');
      })
      srcButton.querySelector('.student-average-ability-list__arrow-' + (sortByDir == 1 ? 'up' : 'down')).classList.add('student-average-ability-list__arrow--active')

      createStudentList();
    }

    function handleItemSelect(event) {
      toggleItemSelection(this.dataset.id);

      if (selectedItems.indexOf(this.dataset.id) < 0) {
        // Add item to selected items
        if (selectedItems.length < 5) {
          selectedItems.push(this.dataset.id);
        }
      } else {
        // Add item to selected items        
        selectedItems.splice(selectedItems.indexOf(this.dataset.id), 1);
      }

      toggleItemSelection(this.dataset.id);

      cet.dashboard.studentsAbilityProgress.data.setSelectedStudents(selectedItems);
    }

    function toggleItemSelection(id) {
      var item = document.querySelector('.student-average-ability-list__item[data-id="' + id + '"]');
      var checkbox = item.querySelector('.student-average-ability-list__item__checkbox');
      if (!checkbox) return;

      if (selectedItems.indexOf(id) < 0) {
        checkbox.classList.remove('student-average-ability-list__item__checkbox--is-checked');
      } else {
        checkbox.classList.add('student-average-ability-list__item__checkbox--is-checked');
      }
      
      if (selectedItems.length >= 5) {
        disableNotSelectedItems();
      } else {
        enableAllItems()
      }
    }

    function disableNotSelectedItems() {
      var items = document.querySelectorAll('.student-average-ability-list__item');
      Array.prototype.forEach.call(items, function (item) {
        if (selectedItems.indexOf(item.dataset.id) < 0) {
          item.classList.add('student-average-ability-list__item--is-disabled');
        }
      });
    }

    function enableAllItems() {
      var items = document.querySelectorAll('.student-average-ability-list__item');
      Array.prototype.forEach.call(items, function (item) {
        item.classList.remove('student-average-ability-list__item--is-disabled');
      });
    }

    function bindButtonsEventListeners() {

      sortByButtons = document.querySelectorAll('.student-average-ability-list__sort')
      Array.prototype.forEach.call(sortByButtons, function (btn) {
        btn.addEventListener('click', handleSortBy);
      })
    }

    function createStudentListHeader() {
      
      return [
        '<div class="student-average-ability-list__buttons">',
        ' <div class="student-average-ability-list__show-btn">', cet.dashboard.studentAverageAbilityList.texts.showButton, '</div>',
        ' <button data-type="lastName" class="student-average-ability-list__sort student-average-ability-list__order-name-btn">',
        cet.dashboard.studentAverageAbilityList.texts.orderByNameButton,
        '   <div class="student-average-ability-list__sorting-arrows" >',
        '     <div class="student-average-ability-list__arrow student-average-ability-list__arrow-up ', (sortByProp === 'lastName' && sortByDir === 1 ? 'student-average-ability-list__arrow--active' : ''), '" >▲</div>',
        '     <div class="student-average-ability-list__arrow student-average-ability-list__arrow-down ', (sortByProp === 'lastName' && sortByDir === -1 ? 'student-average-ability-list__arrow--active': ''), '" >▼</div>',
        '   </div>',
        ' </button>',
        ' <button data-type="avgAbility" class="student-average-ability-list__sort student-average-ability-list__order-average-btn">',
        cet.dashboard.studentAverageAbilityList.texts.orderByAverageButton,
        '   <div class="student-average-ability-list__sorting-arrows" >',
        '     <div class="student-average-ability-list__arrow student-average-ability-list__arrow-up ', (sortByProp === 'avgAbility' && sortByDir === 1 ? 'student-average-ability-list__arrow--active' : ''), '" >▲</div>',
        '     <div class="student-average-ability-list__arrow student-average-ability-list__arrow-down ', (sortByProp === 'avgAbility' && sortByDir === -1 ? 'student-average-ability-list__arrow--active' : ''), '" >▼</div>',
        '   </div>',
        ' </div>',
        '</button>'
      ].join('');
    }

    function createStudentList() {
      var selectedAbility = cet.dashboard.studentsAbilityProgress.data.getAbilitiesOfHighestSubmitted().filter(function (a) { return a.isSelected })[0];
      var sortedStudents = selectedAbility.students.sort(function (a, b) {
        if (sortByDir > 0)
          return a[sortByProp] > b[sortByProp] ? 1 : -1;

        return a[sortByProp] <= b[sortByProp] ? 1 : -1;
      });

      var studentsList = document.querySelector('.student-average-ability-list');
      var previousStudents = studentsList.querySelector('.student-average-ability-list__students');
      if(previousStudents)
        previousStudents.remove();
      //if no sort selected yet, sort by name is defaulted
      if (!studentsList.querySelector('.student-average-ability-list__sort--active'))
        studentsList.querySelector('.student-average-ability-list__order-name-btn').classList.add('student-average-ability-list__sort--active');
      var ul, li;
      if (selectedAbility) {
        ul = document.createElement('ul');
        ul.className = 'student-average-ability-list__students'
        sortedStudents.forEach(function (st) {
          li = document.createElement('li');
          li.className = 'student-average-ability-list__item'
          li.innerHTML = ['',
                          '<label class="student-average-ability-list__item__name" title="', st.lastName, ' ', st.firstName, '"><span class="student-average-ability-list__item__checkbox"></span>', st.lastName, ' ', st.firstName, '</label>',
                          '<span class="student-average-ability-list__item__average">', Number(st.avgAbility).toFixed(1), '</span>'].join('');

          li.dataset.id = st.id;
          li.addEventListener('click', handleItemSelect);

          ul.appendChild(li);         
        });

        //studentsList.innerHTML = createStudentListHeader();
        studentsList.appendChild(ul);


    
        
        for (var i = selectedItems.length - 1; i >= 0; i--) {

          if (sortedStudents.filter(function (ss) { return ss.id === selectedItems[i]; }).length === 0)
            selectedItems.splice(i, 1);
        }
        
        sortedStudents.forEach(function (st) {
          toggleItemSelection(st.id);
        });
        bindButtonsEventListeners();
        cet.dashboard.studentsAbilityProgress.data.setSelectedStudents(selectedItems);

      }
    }

    function init(options) {
      var studentsList = document.querySelector('.student-average-ability-list');
      studentsList.style.width = options.width + 'px';
      studentsList.style.height = options.height + 'px';
      studentsList.innerHTML = createStudentListHeader();
      cet.dashboard.studentsAbilityProgress.data.on('abilities-selection-changed', createStudentList);
      sortingArrows = studentsList.querySelectorAll('.student-average-ability-list__arrow');

    }

    return {
      init: init
    }

  })();

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentAverageAbilityList = window.cet.dashboard.studentAverageAbilityList || {};
  cet.dashboard.studentAverageAbilityList.app = app;
  cet.dashboard.studentAverageAbilityList.init = app.init;

})();

