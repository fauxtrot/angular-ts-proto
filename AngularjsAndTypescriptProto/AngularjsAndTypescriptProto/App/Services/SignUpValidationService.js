///<reference path="../../Scripts/typings/angularjs/angular-resource.d.ts"/>
define(["require", "exports"], function(require, exports) {
    var SignupValidationService = (function () {
        function SignupValidationService($resource, $http) {
            var _this = this;
            this.IsEmailUserAvailable = function (emailUserName) {
                return _this.$http.get('/Signup/QueryEmailUsernameAvailable?emailUserName=' + emailUserName);
            };
            this.$resource = $resource;
            this.$http = $http;
        }
        SignupValidationService.$inject = ['$resource', '$http'];
        return SignupValidationService;
    })();
    exports.SignupValidationService = SignupValidationService;
});
//# sourceMappingURL=SignUpValidationService.js.map
