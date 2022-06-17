import path from "path"
import fm from "front-matter"
import MarkdownIt from "markdown-it"
import Handlebars, { create, parse } from "handlebars"
import * as file from "./utils/file"
import fs from "fs"
import * as constants from "./utils/constants"
import {
  Site,
  Asset,
  Page,
  TemplateMap,
  PagePredefinedAttributes
} from "./utils/types"

const md = new MarkdownIt("commonmark")

export const read = (): Site => {
  const assets: Asset[]  = file.within(constants.PATH_ASSETS, () => file.readFolderRecursive("."))
    .map(p => {
      const dir = constants.PATH_ASSETS
      const parsedPath = path.parse(p)
      return {
        path: path.join(dir, p),
        dir: dir,
        pathRelative: p,
        name: parsedPath.name,
        base: parsedPath.base,
        ext: parsedPath.ext
      }
    })

  const templates: TemplateMap = new Map();
  file.within(constants.PATH_TEMPLATES, () => file.readFolderRecursive("."))
    .filter(p => path.extname(p) === ".html")
    .forEach(p => {
      const templateName = path.parse(p).name
      templates.set(
        templateName,
        Handlebars.compile(file.readFile(path.join(constants.PATH_TEMPLATES, p)))
      )
    })

  const pages: Page[] = file.within(constants.PATH_PAGES, () => file.readFolderRecursive("."))
    .map(p => {
      const dir = constants.PATH_PAGES
      const fullPath = path.join(dir, p)
      const rawContent = file.readFile(fullPath)
      const parsedPath = path.parse(p)
      const parsedContent = fm<PagePredefinedAttributes>(rawContent)

      const {
        title,
        layout,
        date,
        ...restAttributes
      } = parsedContent.attributes

      if (!title || !layout)
        throw new Error(`Required attribute missing from '${fullPath}'`)

      if (!templates.get(layout))
        throw new Error(`Template '${layout}' in '${fullPath}' does not exist`)

      return {
        path: fullPath,
        dir: dir,
        pathRelative: p,
        name: parsedPath.name,
        base: parsedPath.base,
        ext: parsedPath.ext,
        rawContent: rawContent,
        excerpt: parsedContent.body,
        title: title,
        layout: layout,
        date: date,
        attributes: restAttributes
      }
    })

  return {
    assets,
    templates,
    pages
  }
}

export const generate = (site: Site) => {
  file.createFolder(constants.PATH_PUBLIC)
  file.createFolder(constants.PATH_PUBLIC_ASSETS)

  site.assets.forEach(asset => {
    const destDir = path.join(constants.PATH_PUBLIC_ASSETS, path.parse(asset.pathRelative).dir)
    fs.mkdirSync(destDir, { recursive: true })
    fs.copyFileSync(asset.path, path.join(destDir, asset.base))
  })

  site.pages.forEach(page => {
    let destDir = path.join(constants.PATH_PUBLIC, path.parse(page.pathRelative).dir)
    if (page.name !== "index")
      destDir = path.join(destDir, page.name)
    fs.mkdirSync(destDir, { recursive: true })

    // template has to exist since we validate it when reading the page file
    const template = site.templates.get(page.layout)!
    const generatedHTML = template({
      page: {
        title: page.title,
        layout: page.layout,
        date: page.date,
        content: md.render(page.excerpt),
        attributes: page.attributes
      },
      site: {
        assets: site.assets,
        pages: site.pages.map(page => ({
          title: page.title,
          layout: page.layout,
          date: page.date,
        }))
      }
    })

    fs.writeFileSync(path.join(destDir, "index.html"), generatedHTML)
  })
}

