import YAML from "yaml"
import fs from 'fs'
import path from "path"

const configPath = path.resolve("extraResources/config/config.yaml")

// const file = await fs.readFile(configPath, 'utf8')

export const readConfig = function() {
    const file = fs.readFileSync(configPath, 'utf8')
    return YAML.parse(file)
}