import fs from "fs"
import path from "path"
import fm from "front-matter"
import MarkdownIt from "markdown-it"
import Handlebars from "handlebars"
import * as file from "./utils/file"
import * as constants from "./utils/constants"

const md = new MarkdownIt("commonmark")

Handlebars.registerHelper('slicePath', function (str) {
  return str.slice(0, -3)
})


interface ContentAttributes {
  title: string
  date?: string
  layout: string
}

interface Site {
  assets: Asset[],
  pages: Page[]
}

interface Asset {
  path: string
  base: string
  name: string
  ext: string
}

interface Page {
  path: string
  md: string
}

const templates: Map<string, HandlebarsTemplateDelegate> = new Map()
const assets: Asset[] = []
const pages: Page[] = []

// convert the markdown files in content to public
const convertContentToPublic = (from: string, to: string) => {
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile() && path.extname(element) === ".md") {
      const rawText = file.readFile(path.join(from, element))
      const content = fm<ContentAttributes>(rawText)

      const template = templates.get(content.attributes.layout)
      if (template) {
        const contentHTML = template({
          ...content,
          body: md.render(content.body),
          path: element
        })

        const elementName = path.parse(element).name
        if (elementName === "index") {
          fs.writeFileSync(path.join(to, "index.html"), contentHTML)
        } else {
          const newContentDirectory = path.join(to, elementName)
          fs.mkdirSync(newContentDirectory)
          fs.writeFileSync(path.join(newContentDirectory, "index.html"), contentHTML)
        }
      }

    } else {
      fs.mkdirSync(path.join(to, element))
      convertContentToPublic(path.join(from, element), path.join(to, element))
    }
  })
}

// read assets
const assetPaths = file.within(constants.PATH_ASSETS, () => file.readFolderRecursive("."))
assetPaths.forEach(p => {
  assets.push({
    path: path.join(constants.PATH_ASSETS, p),
    name: p,
    base: path.basename(p),
    ext: path.extname(p)
  })
})

// read templates
const templatePaths = file.within(constants.PATH_TEMPLATES, () => file.readFolderRecursive("."))
  .filter(p => path.extname(p) === ".html")

templatePaths.forEach(p => {
  const templateName = path.parse(p).name
  templates.set(templateName, Handlebars.compile(file.readFile(path.join(constants.PATH_TEMPLATES, p))))
})

// read pages
const pagePaths = file.within(constants.PATH_PAGES, () => file.readFolderRecursive("."))
pagePaths.forEach(p => {
  const pagePath = path.join(constants.PATH_PAGES, p)
  pages.push({
    path: pagePath,
    md: file.readFile(pagePath)
  })
})



// // create public folder
// file.createFolder(constants.PATH_PUBLIC)

// // create assets folder in public
// file.copyFolder(constants.PATH_ASSETS, constants.PATH_PUBLIC_ASSETS)

// convertContentToPublic(constants.PATH_CONTENT, constants.PATH_PUBLIC)
