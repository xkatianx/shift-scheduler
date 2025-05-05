export type Fair = {
  /** 0-indexed dates */
  dates: number[];
  /** maximum frequency difference */
  diff: number;
};

export type Ban = {
  /** 0-indexed dates */
  dates: number[];
  /** name */
  name: string;
};
