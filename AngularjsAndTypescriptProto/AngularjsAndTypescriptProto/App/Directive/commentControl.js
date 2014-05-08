define(["require", "exports"], function(require, exports) {
    var CommentDirective = (function () {
        function CommentDirective() {
        }
        CommentDirective.DirectiveProvider = function ($http) {
            return {
                link: function (scope, element, attrs, commentResourceFactory) {
                    var sessId = scope.$parent.$parent.$parent.vm.session.Id;
                    scope.submitComment = function () {
                        $http.post('/api/Comment/On/' + sessId, scope.comment, { withCredentials: true }).then(function (result) {
                            scope.comment = result.data;
                        });
                    };
                },
                scope: {
                    comment: '=',
                    nodeid: '='
                },
                templateUrl: "/Template/_CommentPartial"
            };
        };
        return CommentDirective;
    })();
    exports.CommentDirective = CommentDirective;
});
//# sourceMappingURL=commentControl.js.map
