function postTemplate(post) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Matthew Fan's Blog</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="../assets/index.css">
      <link rel="icon" href="../assets/turtle.png">
      <script defer src="../assets/index.js"></script>
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
          <a class="selected" href="../">blog</a>
          <a href="../about">about</a>
        </div>

        <div class="content">
          <div class="title-section">
            <h2><a href='./'>${post.attributes.title}</a></h2>
            <div>${post.attributes.date}</div>
          </div>
          ${post.body}
        </div>
      </div>
    </body>
  </html>
  `
}


module.exports = postTemplate;