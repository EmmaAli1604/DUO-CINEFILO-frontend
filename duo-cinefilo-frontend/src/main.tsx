/**
 * main.tsx
 *
 * Punto de entrada de la aplicación React. Renderiza el componente raíz `<App />`
 * dentro del elemento HTML principal.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(

    /**
   * `<React.StrictMode>` ayuda a detectar prácticas inseguras,
   * renderizados múltiples involuntarios y efectos secundarios.
   */
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)