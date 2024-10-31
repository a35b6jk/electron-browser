import { ipcRenderer } from 'electron'
import { withPrototype } from './util'

export default withPrototype(ipcRenderer)