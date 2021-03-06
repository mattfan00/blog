function aboutTemplate(post) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Matthew Fan's Blog</title>
      <link rel="stylesheet" href="../assets/index.css">
      <meta name="keywords" content="blog, matthew fan">
      <meta name="description" content="Matthew Fan's blog">
      <meta name="author" content="Matthew Fan">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" href="../assets/turtle.png">
    </head>
    <body class="light">
      <div class="main">
        <div class="header">
          <a href="../">blog</a>
          <a class="selected" href="../about">about</a>
        </div>

        <div class="content">
          ${post.body}
        </div>
      </div>
    </body>
  </html>
  `
}


module.exports = aboutTemplate;