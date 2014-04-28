define(["require", "exports"], function(require, exports) {
    var TestController = (function () {
        function TestController($scope, $http, getAntiForgeryToken) {
            var _this = this;
            this.successCallback = function (data) {
                if (data.result) {
                    console.log(data.result);
                }
            };
            this.scope = $scope;

            this.scope.doAntiForgeryRequests = function () {
                var token = window['AfToken'];
                $http({
                    withCredentials: true, url: '/home/SuperSecret', method: 'POST'
                }).success(_this.successCallback).error(function (err) {
                    console.log(err);
                });
            };
        }
        TestController.$inject = ['$scope', '$http', 'getAntiForgeryToken'];
        return TestController;
    })();
    exports.TestController = TestController;
});
//# sourceMappingURL=TestController.js.map
