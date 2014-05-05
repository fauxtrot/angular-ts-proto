define(["require", "exports"], function(require, exports) {
    var DynamicContent = (function () {
        function DynamicContent() {
        }
        DynamicContent.$inject = ['$http', '$compile'];

        DynamicContent.Directive = function ($http, $compile) {
            return {
                link: function (scope, element, attrs) {
                    if (attrs.events) {
                        var events = attrs.events.split(" ");
                        for (var index in events) {
                            var evt = events[index];
                            scope.$on(evt, function () {
                                $http.get(attrs.templatehome + attrs.ngDynamicContent, { withCredentials: true }).then(function (result) {
                                    element.replaceWith($compile(result.data)(scope));
                                });
                            });
                        }
                    }
                    $http.get(attrs.templatehome + attrs.ngDynamicContent, { withCredentials: true }).then(function (result) {
                        element.replaceWith($compile(result.data)(scope));
                    });
                }
            };
        };
        return DynamicContent;
    })();
    exports.DynamicContent = DynamicContent;
});
//# sourceMappingURL=coreDirectives.js.map
