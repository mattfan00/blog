function directoryTemplate(posts) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Matthew Fan's Blog</title>
      <meta name="keywords" content="blog, matthew fan">
      <meta name="description" content="Matthew Fan's blog">
      <meta name="author" content="Matthew Fan">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="./assets/index.css">
      <link rel="icon" href="./assets/turtle.png">
    </head>
    <body class="light">
      <div class="main">
        <div class="header">
          <a class="selected" href="./">blog</a>
          <a href="./about">about</a>
        </div>

        <div class="directory">
          ${posts.map(post => `
            <div class="row">
              <a class="plain" href='./${post.path.slice(0, -3)}'>
                <div class="title-section">
                  <div class="title">${post.attributes.title}</div>
                  <div>${post.attributes.date}</div>
                </div>
              </a>
            </div>
          `).join("")}
        </div>
      </div>
    </body>
  </html>
  `

}

module.exports = directoryTemplate;