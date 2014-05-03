import userModule = require('Controllers/UserModule')

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
    
}

export class CommentController {
    static $inject = ['$scope']

    constructor($scope: ICommentControllerScope) {
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