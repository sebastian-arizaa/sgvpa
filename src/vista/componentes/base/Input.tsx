import { InputHTMLAttributes } from 'react';
import { UseFormRegister, RegisterOptions, FieldErrors } from 'react-hook-form';

type InputVariante = 'primario' | 'secundario';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  variante?: InputVariante;
  label?: string;
  labelClassName?: string,
  name: string;
  register: UseFormRegister<any>;
  rules?: RegisterOptions;
  errors?: FieldErrors
}

export function Input({
  variante = 'primario',
  label,
  labelClassName,
  name,
  register,
  rules,
  className,
  errors,
  ...props
}: Props) {
  let inputClassName = 'w-full px-2 py-1 border outline-none';

  switch (variante) {
    case 'primario':
      inputClassName += ' ';
      break;
    case 'secundario':
      inputClassName += ' ';
      break;
    default:
      inputClassName += ' ';
      break;
  }

  const estilosFinal = `${inputClassName} ${className || ''}`;
  // console.log("Errors ============>", errors)
  // console.log("props.checked ==>", props.checked)
  return (
    <div className='w-full'>
      {label && <label className={`block w-full ${labelClassName}`} htmlFor={props.id}>{label}</label>}
      <input
        id={props.id}
        className={estilosFinal}
        {...register(name, rules)}
        {...props}
      />
      {errors && errors.nombre?.type === "validate" && <span className="w-full text-sm text-red-500">{(errors.nombre.message as string)}</span>}
    </div>
  );
};