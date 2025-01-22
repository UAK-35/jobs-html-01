/** @format */

// Template wrapper

import fs from "fs";
import path from "path";

import ejs from "ejs";

// @ts-ignore
// import ejsTemplate from "../../../views/layouts/template.ejs";
// import { value as ejsTemplate } from "../../../views/layouts/template.ejs";
// @ts-ignore
// import ejsTemplateStr from "../../../views/layouts/template.ejs";

export default async (data: any) => {
  const jobTypes = [
    {
      title: "Bathroom Refurbishment",
      value: "Bathroom Refurbishment",
    },
    {
      title: "Kitchen Refurbishment",
      value: "Kitchen Refurbishment",
    },
    {
      title: "Walls",
      value: "Walls Refurbishment",
    },
    {
      title: "Floor",
      value: "Floor Refurbishment",
    },
    {
      title: "Ceiling",
      value: "Ceiling Refurbishment",
    },
    {
      title: "Extensions",
      value: "Extensions",
    },
    {
      title: "Loft Conversion",
      value: "Loft Conversion",
    }
  ];
  const bathroomRefurbTypes = [
    {
      title: "Remove Bathtub",
      defaultQuantity: 1,
      units: "p",
      pricePounds: 120,
    },
    {
      title: "Install Bathtub",
      defaultQuantity: 1,
      units: "p",
      pricePounds: 400,
    },
  ];
  const kitchenRefurbTypes = [
    {
      title: "Remove Wall Cabinets",
      defaultQuantity: 12,
      units: "p",
      pricePounds: 20,
    },
    {
      title: "Install Wall Cabinets",
      defaultQuantity: 12,
      units: "p",
      pricePounds: 95,
    },
  ];
  const wallRefurbTypes = [
    {
      title: "Wall Removing",
      defaultQuantity: 20,
      units: "sqm",
      pricePounds: 70,
    },
    {
      title: "Painting",
      defaultQuantity: 20,
      units: "sqm",
      pricePounds: 10,
    },
  ];
  const floorRefurbTypes = [
    {
      title: "Floor Tiling",
      defaultQuantity: 5,
      units: "sqm",
      pricePounds: 70,
    },
    {
      title: "Laminate",
      defaultQuantity: 15,
      units: "sqm",
      pricePounds: 30,
    },
  ];
  const ceilingRefurbTypes = [
    {
      title: "Ceiling Removal",
      defaultQuantity: 12,
      units: "sqm",
      pricePounds: 30,
    },
    {
      title: "Painting",
      defaultQuantity: 12,
      units: "sqm",
      pricePounds: 10,
    },
  ];
  const extensionTypes = [
    {
      title: "Extension",
      defaultQuantity: 1,
      units: "sqm",
      pricePounds: 1600,
    },
  ];
  const loftConversionTypes = [
    {
      title: "Loft Conversion",
      defaultQuantity: 1,
      units: "sqm",
      pricePounds: 1200,
    },
  ];
  const workDurationTypes = [
    {
      title: "2 - 5 days",
      code: "2to5d",
    },
    {
      title: "< 2 weeks",
      code: "l2w",
    },
    {
      title: "< 4 weeks",
      code: "l4w",
    },
    {
      title: "Other time",
      code: "ot",
    },
    {
      title: "I'm flexible",
      code: "flex",
    },
  ];

  // console.error('template-data', data);

  // return require("../../../views/layouts/template.ejs")({
  //   ...data,
  //   cnt: require(`../../../views/pages/${data.page}.ejs`)(data),
  // });

  // return require(`${data.viewsFolder}/layouts/template.ejs`)({
  //   ...data,
  //   cnt: require(`${data.viewsFolder}/pages/${data.page}.ejs`)(data),
  // });

  // return ejsTemplate({
  //   ...data,
  //   cnt: require(`${data.viewsFolder}/pages/${data.page}.ejs`)(data),
  // });

  // const ejsTemplate = ejs.compile(ejsTemplateStr.value);
  // console.error('ejsTemplateStr1', ejsTemplateStr);

  // const partialsFolder = `${data.viewsFolder.replaceAll("/", "\\")}\\partials`;
  const partialsFolder = data.partialsFolder.replaceAll("/", path.sep);

  const headerStr = fs.readFileSync(`${data.viewsFolder}/partials/header.ejs`, "ascii");
  const heroStr = fs.readFileSync(`${data.viewsFolder}/partials/index/hero.ejs`, "ascii");
  const footerStr = fs.readFileSync(`${data.viewsFolder}/partials/footer.ejs`, "ascii");
  const contentStr = fs.readFileSync(`${data.viewsFolder}/pages/${data.page}.ejs`, "ascii");

  // page data
  const contentData =
    data.page === "calculate"
      ? {
          // calculate page data
          ...data, // title, page, viewsFolder, partialsFolder
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
        }
      : {
          ...data,
          partialsFolder,
        };

  const ejsTemplateStr = fs.readFileSync(`${data.viewsFolder}/layouts/template.ejs`, "ascii");
  const ejsTemplate = ejs.compile(ejsTemplateStr, { beautify: true, strict: false, async: true, rmWhitespace: true, client: true, root: data.viewsFolder });

  return ejsTemplate({
    ...data,
    partialsFolder,
    // 'title': 'test',
    // 'page': `${data.viewsFolder}/pages/index.ejs`,
    // cnt: "<h1>test</h1>",

    hdr: ejs.compile(headerStr, { beautify: true })({ ...data, partialsFolder }),
    hro: !(data.page === "calculate") ? ejs.compile(heroStr, { beautify: true })({ ...data, partialsFolder }) : "",
    cnt: ejs.compile(contentStr, { beautify: true })(contentData),
    ftr: ejs.compile(footerStr, { beautify: true })({ ...data, partialsFolder, year: new Date().getFullYear() }),
  });
  // return ejs.render(ejsTemplateStr, {
  //   ...data,
  //   cnt: ejs.render(contentStr, data),
  // });

  // return ejs.renderFile(`${data.viewsFolder}/layouts/template.ejs`, {
  //   ...data,
  //   cnt: "<h1>test</h1>",
  // }/*, (err, str) => {
  //   console.error('err', err);
  //   console.error('str', str);
  // }*/);

  // return ejs.render(ejsTemplateStr, {
  //   ...data,
  //   cnt: "<h1>test</h1>",
  // }/*, (err, str) => {
  //   console.error('err', err);
  //   console.error('str', str);
  // }*/);

  // const ejsTemplate = await import("../../../views/layouts/template.ejs");
  // const content = await import(`../../../views/pages/${data.page}.ejs`);
  // const ejsTemplate = await import(`${data.viewsFolder}/layouts/template.ejs`);
  // const content = await import(`${data.viewsFolder}/pages/${data.page}.ejs`);
  // return ejsTemplate({
  //   ...data,
  //   cnt: content,
  // });
};
