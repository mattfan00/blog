function postTemplate(post) {
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
          <a class="selected" href="../">blog</a> 
          <a href="../about">about</a>
        </div>

        <div class="content"> 
          <div class="title-section">
            <h2>${post.attributes.title}</h2>
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