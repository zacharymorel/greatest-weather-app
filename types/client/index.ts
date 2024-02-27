export interface IWeather {
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  city?: string;
  state?: string;
  country?: string;
}

export interface IFormSchema {
  inputType:
    | 'text'
    | 'radio'
    | 'checkbox'
    | 'number'
    | 'submit'
    | 'button'
    | 'dropdown';
  label?: string;
  name: string;
  disabled?: boolean;
  feedback?: string;
  buttonValue?: string;
  placeHolder?: string;
  dropDownListItems?: [React.ReactNode];
}

export interface IFormProps {
  onSubmit?: Function;
  schema: IFormSchema[];
  onChange?: Function;
  formData: any;
}

export interface IGooglePlacesPrediction {
  description: string;
  placeId: string;
}

export type IGooglePlacesPredictions = IGooglePlacesPrediction[];
