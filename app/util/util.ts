import { Hashids } from "../deps.ts";

const hashids = new Hashids(Deno.env.get("SALTCODE"));

export const encodeHach = (src: string): string => {
  return hashids.encodeHex(src);
};
export const decodeHach = (src: string): string => {
  return hashids.decodeHex(src);
};
