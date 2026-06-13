/**
 * Asset loader utilities.
 * Helps resolve asset URLs for local (staticFile) or remote resources.
 */

import { staticFile } from "remotion";

/**
 * Resolves an asset path. If it starts with http/https, returns as-is.
 * Otherwise treats it as a path relative to the public/ directory.
 */
export function resolveAssetUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return staticFile(path);
}

/**
 * Checks whether a URL is a remote URL.
 */
export function isRemoteUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
