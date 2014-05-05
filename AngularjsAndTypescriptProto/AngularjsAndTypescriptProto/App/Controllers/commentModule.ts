///<reference path="SessionModule.ts" />

import userModule = require('Controllers/UserModule');
import sessionModule = require('Controllers/SessionModule');

export interface CommentObject extends ng.resource.IResourceClass<CommentObject>{
    Subject: string
    Body: string
    MadeBy: userModule.UserInfo
    LikedBy: Array<userModule.UserInfo>
    Id: number
    //generated functions from resource call.
    $like: Function
    $save: Function
}

export interface ICommentControllerScope {
    vm: CommentController;
    $parent: sessionModule.ISessionDetailScope;
}

export class CommentController {
    static $inject = ['$scope', 'commentResourceFactory']

    comments: Array<CommentObject>;
    crf: ng.resource.IResourceClass<CommentObject>;

    isBusy: boolean;
    constructor($scope: ICommentControllerScope, crf: ng.resource.IResourceClass<CommentObject>) {
        $scope.vm = this;
        this.crf = crf;
        this.isBusy = true;
        this.getComments($scope.$parent.id);
    }

    getComments(sessionId:number): void {
        this.comments = this.crf.query({ id: sessionId }); 
    }


} 

export class CommentResourceFactory {

    static $inject = ['$resource']

    private _resource: ng.resource.IResourceService;

    constructor($resource: ng.resource.IResourceService) {
        this._resource = $resource;
    }


    public GetCommentResourceService(): ng.resource.IResourceClass<CommentObject> {
        return this._resource<CommentObject>('/api/Comment/:id', { id: "@id" },
            {
                save : { method: 'POST', headers: { 'Content-Type': 'application/json' }, withCredentials: true }
                , like: { method: 'POST', url: '/Home/LikeComment', headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            });
    }
}