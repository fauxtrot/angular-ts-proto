
import commentModule = require('Controllers/commentModule');

export interface ICommentDirectiveScope extends ng.IScope {
    $parent: any;
    comment: commentModule.CommentObject
    submitComment: Function
}

export class CommentDirective {
    static DirectiveProvider($http: ng.IHttpService): ng.IDirective {
       return {
           link: function (scope: ICommentDirectiveScope, element, attrs: ng.IAttributes, commentResourceFactory: ng.resource.IResourceClass<commentModule.CommentObject>) {
               var sessId = scope.$parent.$parent.$parent.vm.session.Id;
               scope.submitComment = function () {
                   $http.post('/api/Comment/On/' + sessId, scope.comment, { withCredentials: true }).then(function (result) {
                       scope.comment = result.data;
                   });
               }
           }
           , scope: {
               comment: '=',
               nodeid: '='
           },
           templateUrl: "/Template/_CommentPartial"
       }
    }
} 