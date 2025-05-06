import { SelectHTMLAttributes } from "react";
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  name?: string;
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
  errors?: FieldErrors;
  values: string[],
  label?: string,
  labelClassName?: string,
  requerido?: boolean | null
}

export function Select({
  register,
  rules,
  errors,
  name,
  values,
  label,
  labelClassName,
  requerido,
  ...props
}: Props) {
  const estilosBase = "w-full px-2 py-1 border-b border-stone-500 outline-none"
  let requeridoClassName = 'text-sm font-light';
  let requeridoText = '';

  if (requerido == true) {
    requeridoClassName += ' text-red-600';
    requeridoText = '(Requerido)'
  } else if (requerido == false) {
    requeridoClassName += ' text-black';
    requeridoText = '(Opcional)'
  }
  const estilosFinales = `${estilosBase} ${props.className || ''} ${props.disabled ? 'text-black/50 ' : ''}`

  return (
    <div className="w-full">
      {label && <label className={`block w-full mb-2 cursor-text ${labelClassName}`} htmlFor={props.id}>{label} {requerido != null && <span className={requeridoClassName}>{requeridoText}</span>}</label>}
      <select  {...(register && name && { ...register(name, rules) })} {...props} className={estilosFinales}>
        {values.map(value => <option key={value} value={value}>{value}</option>)}
      </select>
      {errors && errors[name || '']?.type === "validate" && <span className="w-full text-sm text-red-500">{(errors[name || '']?.message as string)}</span>}
    </div>
  )
}
