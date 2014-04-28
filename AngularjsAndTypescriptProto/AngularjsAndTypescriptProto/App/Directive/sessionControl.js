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
                    principal: '&'
                },
                templateUrl: "/Home/_SessionPartial",
                controller: sessionControlController
            };
        };
        return sessionControl;
    })();
    exports.sessionControl = sessionControl;

    var sessionControlController = (function () {
        function sessionControlController($scope) {
            this.checkLikeAbility = function (scope) {
                var sess = scope.session;
                var prin = scope.principal;
                sess.LikedByUsers.forEach(function (ui) {
                    if (prin.PrincipalType == 1 /* Anonymous */ || (ui.ProviderKey == prin.Id && ui.UserName == prin.Username)) {
                        return false;
                    }
                });

                return true;
            };
            $scope.likeSession = function () {
                $scope.session.$like();
            };
            $scope.canLike = this.checkLikeAbility($scope);

            $scope.$on('login::principalChanged', function () {
                $scope.canLike = this.checkLikeAbility($scope);
            });
        }
        sessionControlController.$inejct = ['$scope', '$element', '$attrs', 'currentPrincipal', '$location'];
        return sessionControlController;
    })();
    exports.sessionControlController = sessionControlController;
});
//# sourceMappingURL=sessionControl.js.map
