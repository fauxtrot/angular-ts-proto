define(["require", "exports"], function(require, exports) {
    var MainController = (function () {
        function MainController($scope, $rootScope, $location, $route) {
            this.$scope = $scope;
            $scope.history = [];
            $scope.$on("$routeChangeSuccess", function (e, current, previous) {
                $scope.activeViewPath = $location.path();
                if (previous) {
                    $scope.history.push(previous);
                }
            });

            $rootScope.$on('$global:ClientBusy', function () {
                $scope.isBusy = true;
            });

            $rootScope.$on('$global:ClientFree', function () {
                $scope.isBusy = false;
            });

            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };
            $scope.isBusy = false;
        }
        MainController.$inject = ['$scope', '$rootScope', '$location', '$route'];
        return MainController;
    })();
    exports.MainController = MainController;
});
//# sourceMappingURL=MainModule.js.map
