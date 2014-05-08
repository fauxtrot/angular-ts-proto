///<reference path="..\Model\TypeLite1.d.ts" />

import principalProvider = require('Services/PrincipalProvider')

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

export interface LikableDirectiveScope extends ng.IScope {
    like(): void
    objectid: number
    isBusy: boolean
    LikedBy: Array<DataAccess.Model.UserInfo>
}

export class LikableDirective {
    static $inject = ['$http', 'currentPrincipal']

    static Directive = function ($http: ng.IHttpService, cp: principalProvider.PrincipalProviderService): ng.IDirective {
        return {
            link: function (scope: LikableDirectiveScope, element, attrs) {
                var oId = scope.objectid;
                var self = this;
                scope.like = function () {
                    scope.isBusy = true;
                    $http.put('/api/Like/' + oId, { withCredentials: true }).then(function (result) {
                        $http.get('/api/Like/getLikes/' + oId, { withCredentials: true }).then(function (result: any) {
                            scope.isBusy = false;
                            scope.LikedBy = result.data;
                        });
                    });
                }
                    $http.get('/api/Like/getLikes/' + oId, { withCredentials: true }).then(function (result: any) {
                        scope.LikedBy = result.data;
                    });
               
                
            },
            scope: {
                objectid: '='
            }
            , templateUrl: "/Template/_LikePartial"
            , transclude: true
        }
    }
}