import path from "path"
import fm from "front-matter"
import MarkdownIt from "markdown-it"
import nunjucks from "nunjucks"
import dayjs, { Dayjs } from "dayjs"
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

const nunjucksEnv = nunjucks.configure({ autoescape: false })

export const read = (): Site => {
  const assets: Asset[]  = file.within(constants.PATH_ASSETS, () => file.readDirRecursive("."))
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
  file.within(constants.PATH_TEMPLATES, () => file.readDirRecursive("."))
    .filter(p => path.extname(p) === ".html")
    .forEach(p => {
      const templateName = path.parse(p).name
      templates.set(
        templateName,
        nunjucks.compile(file.readFile(path.join(constants.PATH_TEMPLATES, p)), nunjucksEnv)
      )
    })

  const pages: Page[] = file.within(constants.PATH_PAGES, () => file.readDirRecursive("."))
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
        categories,
        ...restAttributes
      } = parsedContent.attributes

      if (!title || !layout)
        throw new Error(`Required attribute missing from '${fullPath}'`)

      if (!templates.get(layout))
        throw new Error(`Template '${layout}' in '${fullPath}' does not exist`)

      const dateObj = date ? dayjs(date) : dayjs(fs.statSync(fullPath).birthtime)

      return {
        path: fullPath,
        dir: dir,
        pathRelative: p,
        name: parsedPath.name,
        base: parsedPath.base,
        ext: parsedPath.ext,
        rawContent: rawContent,
        excerpt: parsedContent.body,
        url: path.join("/", parsedPath.dir,parsedPath.name),
        title: title,
        layout: layout,
        date: dateObj,
        categories: categories ? categories : file.listDirs(p),
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
  file.createDir(constants.PATH_PUBLIC)
  file.createDir(constants.PATH_PUBLIC_ASSETS)

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
    const generatedHTML = template.render({
      page: {
        title: page.title,
        layout: page.layout,
        date: page.date,
        categories: page.categories,
        content: md.render(page.excerpt),
        url: page.url,
        attributes: page.attributes
      },
      site: {
        assets: site.assets,
        pages: site.pages
          .sort((a, b)=> b.date.unix() - a.date.unix())
          .map(page => ({
            title: page.title,
            layout: page.layout,
            date: page.date,
            categories: page.categories,
            url: page.url
          }))
      }
    })

    fs.writeFileSync(path.join(destDir, "index.html"), generatedHTML)
  })
}

