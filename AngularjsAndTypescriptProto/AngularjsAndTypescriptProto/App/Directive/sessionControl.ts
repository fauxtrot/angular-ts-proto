///<reference path="..\..\Scripts\typings\angularjs\angular.d.ts" />
import userModule = require('../Controllers/UserModule');
import principalProvider = require('../Services/PrincipalProvider');
import sessionModule = require('../Controllers/SessionModule');


export class sessionControl {

    static $inject = ['$q']

    static Directive = function ($q: ng.IQService): ng.IDirective {
        return {
            restrict: 'E',
            scope:
            {
                session: '=',
                likeSession: '&',
                principal: '='
            },
            templateUrl: "/Template/_SessionPartial"
            , controller: sessionControlController
        }
    }
}

export interface sessionControlScope extends ng.IScope {
    session: sessionModule.SessionObject
    principal: any
    likeSession: Function;
    canLike: boolean;
    vm: sessionControlController
   
}

export class sessionControlController {
    static $inejct = ['$scope', '$element', '$attrs']
    session: sessionModule.SessionObject;
    principal: principalProvider.PrincipalProviderService;
    canLike: boolean;
    onUpdateSession: Function
    qService: ng.IQService

    constructor($scope: sessionControlScope, $element: ng.IRootElementService, $attrs: Attr, $q: ng.IQService) {
        $scope.vm = this;
        this.session = $scope.session;
        this.principal = $scope.principal;

        this.qService = $q;
        var self = this;
        this.checkLikeAbility().then(function (cl) {
            self.canLike = cl;
        });
        var self = this;
        this.onUpdateSession = function () {
            $scope.$emit('session::updateSession', { session: this.session });
        }
    }

    likeSession() {
        var self = this;
        this.session.$like().then(function () {
            self.onUpdateSession();
        });
        
    }


    checkLikeAbility(): ng.IPromise<boolean> {
        var sess = this.session;
        var prin = this.principal;
        var q = this.qService;
        return q.when(prin).then(function (prin) {
            for (var index in sess.LikedByUsers) {
                var ui = sess.LikedByUsers[index];
                if (prin.CurrentPrincipal.PrincipalType == principalProvider.PrincipalTypes.Anonymous || (ui.ProviderUserKey == prin.CurrentPrincipal.Id && ui.UserName == prin.CurrentPrincipal.Username)) {
                    return false;
                }
            }
            return true;
        });
        
    }
}