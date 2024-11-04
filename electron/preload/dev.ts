import { ipcRenderer } from "electron"

export function openDevTools() {
    ipcRenderer.send("openDevTools")
}