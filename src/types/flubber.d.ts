/**
 * Minimal type declarations for the untyped `flubber` package.
 * Only the API surface actually used by this codebase is declared.
 * https://github.com/veltman/flubber
 */
declare module "flubber" {
  export interface FlubberOptions {
    maxSegmentLength?: number;
    string?: boolean;
  }

  export function interpolate(
    fromShape: string,
    toShape: string,
    options?: FlubberOptions
  ): (t: number) => string;

  export function interpolateAll(
    fromShapes: string[],
    toShapes: string[],
    options?: FlubberOptions
  ): (t: number) => string[];

  export function separate(
    fromShape: string,
    toShapes: string[],
    options?: FlubberOptions
  ): (t: number) => string[];

  export function combine(
    fromShapes: string[],
    toShape: string,
    options?: FlubberOptions
  ): (t: number) => string;

  export function splitPathString(pathString: string): string[];
  export function toPathString(ring: Array<[number, number]>): string;
}
