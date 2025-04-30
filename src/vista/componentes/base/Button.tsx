import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariante = 'primario' | 'secundario' | 'terciario' | 'peligro';

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
  let estilosBoton = 'w-full p-2 cursor-pointer font-semibold ';
  switch (variante) {
    case 'primario':
      estilosBoton += 'bg-green-500 hover:bg-green-600 text-white';
      break;
    case 'secundario':
      estilosBoton += 'border border-gray-200 hover:bg-gray-100';
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

  const estilosFinal = `${estilosBoton} ${className || ''}`;
  return (
    <button
      className={estilosFinal}
      {...props}
    >
      {children}
    </button>
  );
};