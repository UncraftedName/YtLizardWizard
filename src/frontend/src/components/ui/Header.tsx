import usePoopStore from "#/store/usePoopStore";

export default function Header() {
  const { socketConnStatus } = usePoopStore();

  let colorClass = "";
  if (socketConnStatus === "CONNECTED") colorClass = "bg-green-500";
  else if (socketConnStatus === "INIT") colorClass = "bg-yellow-400";
  else colorClass = "bg-red-500";

  return (
    <div className="grid w-full place-content-center p-4">
      <div className="flex gap-2">
        <h1 className="inline rounded-md border-2 border-slate-800 p-2 text-3xl font-bold text-red-400 underline shadow-lg">
          Lizard Wizard!!!
        </h1>
        <div
          className={`h-4 w-4 animate-bounce place-self-end rounded-full ${colorClass}`}
        ></div>
      </div>
    </div>
  );
}
