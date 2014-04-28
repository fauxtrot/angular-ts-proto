export interface ITestControllerScope extends ng.IScope {
    doAntiForgeryRequests: Function;
} 

export class TestController {

    static $inject = ['$scope', '$http']

    private scope: ITestControllerScope;

    constructor($scope: ITestControllerScope, $http: any) {
        this.scope = $scope;

        this.scope.doAntiForgeryRequests = () => {
            var token = window['AfToken'];
            $http({
                withCredentials: true, url: '/home/SuperSecret', method: 'POST'
            }).success(this.successCallback).error(function (err) {
                console.log(err);
            });
        };
    }

    successCallback = function (data: any) {
        if (data.result)
        {
            console.log(data.result);
        }
    }
}