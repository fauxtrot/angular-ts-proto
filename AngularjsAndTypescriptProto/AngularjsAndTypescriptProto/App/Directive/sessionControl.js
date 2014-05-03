define(["require", "exports", '../Services/PrincipalProvider'], function(require, exports, principalProvider) {
    var sessionControl = (function () {
        function sessionControl() {
        }
        sessionControl.Directive = function () {
            return {
                restrict: 'E',
                scope: {
                    session: '=',
                    likeSession: '&',
                    principal: '='
                },
                templateUrl: "/Template/_SessionPartial",
                controller: sessionControlController
            };
        };
        return sessionControl;
    })();
    exports.sessionControl = sessionControl;

    var sessionControlController = (function () {
        function sessionControlController($scope) {
            this.checkLikeAbility = function () {
                var sess = this.session;
                var prin = this.principal;
                for (var index in sess.LikedByUsers) {
                    var ui = sess.LikedByUsers[index];
                    if (prin.CurrentPrincipal.PrincipalType == 1 /* Anonymous */ || (ui.ProviderUserKey == prin.CurrentPrincipal.Id && ui.Username == prin.CurrentPrincipal.Username)) {
                        return false;
                    }
                }
                return true;
            };
            $scope.vm = this;
            this.session = $scope.session;
            this.principal = $scope.principal;

            this.canLike = this.checkLikeAbility();
            var self = this;
            this.onUpdateSession = function () {
                $scope.$emit('session::updateSession', { session: this.session });
            };
        }
        sessionControlController.prototype.likeSession = function () {
            var self = this;
            this.session.$like().then(function () {
                self.onUpdateSession();
            });
        };
        sessionControlController.$inejct = ['$scope', '$element', '$attrs', 'currentPrincipal', '$location'];
        return sessionControlController;
    })();
    exports.sessionControlController = sessionControlController;
});
//# sourceMappingURL=sessionControl.js.map
