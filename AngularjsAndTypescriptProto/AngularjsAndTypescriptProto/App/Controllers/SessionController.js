define(["require", "exports"], function(require, exports) {
    var SessionEditController = (function () {
        function SessionEditController($scope, session) {
            var _this = this;
            this.scope = $scope;
            this.scope.session = session;
            this.scope.saveSession = function () {
                _this.scope.$close($scope.session);
            };
        }
        SessionEditController.prototype.loadSession = function (sessionObject) {
            this.scope.session = sessionObject;
        };
        SessionEditController.$inject = ['$scope', 'session'];
        return SessionEditController;
    })();
    exports.SessionEditController = SessionEditController;

    var SessionController = (function () {
        function SessionController($scope, $resource, $modal) {
            var _this = this;
            this.addSessionModal = function () {
                var sess = new _this.sessionResource();
                var refresh = _this.refreshListFromServer;
                var config = {
                    templateUrl: '/Home/EditSessions',
                    controller: 'SessionEditController',
                    resolve: {
                        session: function () {
                            return sess;
                        }
                    }
                };
                var mod = _this.modal.open(config);
                mod.result.then(function (data) {
                    var session = data;
                    session.$secureSave(function () {
                        refresh();
                    });
                });
            };
            this.refreshListFromServer = function () {
                _this.scope.sessions = _this.sessionResource.query();
            };
            this.sessionResource = $resource('/api/Session/:id', { id: "@id" }, { secureSave: { method: 'POST', headers: { 'Content-Type': 'application/json' }, withCredentials: true } });
            this.scope = $scope;
            this.modal = $modal;
            this.refreshListFromServer();
            this.scope.addSessionModal = this.addSessionModal;
        }
        SessionController.$inject = ['$scope', '$resource', '$modal'];
        return SessionController;
    })();
    exports.SessionController = SessionController;
});
//# sourceMappingURL=SessionController.js.map
