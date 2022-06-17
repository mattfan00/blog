import path from "path"
import fm from "front-matter"
import MarkdownIt from "markdown-it"
import Handlebars, { parse } from "handlebars"
import * as file from "./utils/file"
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
      const parsedPath = path.parse(p)
      return {
        dir: constants.PATH_ASSETS,
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
      const parsedContent = fm<PageRequiredAttributes>(rawContent)

      const { title, date, ...restAttributes } = parsedContent.attributes

      if (!title || !date)
        throw new Error(`Required attribute missing from ${fullPath}`)

      return {
        dir: dir,
        pathRelative: p,
        name: parsedPath.name,
        base: parsedPath.base,
        ext: parsedPath.ext,
        rawContent: rawContent,
        excerpt: parsedContent.body,
        title: title,
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
}

