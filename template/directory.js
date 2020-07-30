function directoryTemplate(posts) {
  return `
  <!DOCTYPE html>
  <html>
    <head>

      <link rel="stylesheet" href="./assets/index.css">
    </head>
    <body>
      <div class="main">
        <div class="header">
          Blog | About
        </div>

        <div class="directory">
          ${posts.map(post => `
            <div class="row">
              <a href='/public/${post.path.slice(0, -3)}'>${post.attributes.title}</a>
              <div>${post.attributes.date}</div>
            </div>
          `)}
        </div>
      </div>
    </body>
  </html>
  `

}

module.exports = directoryTemplate;