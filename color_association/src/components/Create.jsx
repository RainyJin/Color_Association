import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

const Create = ({ colors = [], setColors }) => {
  const [color, setColor] = useState({
    id: uuidv4(),
    name: "",
    status: "created",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (color.name.length !== 7 || !/^#[0-9A-Fa-f]{6}$/.test(color.name)) {
      return toast.error(
        "Color must be a valid hex code of 6 characters, e.g., '#000000'"
      );
    }

    setColors((prevColors) => {
      const validPrevColors = Array.isArray(prevColors) ? prevColors : [];
      const list = [...validPrevColors, color];
      localStorage.setItem("colors", JSON.stringify(list));
      return list;
    });

    toast.success("Color created");

    setColor({
      id: uuidv4(),
      name: "",
      status: "created",
    });
  };

  const handleInputChange = (e) => {
    setColor((prevColor) => ({
      ...prevColor,
      name: "#" + e.target.value,
    }));
  };

  return (
    <>
      <Toaster />
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="border-2 border-slate-400 bg-slate-100 rounded-md mr-4 h-12 w-64 px-1"
            onChange={handleInputChange}
            value={color.name.slice(1)} // Remove '#' for display in the input field
            placeholder="Enter hex color code"
          />
          <button className="bg-gray-500 rounded-md px-4 h-12 text-white">
            Create
          </button>
        </form>
      </div>
    </>
  );
};

export default Create;
