import * as site from "./site"

const start = () => {
  const newSite = site.read()
  site.generate(newSite)
}

start()