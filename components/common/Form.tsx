// Relative
import { IFormProps, IFormSchema } from '@/types/client';

function buildForm({
  schema,
  onSubmit,
  onChange,
  formData,
}: IFormProps): React.ReactNode {
  if (!schema || schema.length === 0) return null;

  function deriveFormElement(n: IFormSchema): React.ReactNode {
    if (!n) return null;

    // *NOTE: There would be more cases here. See inputType in FormSChema
    // .i.e., dropdown and such if needed.
    switch (n.inputType) {
      case 'number':
        return (
          <input
            className="text-white bg-dark-4 p-2 mr-2 last:mr-0"
            key={n.name}
            type={n.inputType}
            onChange={
              onChange
                ? (e) => onChange({ [n.name]: e.target.value })
                : () => {}
            }
            value={formData[n.name]}
            placeholder={n.placeHolder || ''}
          />
        );
        break;

      case 'text':
        return (
          <input
            className="text-white bg-dark-4 p-2 mr-2 last:mr-0 "
            key={n.name}
            type={n.inputType}
            onChange={
              onChange
                ? (e) => onChange({ [n.name]: e.target.value })
                : () => {}
            }
            value={formData[n.name]}
            placeholder={n.placeHolder || ''}
          />
        );
        break;

      case 'submit':
        return (
          <input
            className="cursor-pointer text-white bg-dark-4 p-2 mr-2 last:mr-0 "
            key={n.name}
            type={n.inputType}
            value={n.buttonValue}
            onClick={onSubmit ? () => onSubmit() : () => {}}
          />
        );
        break;

      default:
        return null;
    }
  }

  return schema.map((n) => deriveFormElement(n));
}

function Form(props: IFormProps): React.ReactNode {
  return (
    <form
      className="bg-dark-3 p-4 border border-solid border-dark-4 rounded"
      onSubmit={(e) => e.preventDefault()}
    >
      {buildForm(props)}
    </form>
  );
}

export default Form;
