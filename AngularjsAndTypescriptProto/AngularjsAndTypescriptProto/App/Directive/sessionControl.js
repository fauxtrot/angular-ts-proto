define(["require", "exports", '../Services/PrincipalProvider'], function(require, exports, principalProvider) {
    var sessionControl = (function () {
        function sessionControl() {
        }
        sessionControl.$inject = ['$q'];

        sessionControl.Directive = function ($q) {
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
        function sessionControlController($scope, $element, $attrs, $q) {
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
            };
        }
        sessionControlController.prototype.likeSession = function () {
            var self = this;
            this.session.$like().then(function () {
                self.onUpdateSession();
            });
        };

        sessionControlController.prototype.checkLikeAbility = function () {
            var sess = this.session;

            //var _prin = this.principal;
            var q = this.qService;

            return q.when(this.principal.CurrentPrincipal).then(function (prin) {
                for (var index in sess.LikedByUsers) {
                    var ui = sess.LikedByUsers[index];
                    if (prin.PrincipalType == 1 /* Anonymous */ || (ui.ProviderUserKey == prin.Id && ui.Username == prin.Username)) {
                        return false;
                    }
                }
                return true;
            });
        };
        sessionControlController.$inejct = ['$scope', '$element', '$attrs'];
        return sessionControlController;
    })();
    exports.sessionControlController = sessionControlController;
});
//# sourceMappingURL=sessionControl.js.map
