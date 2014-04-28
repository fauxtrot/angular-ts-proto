define(["require", "exports"], function(require, exports) {
    (function (PrincipalTypes) {
        PrincipalTypes[PrincipalTypes["Authenticated"] = 0] = "Authenticated";
        PrincipalTypes[PrincipalTypes["Anonymous"] = 1] = "Anonymous";
    })(exports.PrincipalTypes || (exports.PrincipalTypes = {}));
    var PrincipalTypes = exports.PrincipalTypes;

    var PrincipalProviderService = (function () {
        function PrincipalProviderService($resource) {
            this.resource = $resource;
        }
        Object.defineProperty(PrincipalProviderService, "CurrentPrincipal", {
            get: function () {
                return PrincipalProviderService._currentPrincipal;
            },
            enumerable: true,
            configurable: true
        });

        PrincipalProviderService.GetResource = function ($resource) {
            var service = $resource('/Account/CurrentPrincipal');
            return service.query().$promise.then(function (result) {
                PrincipalProviderService._currentPrincipal = result[0];
                return PrincipalProviderService._currentPrincipal;
            });
        };
        PrincipalProviderService.$inject = ['$resource'];

        PrincipalProviderService.Anonymous = { PrincipalType: 1 /* Anonymous */, Username: 'Anonymous' };
        return PrincipalProviderService;
    })();
    exports.PrincipalProviderService = PrincipalProviderService;
});
//# sourceMappingURL=PrincipalProvider.js.map
