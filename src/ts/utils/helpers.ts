/** @format */

import path from "path";
import fs from "fs";
import { URL } from "url";

export function onPageReady(callback: () => void) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

export function readFolderRecursively(folder: string, relativeFilePathArray: string[]) {
  fs.readdirSync(folder).forEach((file) => {
    const filePath = folder + path.sep + file;
    if (fs.statSync(filePath).isDirectory()) {
      relativeFilePathArray = readFolderRecursively(filePath, relativeFilePathArray);
    } else {
      // relativeFilePathArray.push(path.join(folder, path.sep, file));
      relativeFilePathArray.push(filePath);
    }
  });
  return relativeFilePathArray;
}

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export function getPublicUrlOrPath(isEnvDevelopment: boolean, homepage: string | null | undefined, envPublicUrl: string | null) {
  const stubDomain = "https://create-react-app.dev";

  if (envPublicUrl) {
    // ensure last slash exists
    envPublicUrl = envPublicUrl.endsWith("/") ? envPublicUrl : envPublicUrl + "/";

    // validate if `envPublicUrl` is a URL or path like
    // `stubDomain` is ignored if `envPublicUrl` contains a domain
    const validPublicUrl = new URL(envPublicUrl, stubDomain);

    return isEnvDevelopment
      ? envPublicUrl.startsWith(".")
        ? "/"
        : validPublicUrl.pathname
      : // Some apps do not use client-side routing with pushState.
        // For these, "homepage" can be set to "." to enable relative asset paths.
        envPublicUrl;
  }

  if (homepage) {
    // strip last slash if exists
    homepage = homepage.endsWith("/") ? homepage : homepage + "/";

    // validate if `homepage` is a URL or path like and use just pathname
    const validHomepagePathname = new URL(homepage, stubDomain).pathname;
    return isEnvDevelopment
      ? homepage.startsWith(".")
        ? "/"
        : validHomepagePathname
      : // Some apps do not use client-side routing with pushState.
        // For these, "homepage" can be set to "." to enable relative asset paths.
        homepage.startsWith(".")
        ? homepage
        : validHomepagePathname;
  }

  return "/";
}

export function getEjsViewConfigs(folder: string, { templatePath }: { templatePath: string }) {
  const relativeFilePathArray = readFolderRecursively(folder, []);
  // return { folder, templatePath, relativeFilePathArray };
  return relativeFilePathArray
    .filter((file) => file.endsWith(".ejs"))
    .map((file) =>
      file
        .replace(`${folder}${path.sep}`, "")
        // .replace(/\\g/, '/')
        .replace(".ejs", "")
    )
    .map((relativeFilePath) => {
      const filename = relativeFilePath.split("/").pop();
      if (filename != null) {
        let title = filename
          .replaceAll("-", " ")
          .toLowerCase()
          .replace(/\b[a-z]/g, function (s) {
            // help link: https://stackoverflow.com/a/63802499
            return s.toUpperCase();
          });
        if (filename === "index") {
          title = "MyJobDone";
        }
        return {
          filename: `./${relativeFilePath}.html`,
          template: templatePath,
          templateParameters: {
            title: title,
            page: relativeFilePath,
          },
        };
      }
      return null;
    });
}
