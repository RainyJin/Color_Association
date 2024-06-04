import { useEffect, useState } from "react";
import "./App.css";
import Create from "./components/Create";
import ListColors from "./components/ListColors";
import { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [colors, setColors] = useState(["#990000", "#009900"]);

  console.log(colors);

  useEffect(() => {
    setColors(JSON.parse(localStorage.getItem("colors")));
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <div
        className="bg-slate-100 w-screen h-screen flex flex-col
        items-center p-32 gap-16 pt-32"
      >
        <Create colors={colors} setColors={setColors} />
        <ListColors colors={colors} setColors={setColors} />
      </div>
    </DndProvider>
  );
}

export default App;
