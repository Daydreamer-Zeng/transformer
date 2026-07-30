import { NODE_TYPES } from "@/utils/types.js";

export interface Loc {
  line: number;
  column: number;
  index: number;
}

export type Location = Loc | null;

export interface Node {
  type: NODE_TYPES;
  start: Location;
  end: Location;
  [key: string]: any;
}

export interface Statement extends Node {
  type: NODE_TYPES;
}

export interface Expression extends Node {
  type: NODE_TYPES;
}

export interface Program extends Node {
  type: NODE_TYPES.Program;
  body: Statement[];
  start: Location;
  end: Location;
  sourceType: "script" | "module";
}
