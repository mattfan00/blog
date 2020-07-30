function postTemplate(post) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="stylesheet" href="../assets/index.css">
    </head>
    <body>
      <div class="main">
        <div class="header">
          Blog | About
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