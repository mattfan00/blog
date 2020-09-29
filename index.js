const fs = require('fs');
const fm = require('front-matter');
const md = require('markdown-it')('commonmark');

const postTemplate = require('./template/post');
const directoryTemplate = require('./template/directory');
const aboutTemplate = require('./template/about');


// create posts
posts = fs.readdirSync('./posts')
  .filter(postPath => postPath !== "about.md")
  .map(postPath => {
    const rawText = fs.readFileSync(`./posts/${postPath}`, "utf8");
    const content = fm(rawText);
    content.body = md.render(content.body);
    content.path = postPath;
    return content;
  })
  .map(post => {
    const postDir = `./public/${post.path.slice(0, -3)}`;
    if (!fs.existsSync(postDir)) {
      console.log(post.attributes.title + ' doesnt exist');
      fs.mkdirSync(postDir);
    }
    const postHTML = postTemplate(post);
    fs.writeFileSync(`${postDir}/index.html`, postHTML);

    return post;
  });
  
// create home directory
sortedPosts = posts.sort((a, b) => {
  return new Date(b.attributes.date) - new Date(a.attributes.date);
})
const directoryHTML = directoryTemplate(sortedPosts);
fs.writeFileSync('./public/index.html', directoryHTML);

// create about page
aboutPosts = fs.readdirSync('./posts')
  .filter(postPath => postPath === "about.md")
  .map(postPath => {
    const rawText = fs.readFileSync(`./posts/${postPath}`, "utf8");
    const content = fm(rawText);
    content.body = md.render(content.body);
    content.path = postPath;
    return content;
  })

let aboutPost = aboutPosts[0]

const aboutDir = `./public/about`;
if (!fs.existsSync(aboutDir)) {
  fs.mkdirSync(aboutDir);
}

const aboutHTML = aboutTemplate(aboutPost)
fs.writeFileSync('./public/about/index.html', aboutHTML);