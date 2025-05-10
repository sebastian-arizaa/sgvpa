import { useEffect, useState } from 'react'
import axios from 'axios'

interface Props {
  departamentoActual: string,
}

export function useFetchMunicipios({ departamentoActual }: Props) {
  const [municipios, setMunicipio] = useState<string[]>([])
  useEffect(() => {
    if (departamentoActual) {
      const getMunicipio = async () => {
        const { data } = await axios<{ municipio: string }[]>(`https://www.datos.gov.co/resource/xdk5-pm3f.json?departamento=${departamentoActual}`)
        const values = data.map(data => data.municipio).sort((a, b) => (a.charCodeAt(0) as number) - (b.charCodeAt(0) as number))
        setMunicipio(values)
      }
      getMunicipio()
    }
  }, [departamentoActual])

  return { municipios, setMunicipio }
}
