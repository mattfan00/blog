function directoryTemplate(posts) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Matthew Fan's Blog</title>
      <link rel="stylesheet" href="./assets/index.css">
      <link rel="icon" href="./assets/turtle.png">
    </head>
    <body>
      <div class="main">
        <div class="header">
          <a class="selected" href="./">blog</a> 
          <a href="./about">about</a>
        </div>

        <div class="directory">
          ${posts.map(post => `
            <div class="row">
              <a href='./${post.path.slice(0, -3)}'>${post.attributes.title}</a>
              <div>${post.attributes.date}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </body>
  </html>
  `

}

module.exports = directoryTemplate;