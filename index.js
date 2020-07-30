const fs = require('fs');
const fm = require('front-matter');
const md = require('markdown-it')('commonmark');

const postTemplate = require('./template/post');
const directoryTemplate = require('./template/directory');


// create posts
posts = fs.readdirSync('./posts')
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
const directoryHTML = directoryTemplate(posts);
fs.writeFileSync('./public/index.html', directoryHTML);