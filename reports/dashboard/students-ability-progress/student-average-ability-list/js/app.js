// Array.prototype.forEach.call(document.getElementsByName('selectedStudents'), function(checkbox) {console.log(checkbox.checked)})
(function () {

  var app = (function () {
    var sortByProp = 'lastName', sortByDir = 1;
    var selectedItems = [];

    function handleSortBy(event) {
      event.preventDefault();

      if (sortByProp === event.target.dataset.type) {
        sortByDir *= -1;
      } else {
        sortByProp = event.target.dataset.type;
        sortByDir = 1;
      }

      createStudentList();
    }

    function handleSortMouseEnter(event) {
      toggleArrows(this, 'visible');
    }

    function handleSortMouseLeave(event) {
      toggleArrows(this, 'hidden');
    }

    function toggleArrows(button, visbility) {
      var sortingArrows = button.querySelector('.sorting-arrows')
      
      if (button.dataset.type !== sortByProp && sortingArrows) {
        sortingArrows.style.visibility = visbility;
        var arrows = sortingArrows.querySelectorAll('div');
        if (arrows) {
          Array.prototype.forEach.call(arrows, function (arrow) {
            arrow.style.visibility = visbility;
          })
        }
      }

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

      var sortByButtons = document.querySelectorAll('.student-average-ability-list__sort')

      Array.prototype.forEach.call(sortByButtons, function (btn) {
        btn.addEventListener('click', handleSortBy);
        btn.addEventListener('mouseenter', handleSortMouseEnter);
        btn.addEventListener('mouseleave', handleSortMouseLeave);
      })
    }

    function createStudentListHeader() {
      return [
        '<div class="student-average-ability-list__buttons">',
        ' <div class="student-average-ability-list__show-btn">', cet.dashboard.studentAverageAbilityList.texts.showButton, '</div>',
        ' <button data-type="lastName" class="student-average-ability-list__sort student-average-ability-list__order-name-btn">',
        cet.dashboard.studentAverageAbilityList.texts.orderByNameButton,
        '   <div class="sorting-arrows" ', (sortByProp === 'lastName' ? '' : 'style="visibility:hidden"'), '>',
        '     <div ', (sortByProp === 'lastName' && sortByDir === 1 ? '' : 'style="visibility:hidden"'), ' class="arrow-up">▲</div>',
        '     <div ', (sortByProp === 'lastName' && sortByDir === -1 ? '' : 'style="visibility:hidden"'), 'class="arrow-down">▼</div>',
        '   </div>',
        ' </button>',
        ' <button data-type="avgAbility" class="student-average-ability-list__sort student-average-ability-list__order-average-btn">',
        cet.dashboard.studentAverageAbilityList.texts.orderByAverageButton,
        '   <div class="sorting-arrows" ', (sortByProp === 'average' ? '' : 'style="visibility:hidden"'), '>',
        '     <div ', (sortByProp === 'avgAbility' && sortByDir === 1 ? '' : 'style="visibility:hidden"'), ' class="arrow-up">▲</div>',
        '     <div ', (sortByProp === 'avgAbility' && sortByDir === -1 ? '' : 'style="visibility:hidden"'), 'class="arrow-down">▼</div>',
        '   </div>',
        ' </div>',
        '</button>'
      ].join('');
    }

    function createStudentList() {
      var selectedAbility = cet.dashboard.studentsAbilityProgress.data.root.folder.abilities.filter(function (a) { return a.isSelected })[0];
      var sortedStudents = selectedAbility.students.sort(function (a, b) {
        if (sortByDir > 0) return a[sortByProp] > b[sortByProp];

        return a[sortByProp] <= b[sortByProp]
      });

      var studentsList = document.querySelector('.student-average-ability-list');

      var ul, li;
      if (selectedAbility) {
        ul = document.createElement('ul');
        ul.className = 'student-average-ability-list__students'
        sortedStudents.forEach(function (st) {
          li = document.createElement('li');
          li.className = 'student-average-ability-list__item'
          li.innerHTML = ['',
                          '<label class="student-average-ability-list__item__name"><span class="student-average-ability-list__item__checkbox"></span>', st.lastName, ' ' , st.firstName, '</label>',
                          '<span class="student-average-ability-list__item__average">', st.avgAbility, '</span>'].join('');

          li.dataset.id = st.id;
          li.addEventListener('click', handleItemSelect);

          ul.appendChild(li);         
        });

        studentsList.innerHTML = createStudentListHeader();
        studentsList.appendChild(ul);

        sortedStudents.forEach(function (st) {
          toggleItemSelection(st.id);
        });

        bindButtonsEventListeners();
      }
    }

    function init(options) {
      var studentsList = document.querySelector('.student-average-ability-list');
      //studentsList.style = ['width: ', options.width, 'px;',
      //  'height: ', options.height, 'px;'
      //].join('');

      cet.dashboard.studentsAbilityProgress.data.on('data-selection', createStudentList);
    }

    return {
      init: init
    }

  })();

  window.cet = window.cet || {}; window.cet.dashboard = window.cet.dashboard || {}; window.cet.dashboard.studentAverageAbilityList = window.cet.dashboard.studentAverageAbilityList || {};
  cet.dashboard.studentAverageAbilityList.app = app;
  cet.dashboard.studentAverageAbilityList.init = app.init;

})();

