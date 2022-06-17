import fs from "fs"
import path from "path"

export const createFolder = (path: string, recursive?: boolean) => {
  if (fs.existsSync(path))
    fs.rmSync(path, { recursive: true })
  fs.mkdirSync(path)
}

export const isFile = (path: string) => {
  return fs.lstatSync(path).isFile()
}

export const readFile = (path: string, encoding?: BufferEncoding) => {
  return fs.readFileSync(path, encoding ? encoding : "utf8")
}

export const readFolderRecursive = (folder: string, files?: string[]): string[] => {
  files = files || []

  fs.readdirSync(folder).forEach(element => {
    const elementPath = path.join(folder, element)
    if (isFile(elementPath))
      files!.push(elementPath)
    else
      readFolderRecursive(elementPath, files)
  })

  return files
}

export const within = <T>(path: string, callback: () => T) => {
  const currentPath = process.cwd()

  process.chdir(path)
  const returnValue = callback()
  process.chdir(currentPath)

  return returnValue
}
