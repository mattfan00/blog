import path from "path"
import * as file from "./utils/file"
import * as constants from "./utils/constants"
import {
  SiteInfo,
  Info,
  Site,
} from "./utils/types"

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

export const process = (siteInfo: SiteInfo): Site => {
  const assets = siteInfo.assets.map(asset => {
    const parsedPath = path.parse(asset.path)
    return {
      path: path.join("/", constants.ASSETS, asset.path),
      name: parsedPath.name,
      base: parsedPath.base,
      ext: parsedPath.ext
    }
  })

  return {}
}

