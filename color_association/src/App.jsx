import { useEffect, useState } from 'react'
import './App.css'
import Create from './components/Create'
import ListColors from './components/ListColors';
import { Toaster } from 'react-hot-toast';

function App() {
  const [colors, setColors] = useState([]);

  console.log(colors)

  useEffect(() => {
    setColors(JSON.parse(localStorage.getItem("colors")));
  }, [])

  return (
    <>
      <Toaster />
      <div className="bg-slate-100 w-screen h-screen flex flex-col
        items-center pt-32 gap-16">
        <Create colors={colors} setColors={setColors} />
        <ListColors colors={colors} setColors={setColors} />
      </div>
    </>
  )
}

export default App
