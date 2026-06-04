import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import '@/styles/demo.scss'

const renderApp = (rootElement: HTMLElement) =>
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

document.querySelectorAll<HTMLElement>('#root').forEach(renderApp)
