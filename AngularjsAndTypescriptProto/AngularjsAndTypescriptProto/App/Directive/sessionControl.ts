
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
                principal: '='
            },
            templateUrl: "/Template/_SessionPartial"
            , controller: sessionControlController
        }
    }
}

export interface sessionControlScope extends ng.IScope {
    session: sessionModule.SessionObject
    principal: principalProvider.IPrincipal
    likeSession: Function;
    canLike: boolean;
    vm: sessionControlController
}

export class sessionControlController {
    static $inejct = ['$scope', '$element', '$attrs', 'currentPrincipal', '$location']
    session: sessionModule.SessionObject;
    principal: principalProvider.IPrincipal;
    canLike: boolean;
    onUpdateSession: Function

    constructor($scope: sessionControlScope) {
        $scope.vm = this;
        this.session = $scope.session;
        this.principal = $scope.principal;

        this.canLike = this.checkLikeAbility();
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


    checkLikeAbility = function (): boolean {
        var sess = this.session;
        var prin = this.principal;
        for (var index in sess.LikedByUsers) {
            var ui = sess.LikedByUsers[index];
            if (prin.CurrentPrincipal.PrincipalType == principalProvider.PrincipalTypes.Anonymous || (ui.ProviderUserKey == prin.CurrentPrincipal.Id && ui.Username == prin.CurrentPrincipal.Username)) {
                return false;
            }
        }
        return true;
    }
}