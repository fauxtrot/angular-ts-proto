///<reference path="../../Scripts/typings/angularjs/angular-resource.d.ts"/>

import signUp = require('Controllers/SignUpModule');

export class SignupValidationService {

    static $inject = ['$resource', '$http'];

    constructor($resource: ng.resource.IResourceService, $http: ng.IHttpService) {
        this.$resource = $resource;
        this.$http = $http;
    }

    $resource: ng.resource.IResourceService;
    $http: ng.IHttpService;

    public IsEmailUserAvailable = (emailUserName: string):ng.IHttpPromise<boolean> => {
        return this.$http.get('/Signup/QueryEmailUsernameAvailable?emailUserName=' + emailUserName);
    };

} 