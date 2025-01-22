/** @format */

// Template wrapper

import * as fs from "fs";
import ejs from "ejs";

// @ts-ignore
// import ejsTemplate from "../../../views/layouts/template.ejs";
// import { value as ejsTemplate } from "../../../views/layouts/template.ejs";
// @ts-ignore
// import ejsTemplateStr from "../../../views/layouts/template.ejs";

export default async (data: any) => {
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

  const headerStr = fs.readFileSync(`${data.viewsFolder}/partials/header.ejs`, 'ascii');
  const heroStr = fs.readFileSync(`${data.viewsFolder}/partials/index/hero.ejs`, 'ascii');
  const footerStr = fs.readFileSync(`${data.viewsFolder}/partials/footer.ejs`, 'ascii');
  const contentStr = fs.readFileSync(`${data.viewsFolder}/pages/${data.page}.ejs`, 'ascii');

  const ejsTemplateStr = fs.readFileSync(`${data.viewsFolder}/layouts/template.ejs`, 'ascii');
  const ejsTemplate = ejs.compile(ejsTemplateStr, { beautify: true, root: data.viewsFolder });

  const partialsFolder = `${data.viewsFolder.replaceAll('/', '\\')}\\partials`;
  return ejsTemplate({
    ...data,
    partialsFolder,
    // 'title': 'test',
    // 'page': `${data.viewsFolder}/pages/index.ejs`,
    // cnt: "<h1>test</h1>",

    hdr: ejs.compile(headerStr, { beautify: true })({ ...data, partialsFolder }),
    hro: !(data.page === "calculate") ? ejs.compile(heroStr, { beautify: true })({ ...data, partialsFolder }) : "",
    cnt: ejs.compile(contentStr, { beautify: true })({ ...data, partialsFolder }),
    ftr: ejs.compile(footerStr, { beautify: true })({ ...data, partialsFolder })
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
