define(["require", "exports"], function(require, exports) {
    

    //end scope defs
    //controller defs
    var LoginController = (function () {
        function LoginController($scope, $rootScope, $http, $location, $timeout, $window) {
            var _this = this;
            this.submitLogin = function () {
                var promise = _this.http.post('/Account/Login?returnUrl=' + '%23%2Fhome', { UserName: _this.UserName, Password: _this.Password, RememberMe: _this.RememberMe }, { withCredentials: true, headers: { 'Content-Type': 'application/json' } });
                var self = _this;
                promise.success(function (data, status, headers, config) {
                    if (data.returnUrl) {
                        self.location.path(data.returnUrl);
                        self.scope.$emit('login::principalChanged', null);
                    } else if (data.error) {
                        console.log(data.error);
                    }
                });
                return true;
            };
            $scope.vm = this;
            this.http = $http;
            this.rootScope = $rootScope;
            this.location = $location;
            this.timeout = $timeout;
            this.window = $window;
            this.scope = $scope;
        }
        LoginController.$inject = ['$scope', '$rootScope', '$http', '$location', '$route', '$timeout', '$window'];
        return LoginController;
    })();
    exports.LoginController = LoginController;

    var LoginPartialController = (function () {
        function LoginPartialController($scope, $rootScope, $sanitize, $sce, $http) {
            this.refreshData = function () {
                var self = this;
                this.http.get('/Template/_LoginPartial').success(function (data) {
                    self.template = self.sce.trustAsHtml(data);
                });
            };
            $scope.vm = this;

            this.http = $http;
            this.sce = $sce;
            this.refreshData();
            var ref = this;
            $rootScope.$on('login::principalChanged', function () {
                ref.refreshData();
            });
        }
        LoginPartialController.$inject = ['$scope', '$rootScope', '$sanitize', '$sce', '$http'];
        return LoginPartialController;
    })();
    exports.LoginPartialController = LoginPartialController;
});
//# sourceMappingURL=AccountModule.js.map
