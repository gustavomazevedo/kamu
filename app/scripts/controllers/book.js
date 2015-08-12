'use strict';

angular
  .module('libraryUiApp')
  .controller('BookCtrl', function($scope, BookService) {

    $scope.searchCriteria = '';

    $scope.findGoogleBooks = function() {
        var searchCriteria = $scope.searchCriteria.toString();
        
        $scope.book = {};

        if (searchCriteria !== '') {
            BookService.findLibraryBook(searchCriteria).
                success(populateBookFromLibraryApi).
                error(hideForm);
        }   
    };

    $scope.autoCompleteSearch = function () {
        angular.element('#search').removeClass('hide');
        angular.element('#not-found-message').addClass('hide');
        angular.element('#book-form').addClass('hide');

        angular.element('#isbn-search').removeClass('popup-nav-unactive');
        angular.element('#isbn-search').addClass('popup-nav-active');

        angular.element('#manual-add').removeClass('popup-nav-active');
        angular.element('#manual-add').addClass('popup-nav-unactive');
    }

    $scope.addManually = function() {
        $scope.book = {};

        angular.element('#search').addClass('hide');
        angular.element('#not-found-message').addClass('hide');
        angular.element('#book-form').removeClass('hide');

        angular.element('#isbn-search').removeClass('popup-nav-active');
        angular.element('#isbn-search').addClass('popup-nav-unactive');

        angular.element('#manual-add').removeClass('popup-nav-unactive');
        angular.element('#manual-add').addClass('popup-nav-active');
    }

    var populateBookFromLibraryApi = function(data) {
        if (data._embedded !== undefined) {
            $scope.book = data._embedded.books[0];
            $scope.book.imageUrl = BookService.resolveBookImage($scope.book.imageUrl);

            showForm();
        } else {
            BookService.findGoogleBooks($scope.searchCriteria).
                success(populateBookFromGoogleApi).
                error(hideForm);
        }
    }

    var populateBookFromGoogleApi = function (data) {
        var bookFound = false;

        angular.forEach(data.items, function (item) {
            bookFound = true;
            $scope.book = BookService.extractBookInformation(item.volumeInfo, $scope.searchCriteria);
        });

        bookFound ? showForm() : hideForm();
    }

    function showForm() {
        angular.element('#not-found-message').addClass('hide');
        angular.element('#book-form').removeClass('hide');
    }

    function hideForm() {
        angular.element('#not-found-message').removeClass('hide');
        angular.element('#book-form').addClass('hide');
    }
});