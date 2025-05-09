import { HTMLAttributes } from "react";

type SubtitleVariante = 'primario' | 'secundario' | 'lineaAbajo';
type SubtitleTamaño = 'grande' | 'mediano' | 'pequeño';

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  variante?: SubtitleVariante;
  tamaño?: SubtitleTamaño
  children: React.ReactNode;
}

export function Subtitle({
  variante = 'primario',
  tamaño,
  children,
  className,
  ...props
}: Props) {
  let titleClassName = 'font-semibold text-center ';

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
      titleClassName += ' text-xl';
      break;
    case "mediano":
      titleClassName += ' text-base';
      break;
    case "pequeño":
      titleClassName += ' text-sm';
      break;
    default:
      titleClassName += ' text-base';
      break;
  }

  const estilosFinal = `${titleClassName} ${className || ''}`;
  return (
    <h1 className={estilosFinal} {...props}>
      {children}
    </h1>
  );
};
