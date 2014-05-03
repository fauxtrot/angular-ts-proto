///<reference path="../Scripts/typings/angularjs/angular.d.ts"/>
///<reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
///<reference path="../Scripts/typings/angularjs/angular-sanitize.d.ts" />

//a quick note on require.js:
//these are the directories as relative to the app file.
//so from (this directory)/Controllers/MainModule.js is how to read which actual file is loaded
//Typescript has been configured to use AMD to package up is "exportable" classes
//thereby making the file the module level object.
import mainController = require('Controllers/MainModule');
import camperHome = require('Controllers/CamperHomeModule');
//import signUp = require('Controllers/SignUpController');
//import signupValidationService = require('Services/SignUpValidationService');
import sessionModule = require('Controllers/SessionModule');
import testModule = require('Controllers/TestModule');
import accountModule = require('Controllers/AccountModule');
import controls = require('Directive/sessionControl');
import userModle = require('Controllers/UserModule');
import principalModule = require('Services/PrincipalProvider');

interface ICCAppRootScope extends ng.IRootScopeService {
    principal: principalModule.IPrincipal;
}

class BootStrapper {


    public init() {
        var inj = angular.injector(['ng', 'ngResource']);
        var res = inj.get('$resource');
        var rs = inj.get('$rootScope');
        var codeCamperApp = angular.module("CarolinaCodeCamperApp", ['ng', 'ngRoute', 'ngResource', 'ngSanitize', 'ui.bootstrap']);
        var self = this;

        codeCamperApp
            .service('cpSingleton', principalModule.PrincipalProviderService)
            .factory('currentPrincipal', ['cpSingleton',
            function (cpSingleton) { 
                return cpSingleton; //new principalModule.PrincipalProviderService($resource, $rootScope)
            }])      .factory('sessionResourceFactory', ['$resource', function ($resource: ng.resource.IResourceService) {
                var retval = new sessionModule.SessionResourceFactory($resource);

                return retval.GetSessionResource();
            }])      .run(['currentPrincipal',
            function (ppsService: principalModule.PrincipalProviderService) {
                var promise = ppsService.GetResource();
                console.log('calling Principal service load');
                promise.then(function (result) {
                    console.log('principal loaded...');
                }, function (error) { console.log(error); });
        }]);
              

        console.log('building catalog...');
        self.buildCatalog(codeCamperApp);
        console.log('building Routes....');
        self.setupRouting(codeCamperApp);
        console.log('finishing bootstrap!');
        angular.bootstrap($(document), ['CarolinaCodeCamperApp']);
        //this.pps = new principalModule.PrincipalProviderService(res, rs);

    }

    private setupRouting = function (codeCamperApp: ng.IModule) {
        codeCamperApp.config(['$routeProvider', function ($routeProvider: ng.route.IRouteProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl: '/Template/CamperHome',
                    controller: 'camperHomeController'
                })
                .when('/Login', {
                    templateUrl: '/Account/Login',
                    controller: 'LoginController'
                })
            // @Html.ActionLink(User.Identity.Name, "Manage", "Account", routeValues: null, htmlAttributes: new { @class = "username", title = "Manage" })
                .when('/manage', {
                    templateUrl: '/Account/Manage'
                    , controller: null
                })
                .when('/sessionDetail/:id', {
                    templateUrl: '/Template/SessionDetail',
                    controller: 'sessionDetailController'
                })
                .otherwise({ redirectTo: '/home' });
        }]);
    }

    private buildCatalog = function (codeCamperApp: ng.IModule) {

        codeCamperApp.directive('ncgRequestVerificationToken', ['$http', function ($http: ng.IHttpService) {
            return function (scope: ng.IScope, element, attrs) {
                $http.defaults.headers.common['RequestVerificationToken'] = attrs.ncgRequestVerificationToken || "no reqeust verification token";
                scope.$on('login::principalChanged', function () {
                    $http.defaults.headers.common['RequestVerificationToken'] = undefined;
                    $http.get('/Home/GetVerificationToken', function (data) {
                        attrs.ncgRequestVerificationToken = data;
                        $http.defaults.headers.common['RequestVerificationToken'] = attrs.ncgRequestVerificationToken
                    });
                });
            }
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
        codeCamperApp.directive('sessionitem', function () { return controls.sessionControl.Directive(); });

    };

}

var bs = new BootStrapper();
bs.init();