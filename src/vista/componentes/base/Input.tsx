import { InputHTMLAttributes, useEffect, useRef } from 'react';
import { UseFormRegister, RegisterOptions, FieldErrors } from 'react-hook-form';
import { Button } from './Button';
import { ButtonVariante } from '../../../types';
import { IoCopySharp, IoEyeSharp } from 'react-icons/io5';

type InputVariante = 'primario' | 'secundario';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  variante?: InputVariante;
  label?: string;
  requerido?: boolean | null;
  labelClassName?: string,
  name: string;
  register: UseFormRegister<any>;
  rules?: RegisterOptions;
  errors?: FieldErrors;
  button?: string;
  buttonVariante?: ButtonVariante;
  buttonOnclick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  verCopiar?: boolean
}

export function Input({
  variante = 'primario',
  label,
  labelClassName = '',
  requerido = null,
  name,
  register,
  rules,
  className,
  errors,
  button,
  buttonVariante,
  buttonOnclick,
  verCopiar = true,
  ...props
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  let inputClassName = 'w-full px-2 py-1 border outline-none';
  let requeridoClassName = 'text-sm font-light';
  let requeridoText = '';

  if (requerido == true) {
    requeridoClassName += ' text-red-600';
    requeridoText = '(Requerido)'
  } else if (requerido == false) {
    requeridoClassName += ' text-black';
    requeridoText = '(Opcional)'
  }

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
  const estilosFinal = `cursor-text ${inputClassName} ${props.disabled ? 'text-black/50 border-stone-500 ' : ''} ${className || ''}`;
  const verContraseña = () => {
    if (inputRef.current) {
      inputRef.current.type = "text"
    }
  }

  const noContraseña = () => {
    if (inputRef.current) {
      inputRef.current.type = "password"
    }
  }

  const copiarContraseña = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value as string)
      alert("Copiado!")
    }
  }

  labelClassName += ` block w-full mb-2  ${props.type == "radio" ? "cursor-pointer" : "cursor-text"} `
  return (
    <div className='w-full'>
      {label && <label className={labelClassName} htmlFor={props.id}>{label} {requerido != null && <span className={requeridoClassName}>{requeridoText}</span>}</label>}
      <div className='relative w-full flex gap-4 h-9'>
        <input
          id={props.id}
          className={estilosFinal}
          {...register(name, rules)}
          ref={(e) => {
            register(name, rules).ref(e);
            inputRef.current = e
          }}
          {...props}
        />
        {button && <Button onClick={buttonOnclick} className="h-full w-1/4!" variante="primario">Buscar</Button>}
        {props.type == "password" && verCopiar && (
          <div className='absolute right-2 top-1/2 -translate-y-1/2 flex gap-4 cursor-pointer'>
            <span
              onPointerDown={verContraseña}
              onMouseDown={verContraseña}
              onMouseUp={noContraseña}
            >
              <IoEyeSharp className='w-5 h-5 hover:text-stone-500' />
            </span>
            <span
              onClick={copiarContraseña}
            >
              <IoCopySharp className='w-5 h-5 hover:text-stone-500' />
            </span>
          </div>
        )}
      </div>
      {errors && errors[name]?.type === "validate" && <span className="w-full text-sm text-red-500">{(errors[name].message as string)}</span>}
    </div>
  );
};