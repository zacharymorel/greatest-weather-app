function Form(props: FormProps): React.ReactNode {
  const { formData, schema, onChange, onSubmit } = props;

  function buildForm(): React.ReactNode {
    if (!schema || schema.length === 0) return null;

    const conditionalProps: { onSubmit?: Function | any } = {};
    if (onSubmit) conditionalProps.onSubmit = onSubmit;

    return schema.map((n) => {
      return (
        <input
          className="text-black"
          key={n.name}
          type={n.inputType}
          onChange={onChange ? (e) => onChange(e.target.value) : () => {}}
          value={formData[n.name]}
          placeholder={n.placeHolder || ''}
          {...conditionalProps}
        />
      );
    });
  }

  return <form onSubmit={(e) => e.preventDefault()}>{buildForm()}</form>;
}

export default Form;
