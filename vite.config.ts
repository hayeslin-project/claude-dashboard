import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const CLAUDE_DIR = '/Users/hayeslin/.claude'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'claude-data',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/')) {
            const filePath = path.join(CLAUDE_DIR, req.url.replace('/api/', ''))
            const stat = fs.statSync(filePath)
            if (stat.isDirectory()) {
              const files = fs.readdirSync(filePath)
              const html = files.map(f => `<a href="${f}">${f}</a>`).join('\n')
              res.setHeader('Content-Type', 'text/html')
              res.end(html)
              return
            } else if (stat.isFile()) {
              const ext = path.extname(filePath)
              const contentType = ext === '.json' || ext === '.jsonl' ? 'application/json' : 'text/plain'
              res.setHeader('Content-Type', contentType)
              res.end(fs.readFileSync(filePath))
              return
            }
          }
          next()
        })
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
})
