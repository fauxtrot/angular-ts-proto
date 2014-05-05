export class DynamicContent {
    static $inject = ['$http', '$compile']
    
    static Directive = function ($http: ng.IHttpService, $compile: ng.ICompileService) {
        return {
            link: function (scope: ng.IScope, element, attrs) {
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
        }
    }
} 