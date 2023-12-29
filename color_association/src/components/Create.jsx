import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';

const Create = ({ colors, setColors }) => {
  const [color, setColor] = useState({
    id: "",
    name: "",
    status: "created" //can also be of the 4 given selections
  });

  console.log(color);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (color.name.length != 7) return toast.error("Color must be rgb 6 characters ie. '000000'");

    setColors((prev) => {
      const list = [...prev, color];

      localStorage.setItem("colors", JSON.stringify(list));

      return list;
    });

    toast.success("Color created");

    setColor({
      id: "",
      name: "",
      status: "created" //can also be deleted
    });

  }

  return <>
    <Toaster />
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text"
          className="border-2 border-slate-400 bg-slate-100 rounded-md mr-4 h-12
          w-64 px-1"
          onChange={(e) => setColor({ ...color, id: uuidv4(), name: "#" + e.target.value })} />
        <button className="bg-gray-500 rounded-md px-4 h-12 text-white">
          Create
        </button>
      </form>
    </div>
  </>
}

export default Create;