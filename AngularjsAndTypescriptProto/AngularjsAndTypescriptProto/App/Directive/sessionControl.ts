
import userModule = require('../Controllers/UserModule');
import principalProvider = require('../Services/PrincipalProvider');
import sessionModule = require('../Controllers/SessionModule');


export class sessionControl {
    static Directive = function (): ng.IDirective {
        return {
            restrict: 'E',
            scope:
            {
                session: '=',
                likeSession: '&',
                principal: '&'
            },
            templateUrl: "/Home/_SessionPartial"
            , controller: sessionControlController
        }
    }
}

export interface sessionControlScope extends ng.IScope {
    session: sessionModule.SessionObject
    principal: principalProvider.IPrincipal
    likeSession: Function;
    canLike:boolean;
}

export class sessionControlController {
    static $inejct = ['$scope', '$element', '$attrs', 'currentPrincipal', '$location']

    constructor($scope: sessionControlScope) {
        $scope.likeSession = function () {
            $scope.session.$like();
        }
        $scope.canLike = this.checkLikeAbility($scope);

        $scope.$on('login::principalChanged', function () {
            $scope.canLike = this.checkLikeAbility($scope);
        });
    }

    checkLikeAbility = function (scope: sessionControlScope): boolean {
        var sess = scope.session;
        var prin = scope.principal;
        sess.LikedByUsers.forEach(function (ui: userModule.UserInfo) {
            if (prin.PrincipalType == principalProvider.PrincipalTypes.Anonymous || (ui.ProviderKey == prin.Id && ui.UserName == prin.Username)) {
                return false;
            }
        });

        return true;
    }

}