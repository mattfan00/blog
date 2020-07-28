function postTemplate(post) {
  return `
    <!DOCTYPE>
    <html>
    <head>
      

    </head>
    <body>
      <h1>${post.attributes.title}</h1>
      <div>${post.attributes.date}</div>
      <div class="content">
        ${post.body}
      </div>
    </html>
  `
}


module.exports = postTemplate;