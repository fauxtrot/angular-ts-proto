define(["require", "exports"], function(require, exports) {
    var SessionEditController = (function () {
        function SessionEditController($scope, session) {
            $scope.vm = this;
            $scope.session = session;

            $scope.saveSession = function () {
                $scope.$close($scope.session);
            };
            $scope.cancelModal = function () {
                $scope.$dismiss();
            };
        }
        SessionEditController.$inject = ['$scope', 'session'];
        return SessionEditController;
    })();
    exports.SessionEditController = SessionEditController;

    var SessionController = (function () {
        function SessionController($scope, $resource, $modal, currentPrincipal) {
            var _this = this;
            this.addSessionModal = function () {
                var sess = new _this.sessionResource();
                var p = _this.cp;
                var refresh = _this.refreshListFromServer;
                var self = _this;
                var config = {
                    templateUrl: '/Home/EditSessions',
                    controller: 'SessionEditController',
                    resolve: {
                        session: function () {
                            sess.SessionTime = self.fudgeMinutes(sess.SessionTime);
                            return sess;
                        }
                    }
                };
                var mod = _this.modal.open(config);
                mod.result.then(function (data) {
                    var session = data;
                    session.SessionDateTime = session.SessionDate;
                    session.SessionDateTime.setTime(session.SessionTime.getTime());

                    session.$secureSave(function () {
                        refresh();
                    });
                });
            };
            this.refreshListFromServer = function () {
                _this.sessions = _this.sessionResource.query();
            };
            this.fudgeMinutes = function (date) {
                if (!date) {
                    date = new Date();
                }

                var minutes = date.getMinutes();
                if (minutes == 0) {
                    return date;
                } else if (minutes < 15) {
                    date.setMinutes(15);
                    return date;
                } else if (minutes > 15 && minutes < 30) {
                    date.setMinutes(30);
                    return date;
                } else if (minutes > 30 && minutes <= 45) {
                    date.setMinutes(45);
                    return date;
                } else {
                    date.setMinutes(0);
                    date.setHours(date.getHours() + 1);
                    return date;
                }
            };
            $scope.vm = this;
            this.sessionResource = $resource('/api/Session/:id', { id: "@id" }, {
                secureSave: { method: 'POST', headers: { 'Content-Type': 'application/json' }, withCredentials: true },
                like: { method: 'POST', url: '/Home/LikeSession', headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            });
            this.modal = $modal;
            this.refreshListFromServer();
        }
        SessionController.prototype.likeSession = function (session) {
            session.$like();
        };
        SessionController.$inject = ['$scope', '$resource', '$modal', 'currentPrincipal'];
        return SessionController;
    })();
    exports.SessionController = SessionController;
});
//# sourceMappingURL=SessionModule.js.map
