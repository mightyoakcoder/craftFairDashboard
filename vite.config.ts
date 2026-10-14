import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DATA_DIR = path.resolve(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'inventory.json')

// Dev-only API that persists dashboard state to a local JSON file.
// Only runs under `vite`/`vite dev` (configureServer) — a static
// `vite build` output has no server behind it to handle these requests.
function inventoryFileApi(): Plugin {
  return {
    name: 'inventory-file-api',
    configureServer(server) {
      server.middlewares.use('/api/inventory', (req, res) => {
        if (req.method === 'GET') {
          readFile(DATA_FILE, 'utf-8')
            .then(raw => {
              res.setHeader('Content-Type', 'application/json')
              res.end(raw)
            })
            .catch(() => {
              res.statusCode = 204
              res.end()
            })
          return
        }

        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            mkdir(DATA_DIR, { recursive: true })
              .then(() => writeFile(DATA_FILE, body, 'utf-8'))
              .then(() => {
                res.statusCode = 204
                res.end()
              })
              .catch(err => {
                res.statusCode = 500
                res.end(String(err))
              })
          })
          return
        }

        res.statusCode = 405
        res.end()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inventoryFileApi()],
})
