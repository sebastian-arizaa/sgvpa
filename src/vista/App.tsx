import { useEffect, useState } from 'react'
// import { appAxios } from '../utils/axios'

function App() {
  const [count, setCount] = useState(0)

  // useEffect(()=> {
  //   const getData = async () => {
  //     const result = await appAxios.get("/server/aprendices")
  //     console.log("Result: ", result)
  //   }
  //   getData()
  // }, [])
  
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
      <form action="http://localhost:3000/server/aprendices/todos" method="post" encType="multipart/form-data">
        <input type="file" name="file" id="" />
        <button type="submit">Enviar</button>
      </form>
    </>
  )
}

export default App
