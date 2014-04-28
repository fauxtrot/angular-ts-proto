import userModule = require('Controllers/UserModule');


export interface IEditScope extends ng.IScope {
    session: SessionObject;
    saveSession: Function;
    $close: Function;
    $dismiss: Function;
    resourceManager: ng.resource.IResourceClass<SessionObject>
    cancelModal: Function;
    vm: SessionEditController;
}

export class SessionEditController {
    static $inject = ['$scope', 'session']

    constructor($scope: IEditScope, session: SessionObject) {
        $scope.vm = this;
        $scope.session = session;
        
        $scope.saveSession = () => {
            $scope.$close($scope.session);
        }
        $scope.cancelModal = () => {
            $scope.$dismiss();
        }
    }
}


export interface SessionObject extends ng.resource.IResourceClass<SessionObject>//implements ng.resource.IResource<SessionObject>
{
    Name: string;
    SpeakerName: string;
    TrackName: string;
    SessionDateTime: Date;
    Description: string;
    LikedByUsers: Array<userModule.UserInfo>;

    $secureSave: Function;
    SessionDate: Date;
    SessionTime: Date;
    $like: Function;

}

export interface ISessionControllerScope extends ng.IScope {
    
    addSessionModal: Function;
    likeSession(session: SessionObject): void;
    vm: SessionController;

}

export class SessionController {
    
    static $inject = ['$scope', '$resource', '$modal', 'currentPrincipal']

    sessions: SessionObject[];
    //scope: ISessionControllerScope;
    modal: ng.ui.bootstrap.IModalService;
    sessionResource: ng.resource.IResourceClass<SessionObject>;
    cp: any;


    constructor($scope: ISessionControllerScope, $resource: ng.resource.IResourceService, $modal: ng.ui.bootstrap.IModalService, currentPrincipal: any) {

        $scope.vm = this;
        this.sessionResource = $resource<SessionObject>('/api/Session/:id', { id: "@id" },
            {
                secureSave: { method: 'POST', headers: { 'Content-Type': 'application/json' }, withCredentials: true }
                ,like: { method: 'POST', url: '/Home/LikeSession', headers: {'Content-Type': 'application/json' }, withCredentials: true }
            });
        this.modal = $modal;
        this.refreshListFromServer();
        
    }

    likeSession(session: SessionObject): void {
        session.$like();
    }

    addSessionModal = () => {
        var sess = new this.sessionResource();
        var p = this.cp;
        var refresh = this.refreshListFromServer;
        var self = this;
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
        var mod = this.modal.open(config);
        mod.result.then(function (data: SessionObject) {
            var session = data;
            session.SessionDateTime = session.SessionDate;
            session.SessionDateTime.setTime(session.SessionTime.getTime());
            
            session.$secureSave(function () {
                refresh();
            });


        });
    }

    refreshListFromServer = () => {
        this.sessions = this.sessionResource.query();
    };

    fudgeMinutes = function (date) {
        if (!date) {
            date = new Date();
        }

        var minutes = date.getMinutes();
        if (minutes == 0) {
            return date;
        }
        else if (minutes < 15) {
            date.setMinutes(15);
            return date;
        }
        else if (minutes > 15 && minutes < 30) {
            date.setMinutes(30);
            return date;
        }
        else if (minutes > 30 && minutes <= 45) {
            date.setMinutes(45);
            return date;
        }
        else {
            date.setMinutes(0);
            date.setHours(date.getHours() + 1);
            return date;
        }
    }
}

