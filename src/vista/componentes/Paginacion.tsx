import { Button } from "./base/Button";

interface Props {
  paginacion: { inicio: number, fin: number }
  setPaginacion: React.Dispatch<React.SetStateAction<{ inicio: number, fin: number }>>
  data: any[]
}

export default function Paginacion({ paginacion, setPaginacion, data }: Props) {
  return (
    <div className="w-full flex items-center justify-between p-2 border-t border-gray-200">
      <p>Mostrando de <strong>{data.length ? paginacion.inicio : "0"}</strong> a <strong>{paginacion.fin >= data.length ? data.length : paginacion.fin}</strong> de <strong>{data.length}</strong> resultados</p>
      <div className="flex gap-4 font-semibold">
        <Button
          disabled={paginacion.inicio == 1}
          onClick={() => setPaginacion({ inicio: paginacion.inicio - 10, fin: paginacion.fin - 10 })}
          variante="secundario"
        >Anterior</Button>
        <Button
          disabled={paginacion.fin >= data.length}
          onClick={() => setPaginacion({ inicio: paginacion.inicio + 10, fin: paginacion.fin + 10 })}
          variante="secundario"
        >Siguiente</Button>
      </div>
    </div>
  )
}
