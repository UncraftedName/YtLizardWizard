type Props = React.ComponentPropsWithoutRef<"button">;
export default function Button({ children, className, ...rest }: Props) {
  return (
    <button
      className={
        className ||
        "m-4 rounded border border-gray-400 bg-slate-300 p-2 text-xl text-blue-700 shadow-xl"
      }
      {...rest}
    >
      {children}
    </button>
  );
}
