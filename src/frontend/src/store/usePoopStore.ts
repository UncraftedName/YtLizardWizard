import { useContext } from "react";
import { PoopStoreContext } from "./PoopStoreProvider";

export default function usePoopStore() {
  const currentContext = useContext(PoopStoreContext);
  if (!currentContext) {
    throw new Error(
      "Don't use this hook unless nested within the Project Context Provider component you dumbass.",
    );
  }

  return currentContext;
}
