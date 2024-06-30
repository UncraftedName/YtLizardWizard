import usePoopStore from "#/store/usePoopStore";
import type { PageView } from "#/types/Routing";

export default function ViewsMenu() {
  const { currentView, dispatch } = usePoopStore();

  function handleClick(pageView: PageView) {
    dispatch({
      type: "change-view",
      payload: pageView,
    });
  }

  return (
    <menu className="mb-4 ml-2 grid w-fit grid-cols-3 overflow-hidden rounded-md border-2 border-emerald-800">
      <li>
        <MenuButton
          isFocused={currentView === "playlists"}
          onClick={() => handleClick("playlists")}
        >
          Playlists
        </MenuButton>
      </li>
      <li>
        <MenuButton
          isFocused={currentView === "channels"}
          onClick={() => handleClick("channels")}
        >
          Channels
        </MenuButton>
      </li>
      <li>
        <MenuButton
          isFocused={currentView === "videos"}
          onClick={() => handleClick("videos")}
        >
          Videos
        </MenuButton>
      </li>
    </menu>
  );
}

type MenuButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  isFocused?: boolean;
};
function MenuButton({ isFocused, children, ...rest }: MenuButtonProps) {
  return (
    <button
      className={`w-full px-2 py-1 text-lg font-semibold transition-colors duration-300 hover:bg-emerald-400 ${isFocused ? "bg-emerald-400" : "bg-emerald-300"}`}
      {...rest}
    >
      {children}
    </button>
  );
}
