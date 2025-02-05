/** @format */

// Template wrapper

import fs from "fs";
import path from "path";

import ejs from "ejs";

// @ts-ignore
import jobTypes from "../../../assets/json/jobTypes.json5";
// @ts-ignore
import bathroomRefurbTypes from "../../../assets/json/bathroomRefurbishmentTypes.json5";
// @ts-ignore
import kitchenRefurbTypes from "../../../assets/json/kitchenRefurbishmentTypes.json5";
// @ts-ignore
import wallRefurbTypes from "../../../assets/json/wallRefurbishmentTypes.json5";
// @ts-ignore
import floorRefurbTypes from "../../../assets/json/floorRefurbishmentTypes.json5";
// @ts-ignore
import ceilingRefurbTypes from "../../../assets/json/ceilingRefurbishmentTypes.json5";
// @ts-ignore
import extensionTypes from "../../../assets/json/extensionTypes.json5";
// @ts-ignore
import loftConversionTypes from "../../../assets/json/loftConversionTypes.json5";
// @ts-ignore
import workDurationTypes from "../../../assets/json/workDurationTypes.json5";
// @ts-ignore
import reviewStoriesList from "../../../assets/json/reviewStories.json5";

export default async (data: any) => {
  const partialsFolder = data.partialsFolder.replaceAll("/", path.sep);

  const headerStr = fs.readFileSync(`${data.viewsFolder}/partials/header.ejs`, "ascii");
  const heroStr = fs.readFileSync(`${data.viewsFolder}/partials/index/hero.ejs`, "ascii");
  const footerStr = fs.readFileSync(`${data.viewsFolder}/partials/footer.ejs`, "ascii");
  const hiddenElementsStr = fs.readFileSync(`${data.viewsFolder}/partials/hidden.ejs`, "ascii");
  const contentStr = fs.readFileSync(`${data.viewsFolder}/pages/${data.page}.ejs`, "ascii");

  const webpackData = {
    // PUBLIC_URL: process.env.PUBLIC_URL_3 != null ? (process.env.PUBLIC_URL_2 as any).value : "-",

    // @ts-ignore
    publicUrl: PUBLIC_URL,
    // @ts-ignore
    webpackMode: WEBPACK_MODE,
  };

  // const webData = {
  //   quoteType: 'test', // request query paramater value - not possible
  // };

  // page data
  const contentData =
    data.page === "calculate" || data.page === "calculate-all"
      ? {
          // calculate page data
          ...data, // title, page, viewsFolder, partialsFolder
          ...webpackData,
          // ...webData,
          partialsFolder,

          jobTypes,
          bathroomRefurbTypes,
          kitchenRefurbTypes,
          wallRefurbTypes,
          floorRefurbTypes,
          ceilingRefurbTypes,
          extensionTypes,
          loftConversionTypes,
          workDurationTypes,
          // PUBLIC_URL: process.env.PUBLIC_URL,
          // PUBLIC_URL_1: data.PUBLIC_URL_1,
        }
      : {
          ...data,
          ...webpackData,
          // ...webData,
          partialsFolder,

          reviewStoriesList
        };

  const ejsTemplateStr = fs.readFileSync(`${data.viewsFolder}/layouts/template.ejs`, "ascii");
  const ejsTemplate = ejs.compile(ejsTemplateStr, { beautify: true, strict: false, async: true, rmWhitespace: true, client: true, root: data.viewsFolder });

  return ejsTemplate({
    ...data,
    ...webpackData,

    hdr: ejs.compile(headerStr, { beautify: false })(),
    hro: !(data.page === "calculate" || data.page === "calculate-all") ? ejs.compile(heroStr, { beautify: false })() : "",
    cnt: ejs.compile(contentStr, { beautify: false })(data.page === "calculate" || data.page === "calculate-all" ? contentData : { partialsFolder, reviewStoriesList }),
    ftr: ejs.compile(footerStr, { beautify: false })({ year: new Date().getFullYear() }),
    hdn: data.page === "calculate" || data.page === "calculate-all" ? ejs.compile(hiddenElementsStr, { beautify: false })() : "",
  });
};
