const fs = require('fs');
const fm = require('front-matter');
const md = require('markdown-it')('commonmark');

const postTemplate = require('./template/post');


fs.readdirSync('./posts')
  .map(postPath => {
    const rawText = fs.readFileSync(`./posts/${postPath}`, "utf8");
    const content = fm(rawText);
    content.body = md.render(content.body);
    content.path = postPath;
    return content;
  })
  .forEach(post => {
    const postDir = `./public/blog/${post.path.slice(0, -3)}`;
    if (!fs.existsSync(postDir)) {
      console.log(post.attributes.title + ' doesnt exist');
      fs.mkdirSync(postDir);
    }
    const postHTML = postTemplate(post);
    fs.writeFileSync(`${postDir}/index.html`, postHTML);
  });
  

