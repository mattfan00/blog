import fs from "fs"
import * as file from "./utils/file"
import path from "path"
import fm from "front-matter"
import MarkdownIt from "markdown-it"
import Handlebars from "handlebars"
import * as constants from "./constants"

const md = new MarkdownIt("commonmark")

Handlebars.registerHelper('slicePath', function (str) {
  return str.slice(0, -3)
})

type TemplateMap = Map<string, HandlebarsTemplateDelegate>

interface ContentAttributes {
  title: string
  date?: string
  layout: string
}
  // create templates
  const templates: TemplateMap = new Map()
  fs.readdirSync(constants.PATH_TEMPLATES).forEach(element => {
    const templatePath = path.join(constants.PATH_TEMPLATES, element)
    if (fs.lstatSync(templatePath).isFile() && path.extname(element) === ".html") {
        const elementName = path.parse(element).name
        templates.set(elementName, Handlebars.compile(file.readFile(templatePath)))
    }
  })


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
  // create public folder
  file.createFolder(constants.PATH_PUBLIC)

  // // create assets folder in public
  file.copyFolder(constants.PATH_ASSETS, constants.PATH_PUBLIC_ASSETS)

  convertContentToPublic(constants.PATH_CONTENT, constants.PATH_PUBLIC)
}

start()
