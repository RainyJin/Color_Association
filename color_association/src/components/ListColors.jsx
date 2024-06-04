import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDrag, useDrop } from "react-dnd";

const ListColors = ({ colors = [], setColors }) => {
  const statuses = ["created", "celery", "banana", "strawberry"];

  return (
    <div className="flex gap-16">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          colors={colors}
          setColors={setColors}
        />
      ))}
    </div>
  );
};

export default ListColors;

const Section = ({ status, colors = [], setColors }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "color",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const filteredColors = (colors || []).filter(
    (color) => color.status === status
  );

  const addItemToSection = (id) => {
    setColors((prev = []) => {
      const updatedColors = prev.map((c) => {
        if (c.id === id) {
          return { ...c, status: status };
        }
        return c;
      });

      localStorage.setItem("colors", JSON.stringify(updatedColors));
      if (status !== "created") {
        toast(`Color selected for ${status}`);
      }
      return updatedColors;
    });
  };

  let text = status.charAt(0).toUpperCase() + status.slice(1);
  let bg = "bg-slate-500"; // Default background color for "created"

  switch (status) {
    case "celery":
      bg = "bg-green-500";
      break;
    case "banana":
      bg = "bg-yellow-500";
      break;
    case "strawberry":
      bg = "bg-red-500";
      break;
    default:
      break;
  }

  return (
    <div
      ref={drop}
      className={`w-64 rounded-md p-2 ${isOver ? "bg-slate-300" : ""}`}
    >
      <Header text={text} bg={bg} count={filteredColors.length} />
      {filteredColors.length > 0 &&
        filteredColors.map((color) => (
          <Color
            key={color.id}
            color={color}
            colors={colors}
            setColors={setColors}
          />
        ))}
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}
    >
      {text}
      <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
        {count}
      </div>
    </div>
  );
};

const Color = ({ color, colors = [], setColors }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "color",
    item: { id: color.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleRemove = (id) => {
    const updatedColors = colors.filter((c) => c.id !== id);
    localStorage.setItem("colors", JSON.stringify(updatedColors));
    setColors(updatedColors);
    toast("Color removed");
  };

  return (
    <div
      ref={drag}
      style={{ backgroundColor: `${color.name}` }}
      className={`relative p-4 mt-8 shadow-md rounded-md cursor-grab text-white ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <p>{color.name}</p>
      <button
        className="absolute bottom-1 right-1 text-slate-200"
        onClick={() => handleRemove(color.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};
