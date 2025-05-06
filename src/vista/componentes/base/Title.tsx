import { HTMLAttributes } from "react";

type TitleVariante = 'primario' | 'secundario' | 'lineaAbajo';
type TitleTamaño = 'grande' | 'mediano' | 'pequeño';

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  variante?: TitleVariante;
  tamaño?: TitleTamaño
  children: React.ReactNode;
}

export function Title({
  variante = 'primario',
  tamaño,
  children,
  className,
  ...props
}: Props) {
  let titleClassName = 'font-semibold text-center my-2 ';

  switch (variante) {
    case 'primario':
      titleClassName += ' ';
      break;
    case 'secundario':
      titleClassName += ' ';
      break;
    case 'lineaAbajo':
      titleClassName += ' border-b border-gray-200 pb-4';
      break;
    default:
      titleClassName += ' ';
      break;
  }

  switch (tamaño) {
    case "grande":
      titleClassName += ' text-2xl';
      break;
    case "mediano":
      titleClassName += ' text-xl';
      break;
    case "pequeño":
      titleClassName += ' text-base';
      break;
    default:
      titleClassName += ' text-lg';
      break;
  }

  const estilosFinal = `${titleClassName} ${className || ''}`;
  return (
    <h1 className={estilosFinal} {...props}>
      {children}
    </h1>
  );
};
