export class SignupModel {// extends Model {
    test:boolean;  
} 

export interface IModel {
    isValid: boolean
    evtUpdated: string;
}

export class Model implements IModel {

    public isValid: boolean;
    public evtUpdated: string;

    public onPropertyChanged = (propertyChangedName: string): void=> {

    }
}