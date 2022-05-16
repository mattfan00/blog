import fs from "fs"
import path from "path"
import fm from "front-matter"
import MarkdownIt from "markdown-it"
import Handlebars, { template } from "handlebars"
import * as constants from "./constants"

const md = new MarkdownIt("commonmark")

// const postTemplate = Handlebars.compile(fs.readFileSync("./template/post.html", "utf8"))
// const directoryTemplate = Handlebars.compile(fs.readFileSync("./template/directory.html", "utf8"))
// const aboutTemplate = Handlebars.compile(fs.readFileSync("./template/about.html", "utf8"))

Handlebars.registerHelper('slicePath', function (str) {
  return str.slice(0, -3)
})

interface ContentAttributes {
  title: string
  date?: string
  layout: string
}

// create public folder
if (fs.existsSync(constants.PATH_PUBLIC))
  fs.rmSync(constants.PATH_PUBLIC, { recursive: true })
fs.mkdirSync(constants.PATH_PUBLIC)

// create assets folder
const copyFolderSync = (from: string, to: string) => {
  fs.mkdirSync(to)
  fs.readdirSync(from).forEach(element => {
      if (fs.lstatSync(path.join(from, element)).isFile()) {
          fs.copyFileSync(path.join(from, element), path.join(to, element))
      } else {
          copyFolderSync(path.join(from, element), path.join(to, element))
      }
  })
}

copyFolderSync(constants.PATH_ASSETS, constants.PATH_PUBLIC_ASSETS)

// create templates
const templates: Record<string, HandlebarsTemplateDelegate> = {}
fs.readdirSync(constants.PATH_TEMPLATES).forEach(element => {
  const templatePath = path.join(constants.PATH_TEMPLATES, element)
  if (fs.lstatSync(templatePath).isFile() && path.extname(element) === ".html") {
      const elementName = path.parse(element).name
      templates[elementName] = Handlebars.compile(fs.readFileSync(templatePath, "utf8"))
  }
})

// convert the markdown files in content to public
const convertContentToPublic = (from: string, to: string) => {
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile() && path.extname(element) === ".md") {
      const rawText = fs.readFileSync(path.join(from, element), "utf8")
      const content = fm<ContentAttributes>(rawText)

      const contentHTML = templates[content.attributes.layout]({
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
    } else {
      fs.mkdirSync(path.join(to, element))
      convertContentToPublic(path.join(from, element), path.join(to, element))
    }
  })
}

convertContentToPublic(constants.PATH_CONTENT, constants.PATH_PUBLIC)


// // create posts
// const posts = fs.readdirSync(constants.PATH_CONTENT)
//   .filter(postPath => postPath !== "about.md")
//   .map(postPath => {
//     const rawText = fs.readFileSync(`${constants.PATH_CONTENT}/${postPath}`, "utf8")
//     const content = fm<ContentAttributes>(rawText)

//     return {
//       ...content,
//       body: md.render(content.body),
//       path: postPath
//     }
//   })
//   .map(post => {
//     const postDir = `${constants.PATH_PUBLIC}/${post.path.slice(0, -3)}`
//     if (!fs.existsSync(postDir)) {
//       console.log(post.attributes.title + " doesnt exist")
//       fs.mkdirSync(postDir)
//     }
//     const postHTML = postTemplate(post)
//     fs.writeFileSync(`${postDir}/index.html`, postHTML)

//     return post
//   })

// // create home directory
// const sortedPosts = posts.sort((a, b) => {
//   return new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime()
// })
// const directoryHTML = directoryTemplate({posts: sortedPosts})
// fs.writeFileSync(`${constants.PATH_PUBLIC}/index.html`, directoryHTML)

// // create about page
// const aboutPosts = fs.readdirSync(constants.PATH_CONTENT)
//   .filter(postPath => postPath === "about.md")
//   .map(postPath => {
//     const rawText = fs.readFileSync(`${constants.PATH_CONTENT}/${postPath}`, "utf8")
//     const content = fm<ContentAttributes>(rawText)

//     return {
//       ...content,
//       body: md.render(content.body),
//       path: postPath
//     }
//   })

// const aboutPost = aboutPosts[0]

// const aboutDir = `${constants.PATH_PUBLIC}/about`;
// if (!fs.existsSync(aboutDir)) {
//   fs.mkdirSync(aboutDir)
// }

// const aboutHTML = aboutTemplate(aboutPost)
// fs.writeFileSync(`${constants.PATH_PUBLIC}/about/index.html`, aboutHTML)