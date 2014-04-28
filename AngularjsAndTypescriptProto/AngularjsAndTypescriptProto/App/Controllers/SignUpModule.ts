

import service = require('../Services/SignUpValidationService');


import model = require('../Models/SignupModel');


export interface ISignUpControllerScope extends ng.IScope {
    EmailAddress: string;
    EmailAddressStatus: string;
    Password: string;
    ConfirmPassword: string;
    PasswordStatus: string;
    passwordMatchClass: string;

    alerts: IAlertItem[];

    isValid: boolean;

    submitStepOne: Function;
    validateModel: Function;

}

export interface IAlertItem {
    type: string;
    close(index: any): any;
    message: string;
    refersTo: string;
}


export class SignUpController {
    static $inject = ['$scope', '$signupValidationService'];

    _scope: ISignUpControllerScope;
    _signUpValidationService: service.SignupValidationService;

    emailValid: boolean = false;
    passwordValid: boolean = false;
    submitStepOne = () => {
        console.log('doooood');
    };

    signupModel: model.SignupModel;

    constructor($scope: ISignUpControllerScope, $signUpValidationService: service.SignupValidationService,
        $sanitize: ng.sanitize.ISanitizeService) {

        this.signupModel = new model.SignupModel();

        $scope.passwordMatchClass = 'label';

        $scope.submitStepOne = this.submitStepOne;
        $scope.validateModel = this.validateModel;

        

        $scope.alerts = new Array<IAlertItem>();
        $scope.alerts.push({ type: 'info', close: null, message: 'Please Enter Your Email Address to check and see if it is available.', refersTo: 'emailAddress' });
        $scope.alerts.push({ type: 'info', close: null, message: 'Please Enter a password. You can make it easy. It must match', refersTo: 'passwordconfirmPassword' });

        this._scope = $scope;
        if ($signUpValidationService == null)
            throw new Error("custom service injector problem");
        this._signUpValidationService = $signUpValidationService;

        this.checkAllValid();
    }

    pushAlert = (alertType: string, closeAction: (index: any) => any, message: string, refersTo: string): void => {
        this._scope.alerts.push({ type: alertType, close: closeAction, message: message, refersTo: refersTo });
    }

    clearAlertsFor = (refersTo: string): void => {
        var indexes = [];
        for (var ai = 0; ai < this._scope.alerts.length; ai++) {
            if (this._scope.alerts[ai].refersTo == refersTo) {
                var removed = this._scope.alerts.splice(ai, 1);
            }
        }
    }

    validateModel = (evt: JQueryEventObject): void=> {

        if (evt.target == $('#emailAddress')[0]) {
            this.checkAvailable();
        }
        else if (evt.target == $('#password')[0]) {
            this.onPasswordChange();
        }
        else if (evt.target == $('#confirmPassword')[0]) {
            this.onPasswordChange();
        }
    }

    checkAvailable = function() {
        this.clearAlertsFor('emailAddress');
        this._signUpValidationService.IsEmailUserAvailable(this._scope.EmailAddress).success((isAvailable: boolean) => {
            if (isAvailable) {
                this.pushAlert('success', null, 'Your email address is available to use.', 'emailAddress');
                this.emailValid = true;
                this.checkAllValid();
            } else {
                this.pushAlert('warning', null, 'Your email address has already been used.', 'emailAddress');
                this.emailValid = false;
                this.checkAllValid();
            }
        });
    }

    checkAllValid = (): void=> {
        this._scope.isValid = this.emailValid && this.passwordValid;
    }

    onPasswordChange = function () {
        this.clearAlertsFor('passwordconfirmPassword');
        if (this._scope.Password != this._scope.ConfirmPassword) {

            this.pushAlert('danger', null, 'You password doesn\'t match the confirmation.', 'passwordconfirmPassword');
            this.passwordValid = false;
        }
        else {
            this.pushAlert('success', null, 'Passwords Match!', 'passwordconfirmPassword');
            this.passwordValid = true;
        }
        this.checkAllValid();
    }


} 