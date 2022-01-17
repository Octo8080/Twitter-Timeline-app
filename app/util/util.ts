import { Hashids } from "../deps.ts";

const hashids = new Hashids(Deno.env.get("SALTCODE"), 100);

export const encodeHach = (src: string): string => {
  return hashids.encodeHex(src);
};
export const decodeHach = (src: string): string => {
  return hashids.decodeHex(src);
};
