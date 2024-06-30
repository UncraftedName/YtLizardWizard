import type { PoopStoreState, PoopStoreActions } from "./types";

export function poopStoreReducer(
  state: PoopStoreState,
  action: PoopStoreActions,
): PoopStoreState {
  switch (action.type) {
    case "set-connection-status": {
      return {
        ...state,
        socketConnStatus: action.payload,
      };
    }
    case "next-msg-id": {
      return {
        ...state,
        nextMsgId: state.nextMsgId + 1,
      };
    }
    case "set-playlists": {
      return {
        ...state,
        playlists: action.payload,
      };
    }
    default: {
      console.error("Unknown action type:", action);
      return { ...state };
    }
  }
}
