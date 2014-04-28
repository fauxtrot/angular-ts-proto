define(["require", "exports"], function(require, exports) {
    var LoginTopController = (function () {
        function LoginTopController($scope, $sanitize, $http) {
            $http.get('/Account/LoginPartial').success(function (result) {
                $scope.loginHtml = result;
            });
        }
        LoginTopController.$inject = ['$scope', '$sanitize', '$http'];
        return LoginTopController;
    })();
    exports.LoginTopController = LoginTopController;
});
//# sourceMappingURL=LoginTopController.js.map
