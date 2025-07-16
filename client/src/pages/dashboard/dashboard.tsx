
import { useState } from "react";
import NavBar from "../../components/NavBar";
import { ThemeProvider } from "../../components/theme-provider";

const DashBoard = () => {
  const [clicked, setClicked] = useState(false);
  const [DialogBox] = useState(() => import("../../components/DialogBox"));

  const dialogBoxHandler = () => {
    setClicked(true);
    const dialogBoxElement = document.createElement("div");
    dialogBoxElement.id = "dialog-box-root";
    document.body.appendChild(dialogBoxElement);
    import("../../components/DialogBox").then((module) => {
      const DialogBox = module.default;
      const dialogBoxRoot = document.getElementById("dialog-box-root");
      if (dialogBoxRoot) {
        dialogBoxRoot.innerHTML = "";
        // Use ReactDOM to render the DialogBox component
        import("react-dom/client").then((reactDom) => {
          const root = reactDom.createRoot(dialogBoxRoot);
          root.render(<DialogBox />);
        });
      }
    });
  }
  return (
    <>
    <ThemeProvider>
    <main className="w-screen min-h-screen bg-white dark:bg-zinc-900 ">
      <NavBar />
     
     <div className="w-full p-4 ">
        <h1 className="text-2xl font-semibold text-center text-black dark:text-white">Dashboard</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2">Manage your passwords and settings here.</p>
      </div>
      <div className="container min-h-[400px] mx-auto p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Additional dashboard content can go here */}
        <button onClick={dialogBoxHandler} className="max-w-64 max-h-72 bg-white/40 dark:bg-zinc-500 p-4 rounded-lg shadow-lg flex justify-center items-center hover:bg-white/60 dark:hover:bg-zinc-600 transition-colors hover:z-30 cursor-pointer">
        <svg aria-hidden="true" data-prefix="far" data-icon="plus-octagon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-plus-octagon fa-w-16 fa-7x size-1/3"><path fill="currentColor" d="M497.9 150.5L361.5 14.1c-9-9-21.2-14.1-33.9-14.1H184.5c-12.7 0-24.9 5.1-33.9 14.1L14.1 150.5c-9 9-14.1 21.2-14.1 33.9v143.1c0 12.7 5.1 24.9 14.1 33.9l136.5 136.5c9 9 21.2 14.1 33.9 14.1h143.1c12.7 0 24.9-5.1 33.9-14.1L498 361.4c9-9 14.1-21.2 14.1-33.9v-143c-.1-12.8-5.2-25-14.2-34zm-33.9 177L327.5 464h-143L48 327.5v-143L184.5 48h143.1L464 184.5v143zM384 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12z" className=""></path></svg>
        </button>
     
     </div>
    </main>
    </ThemeProvider>
    </>
  )
}

export default DashBoard;
