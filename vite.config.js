import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readFileSync, mkdirSync, copyFileSync } from 'fs'

export default defineConfig({
  // GitHub Pages serves at /Portofolio/, Vercel serves at root
  base: process.env.VERCEL ? '/' : '/Portofolio/',
  plugins: [
    react(),
    {
      name: 'admin-html',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/Portofolio/admin' || req.url === '/Portofolio/admin/' || req.url === '/admin' || req.url === '/admin/') {
            const html = readFileSync(resolve(__dirname, 'admin/index.html'), 'utf-8')
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
            return
          }
          next()
        })
      },
      // Copy admin/index.html into dist/admin/ so /admin works in production
      closeBundle() {
        mkdirSync(resolve(__dirname, 'dist/admin'), { recursive: true })
        copyFileSync(resolve(__dirname, 'admin/index.html'), resolve(__dirname, 'dist/admin/index.html'))
      },
    },
  ],
})
