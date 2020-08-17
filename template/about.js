function aboutTemplate(post) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Matthew Fan's Blog</title>
      <link rel="stylesheet" href="../assets/index.css">
      <link rel="icon" href="../assets/turtle.png">
    </head>
    <body>
      <div class="main">
        <div class="header">
          <a href="../">Blog</a> 
          <a class="selected" href="../about">About</a>
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