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
    timeout: ng.ITimeoutService
    window: ng.IWindowService
    scope: ng.IScope

    static $inject = ['$scope', '$rootScope', '$http', '$location', '$route', '$timeout', '$window']

    constructor($scope: LoginScope, $rootScope: ng.IRootScopeService, $http: ng.IHttpService, $location: ng.ILocationService, $timeout: ng.ITimeoutService, $window: ng.IWindowService) {
        $scope.vm = this;
        this.http = $http;
        this.rootScope = $rootScope;
        this.location = $location;
        this.timeout = $timeout;
        this.window = $window;
        this.scope = $scope;
    }

    submitLogin = () => {
        var promise = this.http.post('/Account/Login?returnUrl=' + '%23%2Fhome', { UserName: this.UserName, Password: this.Password, RememberMe: this.RememberMe }, { withCredentials: true, headers: { 'Content-Type': 'application/json' } });
        var self = this;
        promise.success(function (data, status, headers, config) {
            if (data.returnUrl) {
                self.location.path(data.returnUrl)
                self.scope.$emit('login::principalChanged', null);              
            }
            else if (data.error) {
                console.log(data.error);
            }

        });
        return true;
    }
}


export class LoginPartialController {
    static $inject = ['$scope', '$rootScope','$sanitize', '$sce', '$http']
    http: ng.IHttpService;
    sce: any;
    sanitize: ng.sanitize.ISanitizeService;
    self: any;

    constructor($scope: ILoginPartialScope, $rootScope: ng.IRootScopeService, $sanitize: ng.sanitize.ISanitizeService, $sce: any, $http: ng.IHttpService) {
        $scope.vm = this;

        this.http = $http;
        this.sce = $sce;
        this.refreshData();
        var ref = this;
        $rootScope.$on('login::principalChanged', function () {
            ref.refreshData();
        });
    }

    refreshData = function () {
        var self = this;
        this.http.get('/Template/_LoginPartial').success(function (data) {
            self.template = self.sce.trustAsHtml(data);
        })
    }
}