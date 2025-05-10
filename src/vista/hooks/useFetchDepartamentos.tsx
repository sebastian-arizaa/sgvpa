import { useEffect, useState } from 'react'
import axios from 'axios'

export function useFetchDepartamentos() {
  const [departamentos, setDepartamentos] = useState<string[]>([])

  useEffect(() => {
    const getDepartamentos = async () => {
      const { data } = await axios<{ departamento: string }[]>('https://www.datos.gov.co/resource/xdk5-pm3f.json')
      const values = [...new Set(data.map(data => data.departamento))].sort((a, b) => (a.charCodeAt(0) as number) - (b.charCodeAt(0) as number))
      const indexValue = values.findIndex(value => value == 'Archipiélago de San Andrés, Providencia y Santa Catalina')
      values.splice(indexValue, 1)
      setDepartamentos(values)
    }
    getDepartamentos()
  }, [])

  return [departamentos]
}
