import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { appAxios } from '../utils/axios'
// import { appAxios } from '../utils/axios'

function App() {
  const [count, setCount] = useState(0)

  const [file, setFile] = useState<Blob | string>()
  console.log("🚀 ~ App ~ file:", file)

  // useEffect(()=> {
  //   const getData = async () => {
  //     const result = await appAxios.get("/server/aprendices")
  //     console.log("Result: ", result)
  //   }
  //   getData()
  // }, [])
  
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    if(file) {
      formData.append("file", file)
      console.log("Llego aquiii")
      const response = await appAxios.post("/server/megajs/archivo/uno/1024", formData)
      console.log(response)
    }


    console.log("wuaaaaa")
  }

  const inputFileOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      setFile(e.target.files[0])
      
    }
    
  }

  return (
    <>
      <div className='bg-amber-950'>
        <p>aaa</p>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <form onSubmit={onSubmit} action="http://localhost:3000/server/megajs/archivo/uno" method="post" encType="multipart/form-data">
        <input onChange={inputFileOnChange} type="file" name="file" id="" />
        <button  type="submit">Enviar</button>
      </form>
    </>
  )
}

export default App
