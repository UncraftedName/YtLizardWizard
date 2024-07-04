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
    case "change-view": {
      return {
        ...state,
        currentView: action.payload,
      };
    }
    case "set-playlists": {
      return {
        ...state,
        playlists: action.payload,
      };
    }
    case "set-channels": {
      return {
        ...state,
        channels: action.payload,
      };
    }
    case "set-videos": {
      return {
        ...state,
        videos: action.payload,
      };
    }
    default: {
      console.error("Unknown action type:", action);
      return { ...state };
    }
  }
}
