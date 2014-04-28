define(["require", "exports", '../Models/SignupModel'], function(require, exports, model) {
    var SignUpController = (function () {
        function SignUpController($scope, $signUpValidationService, $sanitize) {
            var _this = this;
            this.emailValid = false;
            this.passwordValid = false;
            this.submitStepOne = function () {
                console.log('doooood');
            };
            this.pushAlert = function (alertType, closeAction, message, refersTo) {
                _this._scope.alerts.push({ type: alertType, close: closeAction, message: message, refersTo: refersTo });
            };
            this.clearAlertsFor = function (refersTo) {
                var indexes = [];
                for (var ai = 0; ai < _this._scope.alerts.length; ai++) {
                    if (_this._scope.alerts[ai].refersTo == refersTo) {
                        var removed = _this._scope.alerts.splice(ai, 1);
                    }
                }
            };
            this.validateModel = function (evt) {
                if (evt.target == $('#emailAddress')[0]) {
                    _this.checkAvailable();
                } else if (evt.target == $('#password')[0]) {
                    _this.onPasswordChange();
                } else if (evt.target == $('#confirmPassword')[0]) {
                    _this.onPasswordChange();
                }
            };
            this.checkAvailable = function () {
                var _this = this;
                this.clearAlertsFor('emailAddress');
                this._signUpValidationService.IsEmailUserAvailable(this._scope.EmailAddress).success(function (isAvailable) {
                    if (isAvailable) {
                        _this.pushAlert('success', null, 'Your email address is available to use.', 'emailAddress');
                        _this.emailValid = true;
                        _this.checkAllValid();
                    } else {
                        _this.pushAlert('warning', null, 'Your email address has already been used.', 'emailAddress');
                        _this.emailValid = false;
                        _this.checkAllValid();
                    }
                });
            };
            this.checkAllValid = function () {
                _this._scope.isValid = _this.emailValid && _this.passwordValid;
            };
            this.onPasswordChange = function () {
                this.clearAlertsFor('passwordconfirmPassword');
                if (this._scope.Password != this._scope.ConfirmPassword) {
                    this.pushAlert('danger', null, 'You password doesn\'t match the confirmation.', 'passwordconfirmPassword');
                    this.passwordValid = false;
                } else {
                    this.pushAlert('success', null, 'Passwords Match!', 'passwordconfirmPassword');
                    this.passwordValid = true;
                }
                this.checkAllValid();
            };
            this.signupModel = new model.SignupModel();

            $scope.passwordMatchClass = 'label';

            $scope.submitStepOne = this.submitStepOne;
            $scope.validateModel = this.validateModel;

            $scope.alerts = new Array();
            $scope.alerts.push({ type: 'info', close: null, message: 'Please Enter Your Email Address to check and see if it is available.', refersTo: 'emailAddress' });
            $scope.alerts.push({ type: 'info', close: null, message: 'Please Enter a password. You can make it easy. It must match', refersTo: 'passwordconfirmPassword' });

            this._scope = $scope;
            if ($signUpValidationService == null)
                throw new Error("custom service injector problem");
            this._signUpValidationService = $signUpValidationService;

            this.checkAllValid();
        }
        SignUpController.$inject = ['$scope', '$signupValidationService'];
        return SignUpController;
    })();
    exports.SignUpController = SignUpController;
});
//# sourceMappingURL=SignUpModule.js.map
