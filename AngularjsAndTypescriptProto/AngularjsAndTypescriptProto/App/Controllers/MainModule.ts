
    export interface IMainControllerScope extends ng.IScope {
        isBusy: boolean
        activeViewPath: string
        isActive(viewLoaction: string): boolean
        history: string[]
    }


    export class MainController {

    static $inject = ['$scope', '$rootScope', '$location', '$route']

        constructor(public $scope: IMainControllerScope, $rootScope: ng.IRootScopeService, $location: ng.ILocationService, $route: ng.route.IRouteService) {
            $scope.history = [];
            $scope.$on("$routeChangeSuccess", function (e, current, previous) {
                $scope.activeViewPath = $location.path();
                if (previous) {
                    $scope.history.push(previous);
                }
            });

            $rootScope.$on('$global:ClientBusy', () => {
                $scope.isBusy = true;
            });

            $rootScope.$on('$global:ClientFree', () => {
                $scope.isBusy = false;
            });

            $scope.isActive = (viewLocation) => viewLocation === $location.path();
            $scope.isBusy = false;
        }



    }
