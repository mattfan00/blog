function aboutTemplate(post) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Matthew Fan's Blog</title>
      <link rel="stylesheet" href="../assets/index.css">
      <link rel="icon" href="../assets/turtle.png">
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
          <a href="../">blog</a>
          <a class="selected" href="../about">about</a>
        </div>

        <div class="content">
          ${post.body}
        </div>
      </div>

      <script src="../assets/index.js"></script>
    </body>
  </html>
  `
}


module.exports = aboutTemplate;