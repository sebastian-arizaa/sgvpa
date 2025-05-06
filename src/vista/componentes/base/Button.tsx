import React, { ButtonHTMLAttributes } from 'react';
import { ButtonVariante } from '../../../types';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: ButtonVariante;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variante = 'peligro',
  children,
  className,
  ...props
}: Props) {
  let estilosBoton = `w-full p-2 font-semibold ${!props.disabled ? 'cursor-pointer' : ''} `;
  switch (variante) {
    case 'primario':
      estilosBoton += `bg-green-500 text-white ${!props.disabled ? 'hover:bg-green-600' : ''}`;
      break;
    case 'secundario':
      estilosBoton += `border border-gray-200 ${!props.disabled ? 'hover:bg-gray-100' : ''}`;
      break;
    case 'terciario':
      estilosBoton += '';
      break;
    case 'peligro':
      estilosBoton += 'bg-red-400 hover:bg-red-500 text-white';
      break;
    default:
      estilosBoton += '';
      break;
  }

  const estilosFinal = `${estilosBoton} ${className || ''} ${props.disabled ? 'opacity-50' : ''}`;
  return (
    <button
      className={estilosFinal}
      {...props}
    >
      {children}
    </button>
  );
};