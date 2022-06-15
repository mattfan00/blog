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
}

export interface Asset {
  path: string
  name: string
  base: string
  ext: string
}

export interface Page {
  path: string
  name: string
  base: string
  excerpt: string
  [propName: string]: any
}

export type TemplateMap = Map<string, HandlebarsTemplateDelegate>