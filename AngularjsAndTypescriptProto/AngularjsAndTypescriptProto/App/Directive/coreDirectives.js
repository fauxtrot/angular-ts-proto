///<reference path="..\Model\TypeLite1.d.ts" />
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

    var LikableDirective = (function () {
        function LikableDirective() {
        }
        LikableDirective.$inject = ['$http', 'currentPrincipal'];

        LikableDirective.Directive = function ($http, cp) {
            return {
                link: function (scope, element, attrs) {
                    var oId = scope.objectid;
                    var self = this;
                    scope.like = function () {
                        scope.isBusy = true;
                        $http.put('/api/Like/' + oId, { withCredentials: true }).then(function (result) {
                            $http.get('/api/Like/getLikes/' + oId, { withCredentials: true }).then(function (result) {
                                scope.isBusy = false;
                                scope.LikedBy = result.data;
                            });
                        });
                    };
                    $http.get('/api/Like/getLikes/' + oId, { withCredentials: true }).then(function (result) {
                        scope.LikedBy = result.data;
                    });
                },
                scope: {
                    objectid: '='
                },
                templateUrl: "/Template/_LikePartial",
                transclude: true
            };
        };
        return LikableDirective;
    })();
    exports.LikableDirective = LikableDirective;
});
//# sourceMappingURL=coreDirectives.js.map
