///<reference path="../Scripts/typings/angularjs/angular.d.ts"/>
///<reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
///<reference path="../Scripts/typings/angularjs/angular-sanitize.d.ts" />
define(["require", "exports", 'Controllers/MainModule', 'Controllers/CamperHomeModule', 'Controllers/SessionModule', 'Controllers/TestModule', 'Controllers/AccountModule', 'Directive/sessionControl', 'Services/PrincipalProvider'], function(require, exports, mainController, camperHome, sessionModule, testModule, accountModule, controls, principalModule) {
    var BootStrapper = (function () {
        function BootStrapper() {
            this.setupRouting = function (codeCamperApp) {
                codeCamperApp.config([
                    '$routeProvider', function ($routeProvider) {
                        $routeProvider.when('/home', {
                            templateUrl: '/Home/CamperHome',
                            controller: 'camperHomeController'
                        }).when('/Login', {
                            templateUrl: '/Account/Login',
                            controller: 'LoginController'
                        }).when('/manage', {
                            templateUrl: '/Account/Manage',
                            controller: null
                        }).otherwise({ redirectTo: '/home' });
                    }]);
            };
            this.buildCatalog = function (codeCamperApp) {
                codeCamperApp.directive('ncgRequestVerificationToken', [
                    '$http', function ($http) {
                        return function (scope, element, attrs) {
                            $http.defaults.headers.common['RequestVerificationToken'] = attrs.ncgRequestVerificationToken || "no reqeust verification token";
                        };
                    }]);

                //patterns explained:
                // controller(name, module.controllerclass) -- calls this without any injection
                // controller(name, [string... controllerclass] -- calls using injection within the array in the order you specify.
                // the above seems to override any injection that gets done by anciallry classes, so if you use this,
                // you will need to make sure that you have a provider defined at the *module level*
                codeCamperApp.controller('testController', testModule.TestController);
                codeCamperApp.controller('MainController', mainController.MainController);
                codeCamperApp.controller('sessionsController', sessionModule.SessionController);
                codeCamperApp.controller('camperHomeController', ['$scope', camperHome.CamperHomeController]);
                codeCamperApp.controller('SessionEditController', sessionModule.SessionEditController);
                codeCamperApp.controller('LoginController', accountModule.LoginController);
                codeCamperApp.controller('LoginPartialController', accountModule.LoginPartialController);

                codeCamperApp.directive('sessionitem', function () {
                    return controls.sessionControl.Directive();
                });
            };
        }
        BootStrapper.prototype.init = function () {
            var inj = angular.injector(['ng', 'ngResource']);
            var res = inj.get('$resource');

            var codeCamperApp = angular.module("CarolinaCodeCamperApp", ['ng', 'ngRoute', 'ngResource', 'ngSanitize', 'ui.bootstrap']);
            var self = this;
            principalModule.PrincipalProviderService.GetResource(res).then(function (result) {
                codeCamperApp.factory('currentPrincipal', [
                    '$resource', function ($resource) {
                        console.log('principal loaded...');
                        self.buildCatalog(codeCamperApp);

                        self.setupRouting(codeCamperApp);

                        angular.bootstrap($(document), ['CarolinaCodeCamperApp']);

                        return result;
                    }]);
                //codeCamperApp.run(['currentPrincipal', function (cp) { console.log(cp); }]);
            }, function (error) {
                console.log(error);
            });
        };
        return BootStrapper;
    })();

    var bs = new BootStrapper();
    bs.init();
});
//# sourceMappingURL=app.js.map
