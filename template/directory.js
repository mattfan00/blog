function directoryTemplate(posts) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Matthew Fan's Blog</title>
      <link rel="stylesheet" href="./assets/index.css">
      <link rel="icon" href="./assets/turtle.png">
    </head>
    <body class="light">
      <div class="main">
        <div class="theme-switcher">
          <label class="switch" for="checkbox">
            <input type="checkbox" id="checkbox" />
            <div class="slider round"></div>
          </label>
        </div>
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

      <script src="./assets/index.js"></script>
    </body>
  </html>
  `

}

module.exports = directoryTemplate;