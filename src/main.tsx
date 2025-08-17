import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from '@/App'
import Home from '@/pages/Home'
import Recipe from '@/pages/Recipe'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/recipe/:id" element={<Recipe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
