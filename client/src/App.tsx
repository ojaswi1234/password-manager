import { ThemeProvider } from "./components/theme-provider"
import AppRoutes from "./routes/routes"



function App() {
  return (
    <ThemeProvider>
    <div className="overflow-hidden">
     
      {/* Render the routes */}
      <AppRoutes />
    </div>
    </ThemeProvider>
  )
}

export default App