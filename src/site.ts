import path from "path"
import fm from "front-matter"
import MarkdownIt from "markdown-it"
import Handlebars, { Template } from "handlebars"
import * as file from "./utils/file"
import * as constants from "./utils/constants"
import {
  SiteInfo,
  Info,
  Site,
  Asset,
  Page,
  TemplateMap
} from "./utils/types"

const md = new MarkdownIt("commonmark")

export const read = (): SiteInfo => {
  const assets: Info[]  = file.within(constants.PATH_ASSETS, () => file.readFolderRecursive("."))
    .map(p => {
      return {
        dir: constants.PATH_ASSETS,
        path: p,
      }
    })

  const templates: Info[] = file.within(constants.PATH_TEMPLATES, () => file.readFolderRecursive("."))
    .filter(p => path.extname(p) === ".html")
    .map(p => {
      const dir = constants.PATH_TEMPLATES
      return {
        dir: dir,
        path: p,
        rawContent: file.readFile(path.join(dir, p))
      }
    })

  // templatePaths.forEach(p => {
  //   const templateName = path.parse(p).name
  //   templates.set(templateName, Handlebars.compile(file.readFile(path.join(constants.PATH_TEMPLATES, p))))
  // })

  const pages: Info[] = file.within(constants.PATH_PAGES, () => file.readFolderRecursive("."))
    .map(p => {
      const dir = constants.PATH_PAGES
      return {
        dir: dir,
        path: p,
        rawContent: file.readFile(path.join(dir, p))
      }
    })

  return {
    assets,
    templates,
    pages
  }
}

export const process = (siteInfo: SiteInfo) => {
  const assets: Asset[]= siteInfo.assets.map(asset => {
    const parsedPath = path.parse(asset.path)
    return {
      path: path.join("/", constants.ASSETS, asset.path),
      name: parsedPath.name,
      base: parsedPath.base,
      ext: parsedPath.ext
    }
  })

  const pages = siteInfo.pages.map(page => {
    const parsedPath = path.parse(page.path)
    const parsedContent = fm<any>(page.rawContent!)

    const newPage: Page = {
      path: path.join("/", constants.PAGES, page.path),
      name: parsedPath.name,
      base: parsedPath.base,
      excerpt: parsedContent.body,
      ...parsedContent.attributes
    }

    return newPage
  })

  const site: Site = {
    assets,
    pages
  }

  const templates: TemplateMap = new Map();
  siteInfo.templates.forEach(template => {
    const templateName = path.parse(template.path).name
    templates.set(templateName, Handlebars.compile(file.readFile(path.join(constants.PATH_TEMPLATES, template.path))))
  })

  return {
    site,
    templates
  }
}

export const generate = (site: Site, templates: TemplateMap) => {

}

