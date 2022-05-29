import fs from "fs"
import path from "path"
import fm from "front-matter"
import MarkdownIt from "markdown-it"
import Handlebars from "handlebars"
import * as file from "./utils/file"
import * as site from "./site"

const md = new MarkdownIt("commonmark")

Handlebars.registerHelper('slicePath', function (str) {
  return str.slice(0, -3)
})

interface ContentAttributes {
  title: string
  date?: string
  layout: string
}

const templates: Map<string, HandlebarsTemplateDelegate> = new Map()

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


const start = () => {
  const siteInfo = site.read()
}

start()


// // create public folder
// file.createFolder(constants.PATH_PUBLIC)

// // create assets folder in public
// file.copyFolder(constants.PATH_ASSETS, constants.PATH_PUBLIC_ASSETS)

// convertContentToPublic(constants.PATH_CONTENT, constants.PATH_PUBLIC)
