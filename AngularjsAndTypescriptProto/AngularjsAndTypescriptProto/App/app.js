﻿///<reference path="../Scripts/typings/angularjs/angular.d.ts"/>
///<reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
///<reference path="../Scripts/typings/angularjs/angular-sanitize.d.ts" />
define(["require", "exports", 'Controllers/MainModule', 'Controllers/CamperHomeModule', 'Controllers/SessionModule', 'Controllers/TestModule', 'Controllers/AccountModule', 'Directive/sessionControl', 'Services/PrincipalProvider'], function(require, exports, mainController, camperHome, sessionModule, testModule, accountModule, controls, principalModule) {
    var BootStrapper = (function () {
        function BootStrapper() {
            this.setupRouting = function (codeCamperApp) {
                codeCamperApp.config([
                    '$routeProvider', function ($routeProvider) {
                        $routeProvider.when('/home', {
                            templateUrl: '/Template/CamperHome',
                            controller: 'camperHomeController'
                        }).when('/Login', {
                            templateUrl: '/Account/Login',
                            controller: 'LoginController'
                        }).when('/manage', {
                            templateUrl: '/Account/Manage',
                            controller: null
                        }).when('/sessionDetail/:id', {
                            templateUrl: '/Template/SessionDetail',
                            controller: 'sessionDetailController'
                        }).otherwise({ redirectTo: '/home' });
                    }]);
            };
            this.buildCatalog = function (codeCamperApp) {
                codeCamperApp.directive('ncgRequestVerificationToken', [
                    '$http', function ($http) {
                        return function (scope, element, attrs) {
                            $http.defaults.headers.common['RequestVerificationToken'] = attrs.ncgRequestVerificationToken || "no reqeust verification token";
                            scope.$on('login::principalChanged', function () {
                                $http.defaults.headers.common['RequestVerificationToken'] = undefined;
                                $http.get('/Home/GetVerificationToken', function (data) {
                                    attrs.ncgRequestVerificationToken = data;
                                    $http.defaults.headers.common['RequestVerificationToken'] = attrs.ncgRequestVerificationToken;
                                });
                            });
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
                codeCamperApp.controller('camperHomeController', ['$scope', camperHome.CamperHomeController]); //didn't really need a separate scope, so default injected here.
                codeCamperApp.controller('SessionEditController', sessionModule.SessionEditController);
                codeCamperApp.controller('LoginController', accountModule.LoginController);
                codeCamperApp.controller('LoginPartialController', accountModule.LoginPartialController);
                codeCamperApp.controller('sessionDetailController', sessionModule.SessionDetailController);
                codeCamperApp.directive('sessionitem', function () {
                    return controls.sessionControl.Directive();
                });
            };
        }
        BootStrapper.prototype.init = function () {
            var inj = angular.injector(['ng', 'ngResource']);
            var res = inj.get('$resource');
            var rs = inj.get('$rootScope');
            var codeCamperApp = angular.module("CarolinaCodeCamperApp", ['ng', 'ngRoute', 'ngResource', 'ngSanitize', 'ui.bootstrap']);
            var self = this;

            codeCamperApp.service('cpSingleton', principalModule.PrincipalProviderService).factory('currentPrincipal', [
                'cpSingleton',
                function (cpSingleton) {
                    return cpSingleton;
                }]).factory('sessionResourceFactory', [
                '$resource', function ($resource) {
                    var retval = new sessionModule.SessionResourceFactory($resource);

                    return retval.GetSessionResource();
                }]).run([
                'currentPrincipal',
                function (ppsService) {
                    var promise = ppsService.GetResource();
                    console.log('calling Principal service load');
                    promise.then(function (result) {
                        console.log('principal loaded...');
                    }, function (error) {
                        console.log(error);
                    });
                }]);

            console.log('building catalog...');
            self.buildCatalog(codeCamperApp);
            console.log('building Routes....');
            self.setupRouting(codeCamperApp);
            console.log('finishing bootstrap!');
            angular.bootstrap($(document), ['CarolinaCodeCamperApp']);
            //this.pps = new principalModule.PrincipalProviderService(res, rs);
        };
        return BootStrapper;
    })();

    var bs = new BootStrapper();
    bs.init();
});
//# sourceMappingURL=app.js.map
