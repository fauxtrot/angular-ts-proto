///<reference path="../../Scripts/typings/angularjs/angular-resource.d.ts"/>
define(["require", "exports"], function(require, exports) {
    (function (PrincipalTypes) {
        PrincipalTypes[PrincipalTypes["Authenticated"] = 0] = "Authenticated";
        PrincipalTypes[PrincipalTypes["Anonymous"] = 1] = "Anonymous";
    })(exports.PrincipalTypes || (exports.PrincipalTypes = {}));
    var PrincipalTypes = exports.PrincipalTypes;

    var PrincipalProviderService = (function () {
        function PrincipalProviderService($resource, $rootScope) {
            this.resource = $resource;
            this.rootScope = $rootScope;
            var self = this;
            $rootScope.$on('login::principalChanged', function () {
                self.GetResource();
                console.log('new Principal');
            });
        }
        PrincipalProviderService.getInstance = function ($resource, $rootScope) {
            if (PrincipalProviderService._instance == null) {
                PrincipalProviderService._instance = new PrincipalProviderService($resource, $rootScope);
                PrincipalProviderService._instance._currentPrincipal = PrincipalProviderService._instance.GetResource();
                PrincipalProviderService._instance._currentPrincipal.then(function (val) {
                    PrincipalProviderService._instance._currentPrincipal = val;
                });
            }
            return PrincipalProviderService._instance;
        };

        Object.defineProperty(PrincipalProviderService.prototype, "CurrentPrincipal", {
            get: function () {
                return this._currentPrincipal;
            },
            enumerable: true,
            configurable: true
        });

        PrincipalProviderService.prototype.GetResource = function () {
            var self = this;
            console.log('loading Principal');
            var service = this.resource('/Account/CurrentPrincipal');
            return service.query().$promise.then(function (result) {
                console.log('principal loaded');
                if (result[0] == null)
                    return PrincipalProviderService.Anonymous;
                else
                    return result[0];
                return self._currentPrincipal;
            });
        };
        PrincipalProviderService.$inject = ['$resource', '$rootScope'];
        PrincipalProviderService.Anonymous = { PrincipalType: 1 /* Anonymous */, Username: 'Anonymous', Id: -1 };
        PrincipalProviderService._instance = null;
        return PrincipalProviderService;
    })();
    exports.PrincipalProviderService = PrincipalProviderService;
});
//# sourceMappingURL=PrincipalProvider.js.map
