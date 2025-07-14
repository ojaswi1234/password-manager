import NavBar from "./components/NavBar";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <>
    <ThemeProvider>
    <main className="w-screen min-h-screen bg-white dark:bg-zinc-900">
      <NavBar />
    </main>
    </ThemeProvider>
    </>
  )
}

export default App;
