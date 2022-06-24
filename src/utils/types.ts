export interface SiteInfo {
  assets: Info[]
  templates: Info[]
  pages: Info[]
}

export interface Info {
  // base directory
  dir: string
  // path of file relative to the base directory
  path: string
  rawContent?: string
}

export interface Site {
  assets: Asset[]
  pages: Page[]
  templates: TemplateMap
}

interface Base {
  path: string
  // base directory
  dir: string
  // path of file relative to the base directory
  pathRelative: string
  rawContent?: string
  name: string
  base: string
  ext: string
}

export interface Asset extends Base {}

export interface PagePredefinedAttributes{
  title: string
  layout: string
  date: string
  categories: string[]
}

export interface Page extends Base, PagePredefinedAttributes {
  excerpt: string
  attributes: object
}


export type TemplateMap = Map<string, HandlebarsTemplateDelegate>