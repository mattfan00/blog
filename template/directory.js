function directoryTemplate(posts) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Matthew Fan's Blog</title>
      <link rel="stylesheet" href="./assets/index.css">
      <link rel="icon" href="./assets/turtle.png">
      <script defer src="./assets/index.js"></script>
    </head>
    <body>
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
              <div class="title-section">
                <h2><a href='./${post.path.slice(0, -3)}'>${post.attributes.title}</a></h2>
                <div>${post.attributes.date}</div>
              </div>
              <div class="description">
                ${post.attributes.description}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </body>
  </html>
  `

}

module.exports = directoryTemplate;