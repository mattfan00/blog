import fs from "fs"
import fm from "front-matter"
import MarkdownIt from "markdown-it"
import Handlebars from "handlebars"

const md = new MarkdownIt("commonmark")

const postTemplate = Handlebars.compile(fs.readFileSync("./template/post.html", "utf8"))
const directoryTemplate = Handlebars.compile(fs.readFileSync("./template/directory.html", "utf8"))
const aboutTemplate = Handlebars.compile(fs.readFileSync("./template/about.html", "utf8"))

Handlebars.registerHelper('slicePath', function (str) {
  return str.slice(0, -3)
})

interface ContentAttributes {
  title: string
  date: string
}

// create posts
const posts = fs.readdirSync("./posts")
  .filter(postPath => postPath !== "about.md")
  .map(postPath => {
    const rawText = fs.readFileSync(`./posts/${postPath}`, "utf8")
    const content = fm<ContentAttributes>(rawText)

    return {
      ...content,
      body: md.render(content.body),
      path: postPath
    }
  })
  .map(post => {
    const postDir = `./public/${post.path.slice(0, -3)}`
    if (!fs.existsSync(postDir)) {
      console.log(post.attributes.title + " doesnt exist")
      fs.mkdirSync(postDir)
    }
    const postHTML = postTemplate(post)
    fs.writeFileSync(`${postDir}/index.html`, postHTML)

    return post
  })

// create home directory
const sortedPosts = posts.sort((a, b) => {
  return new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime()
})
const directoryHTML = directoryTemplate({posts: sortedPosts})
fs.writeFileSync("./public/index.html", directoryHTML)

// create about page
const aboutPosts = fs.readdirSync("./posts")
  .filter(postPath => postPath === "about.md")
  .map(postPath => {
    const rawText = fs.readFileSync(`./posts/${postPath}`, "utf8")
    const content = fm<ContentAttributes>(rawText)

    return {
      ...content,
      body: md.render(content.body),
      path: postPath
    }
  })

const aboutPost = aboutPosts[0]

const aboutDir = "./public/about";
if (!fs.existsSync(aboutDir)) {
  fs.mkdirSync(aboutDir)
}

const aboutHTML = aboutTemplate(aboutPost)
fs.writeFileSync("./public/about/index.html", aboutHTML)