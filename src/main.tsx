import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <Provider store={store}>   {/* App ichidagi componentlar Redux Store'dan foydalana oladi */}
   <BrowserRouter>            {/* App ichidagi componentlar URL va routingdan foydalana oladi */}
    <App/>
   </BrowserRouter>
   </Provider>
  </StrictMode>,
)

