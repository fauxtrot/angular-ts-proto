import sessionModule = require('Controllers/SessionModule');

export interface CommentObject extends ng.resource.IResourceClass<CommentObject>{

    //generated functions from resource call.
    isEditing: boolean
    $like: Function
    //$save: Function
    $commentOn: Function
}

export interface ICommentControllerScope extends ng.IScope{
    vm: CommentController;
    $parent: sessionModule.ISessionDetailScope;
}

export class CommentController {
    static $inject = ['$scope', 'commentResourceFactory']

    comments: Array<any>;
    crf:  CommentObject;

    isBusy: boolean;
    constructor($scope: ICommentControllerScope, crf: CommentObject) {
        $scope.vm = this;
        $scope.$watch('vm.comments', function (newVal) {
            console.log(newVal);
        });
        this.crf = crf;
        this.isBusy = true;
        this.getComments($scope.$parent.id);
    }

    getComments(sessionId:number): void {
        this.comments = this.crf.query({ id: sessionId }); 
    }

    addComment() {
        var cmt = new this.crf();
        cmt.isEditing = true;
        this.comments.push(cmt);

    }
} 

export class CommentResourceFactory {

    static $inject = ['$resource']

    private _resource: ng.resource.IResourceService;

    constructor($resource: ng.resource.IResourceService) {
        this._resource = $resource;
    }


    public GetCommentResourceService(): ng.resource.IResourceClass<DataAccess.Model.Comment> {
        return this._resource<DataAccess.Model.Comment>('/api/Comment/:id', { id: "@id" },
            {
                //save: { method: 'POST', headers: { 'Content-Type': 'application/json' }, withCredentials: true },
                commentOn: { url: '/api/Comment/On/', params: { nodeId: '@nodeId' }, method: 'POST', headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            });
    }
}