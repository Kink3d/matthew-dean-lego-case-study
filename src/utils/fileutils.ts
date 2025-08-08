
export namespace FileUtils {
    export function GetAbsolutePath(path: string) : string {
      return window.location.pathname.replace(/\/[^\/]*$/, '/') + path;
    }
  }
  