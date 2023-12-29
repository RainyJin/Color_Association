import { useEffect, useState } from "react";

const ListColors = ({ colors, setColors }) => {
  const [created, setCreated] = useState([]);


  useEffect(() => {
    const fCreated = colors.filter((color) => color.status === "created");
    setCreated(fCreated);
  }, [colors]);

  const statuses = ["created", "celery", "banana", "strawberry"];

  return (
    <div className="flex gap-16">
      {
        statuses.map((status, index) => {
          <Section key={index} status={status} />
        })
      }
    </div>
  );
}

export default ListColors;

const Section = ({ status }) => {
  return (
    <>
      list
    </>
  )
}