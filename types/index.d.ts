interface Weather {
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
}

interface FormSchema {
  inputType:
    | 'text'
    | 'radio'
    | 'checkbox'
    | 'number'
    | 'submit'
    | 'button'
    | 'dropdown';
  label: string;
  name: string;
  placeHolder?: string;
  dropDownListItems?: [React.ReactNode];
}

interface FormProps {
  onSubmit?: Function;
  schema: FormSchema[];
  onChange?: Function;
  formData: any;
}
