///<reference path="../../Scripts/typings/angularjs/angular-bootstrap-ui.d.ts" />

export interface ICamperHomeScope extends ng.IScope {
    

}

export class CamperHomeController {
    static $inject = ['$scope', '$modal']
    constructor($scope: ICamperHomeScope, $modal: ng.ui.bootstrap.IModalService) {
      
    }
}   