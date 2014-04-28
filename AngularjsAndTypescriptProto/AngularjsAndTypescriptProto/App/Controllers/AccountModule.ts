//Scope Defs
export interface LoginScope extends ng.IScope {
    vm: LoginController
}

export interface ILoginPartialScope extends ng.IScope {
    template: string;
    refreshData: Function;
    vm: LoginPartialController;
}
//end scope defs

//controller defs
export class LoginController {

    UserName: string;
    Password: string
    RememberMe: boolean;
    http: ng.IHttpService;
    rootScope: ng.IRootScopeService;
    location: ng.ILocationService;


    static $inject = ['$scope', '$rootScope', '$http', '$location']

    constructor($scope: LoginScope, $rootScope: ng.IRootScopeService, $http: ng.IHttpService, $location: ng.ILocationService) {
        $scope.vm = this;
        this.http = $http;
        this.rootScope = $rootScope;
        this.location = $location;
    }

    submitLogin = () => {
        var promise = this.http.post('/Account/Login?returnUrl=' + '%23%2Fhome', { UserName: this.UserName, Password: this.Password, RememberMe: this.RememberMe }, { withCredentials: true, headers: { 'Content-Type': 'application/json' } });
        var self = this;
        promise.success(function (data, status, headers, config) {
            if (data.returnUrl) {
                self.location.path(data.returnUrl)
                    self.rootScope.$broadcast('login::principalChanged', null);
            }
            else if (data.error) {
                console.log(data.error);
            }

        });
        return true;
    }
}


export class LoginPartialController {
    static $inject = ['$scope', '$sanitize', '$sce', '$http']
    http: ng.IHttpService;
    sce: any;
    sanitize: ng.sanitize.ISanitizeService;
    self: any;

    constructor($scope: ILoginPartialScope, $sanitize: ng.sanitize.ISanitizeService, $sce: any, $http: ng.IHttpService) {
        $scope.vm = this;

        this.http = $http;
        this.sce = $sce;
        this.refreshData();
        var ref = this;
        $scope.$on('login::principalChanged', function () {
            ref.refreshData();
        });
    }

    refreshData = function () {
        var self = this;
        this.http.get('/Home/_LoginPartial').success(function (data) {
            self.template = self.sce.trustAsHtml(data);
        })
    }
}