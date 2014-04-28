define(["require", "exports"], function(require, exports) {
    var LoginPartialDirective = (function () {
        function LoginPartialDirective($scope) {
            var directive = {};
            directive.priority = 99;
            directive.restrict = 'E';
            directive.scope = {};
            directive.replace = true;
            directive.template = "/Home/_LoginPartial";
        }
        return LoginPartialDirective;
    })();
    exports.LoginPartialDirective = LoginPartialDirective;
});
//# sourceMappingURL=Components.js.map
