angular.module('eligibility', [])
  //=======Home screen controller======================
  .controller('eligibilityCtrl', function($scope, $stateParams, $ionicHistory, $cordovaSQLite, $controller, $ionicModal, $http, $ionicLoading, userService, databaseManager, eligiblityDataManager, consentDataManager, irkResults, $state, $location, $window) {
    //========================select eligiblity test view

    eligiblityDataManager.getEligibilityQuestions().then(function(eligiblityData) {
      $scope.eligiblityData = eligiblityData;
      $scope.isDisabled = true;
      $scope.results = new Array();
      $scope.roundClass = 'roundDisabled';
      //generate the view data and launch
      var optionList = '';
      angular.forEach($scope.eligiblityData, function(value, key) {
        var id = value.id;
        var question = value.title;
        var trueText = value['true-text'];
        var falseText = value['false-text'];
        var normalImage = 'irk-btn-round-outline'; //value.normal-state-image;
        var selectedImage = 'irk-btn-round'; //value.selected-state-image ;

        optionList = optionList + '<custom-image-choice-question-step id="' + id + '" title="' + question + '" optional="false" >' +
          '<custom-image-choice value="' + trueText + '" normal-state-image="' + normalImage + '" selected-state-image="' + selectedImage + '" optiontext="' + trueText + '" >' +
          '</custom-image-choice>' +
          '<custom-image-choice value="' + falseText + '" normal-state-image="' + normalImage + '" selected-state-image="' + selectedImage + '" optiontext="' + falseText + '">' +
          '</custom-image-choice>' +
          '</custom-image-choice-question-step>' +
          '<div class="irk-spacer"></div>';
      });

      //  var dynamicContent = angular.element(document.querySelector('#questionList'));
      //  dynamicContent.append(optionList);
      //  $compile(dynamicContent)($scope);

      var checkEligibility = " <ion-modal-view> " +
        "<ion-header-bar>" +
        "<h1 class='title'></h1>" +
        "<div class='buttons'>" +
        "<button class='button button-clear IRK-FONT2' ng-click='sectionBack()'>Cancel</button>" +
        "</div>" +
        "</ion-header-bar>" +
        "<ion-content >" +
        "<form name='myForm'>" +
        "<div class='irk-spacer'></div>" +
        "<div id='questionList'> " +
        optionList + "</div>" +
        "</form>" +
        "</ion-content>" +
        "<ion-footer-bar class='irk-bottom-bar' keyboard-attach irk-survey-bar>" +
        "<div>" +
        "<button class='irk-centered fontB irk-font-helvetica {{roundClass}}' ng-disabled='isDisabled' ng-click='compareEligiblity()'><b>DONE<b></button>" +
        "</div>" +
        "</ion-footer-bar>" +
        "</ion-modal-view>";
      $scope.learnmore = $ionicModal.fromTemplate(checkEligibility, {
        scope: $scope,
        animation: 'slide-in-left',
        hardwareBackButtonClose: false,
      });
      $scope.modal = $scope.learnmore;
      $scope.learnmore.show();
    });

    $scope.checkEligibilitySubmitEnable = function(id, answer) {
      $scope.results[id] = answer;
      if (Object.keys($scope.results).length === $scope.eligiblityData.length) {
        $scope.isDisabled = false;
        $scope.roundClass = 'round1';
      } else {
        $scope.isDisabled = true;
      }
    };

    $scope.compareEligiblity = function() {
      var check = true;
      angular.forEach($scope.eligiblityData, function(value, key) {
        var questionID = value.id;
        var answerexpected = value.expected_answer;
        // Visit non-inherited enumerable keys
        Object.keys($scope.results).forEach(function(key) {
          if (key == questionID && check) {
            var answerbyUser = $scope.results[key];
            if (answerbyUser.toLowerCase() != answerexpected.toLowerCase()) {
              check = false;
            }
          }
        });
      });

      // if all set load sign up page
      if (check) {
        $scope.modal.remove();
        $ionicHistory.clearCache().then(function() {
          $ionicModal.fromTemplateUrl('templates/eligiblity-yes.html', {
            scope: $scope,
            animation: 'slide-in-left',
            hardwareBackButtonClose: false,
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
        });
      } else {
        $scope.modal.remove();
        $ionicHistory.clearCache().then(function() {
          $state.go('not-eligibleUser');
        });
      }
    };


    // ==== Close the existing modal and open Sign in html in new modal========
    $scope.openSignIn = function() {
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-left',
        hardwareBackButtonClose: false,
      }).then(function(modal) {
        $scope.modal.remove();
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    // ==== on click of back from sign in screen ========
    $scope.sectionBack = function() {
      $scope.modal.remove();
      $state.transitionTo('home', null, {
        'reload': false
      });
    };

    $scope.goHome = function() {
      $ionicHistory.clearCache().then(function() {
        $scope.modal.remove();
        $state.transitionTo('home');
      });
    };

    $scope.beginConsent = function() {
      $ionicHistory.clearCache().then(function() {
        $scope.modal.remove();
        $state.transitionTo('beginConsent');
      });
    };

    $scope.closeModal = function() {
      $scope.modal.remove();
    };

  });
