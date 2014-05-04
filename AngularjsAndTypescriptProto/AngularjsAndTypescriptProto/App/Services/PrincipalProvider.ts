///<reference path="../../Scripts/typings/angularjs/angular-resource.d.ts"/>

export enum PrincipalTypes {
    Authenticated,
    Anonymous
}

export interface IPrincipal {
    Username: string
    PrincipalType: PrincipalTypes
    Id: number
} 

export class PrincipalProviderService {
    static $inject = ['$resource', '$rootScope']
    static Anonymous  = { PrincipalType: PrincipalTypes.Anonymous, Username: 'Anonymous', Id : -1 };
    private static _instance: PrincipalProviderService = null;
    resource: ng.resource.IResourceService
    rootScope: ng.IRootScopeService

    constructor($resource: ng.resource.IResourceService, $rootScope: ng.IRootScopeService) {
        this.resource = $resource;
        this.rootScope = $rootScope;
        var self = this;
        $rootScope.$on('login::principalChanged', function () {
            self.GetResource();
            console.log('new Principal');
        });
    }

    public static getInstance($resource: ng.resource.IResourceService, $rootScope: ng.IRootScopeService): PrincipalProviderService {
        if(PrincipalProviderService._instance == null)
            PrincipalProviderService._instance = new PrincipalProviderService($resource, $rootScope);
        return PrincipalProviderService._instance;
    }

    private _currentPrincipal: IPrincipal;

    public get CurrentPrincipal(): IPrincipal {
        return this._currentPrincipal;
    }

    public GetResource(): ng.IPromise<IPrincipal> {
        var self = this;
        var service = this.resource<IPrincipal>('/Account/CurrentPrincipal');
        return service.query().$promise.then(function (result: IPrincipal[]) {
            if (result[0] == null)
                self._currentPrincipal = PrincipalProviderService.Anonymous;
            else
                self._currentPrincipal = result[0];
            return self._currentPrincipal;
        });
        
    }
}