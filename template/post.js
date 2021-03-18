function postTemplate(post) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Matthew Fan's Blog</title>
      <meta name="keywords" content="blog, matthew fan">
      <meta name="description" content="Matthew Fan's blog">
      <meta name="author" content="Matthew Fan">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="../assets/index.css">
      <link rel="icon" href="../assets/turtle.png">
    </head>
    <body class="light">
      <div class="main">
        <div class="header">
          <a class="selected" href="../">blog</a>
          <a href="../about">about</a>
        </div>

        <div class="content">
          <div class="row">
            <div class="title-section">
              <h3 class="title"><a href='./'>${post.attributes.title}</a></h3>
              <div>${post.attributes.date}</div>
            </div>
            <div class="description">
              ${post.attributes.description}
            </div>
          </div>
          <div class="body">
            ${post.body}
          </div>
        </div>

        ${post.attributes.related_content ? `
          <div class="related-content">
            <h3>related content</h3>
            <ul>
              ${post.attributes.related_content.map(related => `
                <li>
                  <a href="${related.url}">${related.name}</a>
                  ${related.description ? `- ${related.description}` : ""}
                </li>
              `).join("")}
            </ul>
          </div>
        `: ""}
      </div>
    </body>
  </html>
  `
}


module.exports = postTemplate;