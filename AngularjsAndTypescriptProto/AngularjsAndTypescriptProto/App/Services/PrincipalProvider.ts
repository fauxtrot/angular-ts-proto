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
    static $inject = ['$resource']

    static Anonymous  = { PrincipalType: PrincipalTypes.Anonymous, Username: 'Anonymous' };

    resource: ng.resource.IResourceService

    constructor($resource: ng.resource.IResourceService) {
        this.resource = $resource;
    }

    private static _currentPrincipal: IPrincipal;

    public static get CurrentPrincipal(): IPrincipal {
        return PrincipalProviderService._currentPrincipal;
    }

    public static GetResource($resource: ng.resource.IResourceService): ng.IPromise<IPrincipal> {
        var service = $resource<IPrincipal>('/Account/CurrentPrincipal');
        return service.query().$promise.then(function (result: IPrincipal[]) {
            PrincipalProviderService._currentPrincipal = result[0];
            return PrincipalProviderService._currentPrincipal;
        });
    }
}