import Calendar from "../assets/Calendar.svg";

export default function TestPage() {
  return (
    <div className="flex flex-row h-screen">
      <div className="basis-1/2 flex items-center justify-center text-7xl">
        <p className="text-center">
          Day 1 Buy <br /> <strong>apple</strong>
        </p>
      </div>
      <div className="basis-1/2 flex items-center justify-center relative">
        <img
          src={Calendar}
          alt="Calendar"
          style={{ width: "60%", height: "60%" }}
          className="relative"
        />
        <p className="absolute text-white text-5xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-28 z-10">
          Sep
        </p>
        <p className="absolute text-black text-8xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          1
        </p>
      </div>
    </div>
  );
}
