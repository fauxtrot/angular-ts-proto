define(["require", "exports"], function(require, exports) {
    var CommentController = (function () {
        function CommentController($scope) {
        }
        CommentController.$inject = ['$scope'];
        return CommentController;
    })();
    exports.CommentController = CommentController;

    var CommentResourceFactory = (function () {
        function CommentResourceFactory($resource) {
            this._resource = $resource;
        }
        CommentResourceFactory.prototype.GetCommentResourceService = function () {
            return this._resource('/api/Comment/:id', { id: "@id" }, {
                save: { method: 'POST', headers: { 'Content-Type': 'application/json' }, withCredentials: true },
                like: { method: 'POST', url: '/Home/LikeComment', headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            });
        };
        CommentResourceFactory.$inject = ['$resource'];
        return CommentResourceFactory;
    })();
    exports.CommentResourceFactory = CommentResourceFactory;
});
//# sourceMappingURL=commentModule.js.map
