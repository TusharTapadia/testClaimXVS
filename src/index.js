import React from "react"
import ReactDOM from "react-dom/client"
import "./styles/index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

import { GlobalContextProvider } from "./context/GlobalContext/GlobalContext"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <GlobalContextProvider>
            <App />
        </GlobalContextProvider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals()
