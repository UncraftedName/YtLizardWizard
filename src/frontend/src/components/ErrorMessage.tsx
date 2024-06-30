/** For now just a small component for displaying a message to the user. */
export default function ErrorMessage({ text }: { text: string }) {
  return (
    <div className="fixed bottom-4 right-4 max-w-96 rounded bg-red-200 px-4 py-2">
      <h2 className="text-2xl font-semibold text-red-800">An error occured!</h2>
      <p className="my-2 w-full border border-slate-400"></p>
      <p className="leading-5">{text}</p>
    </div>
  );
}
