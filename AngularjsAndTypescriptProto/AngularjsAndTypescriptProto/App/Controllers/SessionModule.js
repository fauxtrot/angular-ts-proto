define(["require", "exports"], function(require, exports) {
    var SessionDetailController = (function () {
        function SessionDetailController($scope, $routeParams, srf) {
            $scope.vm = this;
            var id = $routeParams.id;
            this.session = srf.get({ id: id });
        }
        SessionDetailController.$inject = ['$scope', '$routeParams', 'sessionResourceFactory'];
        return SessionDetailController;
    })();
    exports.SessionDetailController = SessionDetailController;

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

    var SessionResourceFactory = (function () {
        function SessionResourceFactory($resource) {
            this._resource = $resource;
        }
        SessionResourceFactory.prototype.GetSessionResource = function () {
            return this._resource('/api/Session/:id', { id: "@id" }, {
                secureSave: { method: 'POST', headers: { 'Content-Type': 'application/json' }, withCredentials: true },
                like: { method: 'POST', url: '/Home/LikeSession', headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            });
        };
        SessionResourceFactory.$inject = ['$resource'];
        return SessionResourceFactory;
    })();
    exports.SessionResourceFactory = SessionResourceFactory;

    var SessionController = (function () {
        function SessionController($scope, sessionResourceFactory, $modal, currentPrincipal) {
            var _this = this;
            //likeSession(session: SessionObject): void {
            //    session.$like();
            //}
            this.addSessionModal = function () {
                var sess = new _this.sessionResource();
                var p = _this.cp;
                var refresh = _this.refreshListFromServer;
                var local = _this;
                var config = {
                    templateUrl: '/Template/EditSessions',
                    controller: 'SessionEditController',
                    resolve: {
                        session: function () {
                            sess.SessionTime = local.fudgeMinutes(sess.SessionTime);
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
            this.sessionResource = sessionResourceFactory;
            this.modal = $modal;
            this.refreshListFromServer();
            this.cp = currentPrincipal;
            var self = this;

            $scope.$on('session::updateSession', function (session) {
                console.log(session);
                self.refreshListFromServer();
            });
        }
        SessionController.$inject = ['$scope', 'sessionResourceFactory', '$modal', 'currentPrincipal'];
        return SessionController;
    })();
    exports.SessionController = SessionController;
});
//# sourceMappingURL=SessionModule.js.map
