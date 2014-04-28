var MainController = (function () {
    function MainController($scope, $location) {
        this.$scope = $scope;
        $scope.$on("$routeChangeSuccess", function (e, current, previous) {
            $scope.activeViewPath = $location.path();
        });
    }
    MainController.$inject = ['$scope'];
    return MainController;
})();
//# sourceMappingURL=Controllers.js.map
