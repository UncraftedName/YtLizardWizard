import { pack, unpack } from "msgpackr";

/** Utility functions relating to msgpack. */

export function packObject(data: any) {
  return pack(data);
}

export function unpackObject(data: any) {
  return unpack(data);
}
