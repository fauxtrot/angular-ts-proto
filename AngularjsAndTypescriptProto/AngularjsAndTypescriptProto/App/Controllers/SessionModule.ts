///<reference path="../Model/TypeLite1.d.ts" />


export interface ISessionDetailScope extends ng.IScope {
    vm: SessionDetailController
    id: number
}

export interface ISessionDetailRouteParams extends ng.route.IRouteParamsService {
    id: number;
}

export class SessionDetailController {

    static $inject = ['$scope', '$routeParams', 'sessionResourceFactory']

    session: SessionObject
    isBusy: boolean;

    constructor($scope: ISessionDetailScope, $routeParams: ISessionDetailRouteParams, srf: ng.resource.IResourceClass<SessionObject>) {
        $scope.vm = this;
        var id = $routeParams.id
        $scope.id = id;
        this.session = srf.get({ id: id });
    }
}

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

export class SessionResourceFactory {
    static $inject = ['$resource']

    private _resource: ng.resource.IResourceService;


    constructor($resource: ng.resource.IResourceService) {
        this._resource = $resource;
    }

    public GetSessionResource(): ng.resource.IResourceClass<SessionObject> {
        return this._resource<SessionObject>('/api/Session/:id', { id: "@id" },
            {
                secureSave: { method: 'POST', headers: { 'Content-Type': 'application/json' }, withCredentials: true }
                , like: { method: 'POST', url: '/Home/LikeSession', headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            });
    }
}


export interface SessionObject extends ng.resource.IResourceClass<SessionObject>//implements ng.resource.IResource<SessionObject>
{
    Name: string;
    SpeakerName: string;
    TrackName: string;
    SessionDateTime: Date;
    Description: string;
    LikedByUsers: Array<DataAccess.Model.UserInfo>;

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
    
    static $inject = ['$scope', 'sessionResourceFactory', '$modal', 'currentPrincipal']

    sessions: SessionObject[];
    //scope: ISessionControllerScope;
    modal: ng.ui.bootstrap.IModalService;
    sessionResource: ng.resource.IResourceClass<SessionObject>;
    cp: any;


    constructor($scope: ISessionControllerScope, sessionResourceFactory: ng.resource.IResourceClass<SessionObject>, $modal: ng.ui.bootstrap.IModalService, currentPrincipal: any) {

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

    addSessionModal = () => {
        var sess = new this.sessionResource();
        var p = this.cp;
        var refresh = this.refreshListFromServer;
        var local = this;
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

