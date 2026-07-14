/**
 * GitHub Pages Integration Helper
 * Fixes path and import issues for GitHub Pages deployment
 */

/**
 * Get base path from current URL
 * Returns "" for root deploy or "/repo-name" for repository deploy
 */
export function getBasePath() {
  const path = window.location.pathname;
  
  // If we're at root (/) or in development
  if (path === "/" || path === "") {
    return "";
  }
  
  // Extract repo name from path
  // GitHub Pages URLs: /reponame/ or /reponame
  const parts = path.split("/").filter(Boolean);
  
  // If first part looks like a repo (not a domain), return it
  if (parts.length > 0 && !parts[0].includes(".")) {
    return "/" + parts[0];
  }
  
  return "";
}

/**
 * Resolve module path for GitHub Pages
 * @param {string} modulePath - relative path like "./js/supabase.js"
 * @returns {string} resolved path with base
 */
export function resolveModulePath(modulePath) {
  const basePath = getBasePath();
  if (basePath === "") {
    return modulePath;
  }
  return basePath + modulePath;
}

/**
 * Dynamically import modules with GitHub Pages support
 * @param {string} modulePath - path to module like "./js/supabase.js"
 * @returns {Promise<any>} imported module
 */
export async function dynamicImport(modulePath) {
  const resolvedPath = resolveModulePath(modulePath);
  try {
    return await import(resolvedPath);
  } catch (err) {
    console.error(`Failed to import ${modulePath}:`, err);
    throw err;
  }
}

/**
 * Get full URL for resources (images, etc.)
 * @param {string} resourcePath - path like "/images/logo.png"
 * @returns {string} full resource URL
 */
export function getResourceURL(resourcePath) {
  const basePath = getBasePath();
  return basePath + resourcePath;
}

/**
 * Log current environment info
 */
export function logEnvironmentInfo() {
  console.log("=== Creta Environment Info ===");
  console.log("Current URL:", window.location.href);
  console.log("Pathname:", window.location.pathname);
  console.log("Base Path:", getBasePath());
  console.log("Is GitHub Pages:", window.location.hostname.includes("github.io"));
}
