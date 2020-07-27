const fs = require('fs');
const fm = require('front-matter');
const md = require('markdown-it')('commonmark');


posts = fs.readdirSync('./posts')
  .map(postPath => {
    const rawText = fs.readFileSync(`./posts/${postPath}`, "utf8");
    const content = fm(rawText);
    content.body = md.render(content.body);
    content.path = postPath;
    return content;
  })
  .forEach(post => {
    const postDir = post.path.slice(0, -3);
    if (fs.existsSync(`./public/${postDir}`)) {
      console.log('exists');
    } else {
      console.log('doesnt exist');
    }
  });
  

