
import { useEffect, useState } from 'react';
import NavBar from "../../components/NavBar";
import { ThemeProvider } from "../../components/theme-provider";
import Modal from 'react-modal';

const DashBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Set the app element for accessibility (adjust selector if your root id is different)
    try { Modal.setAppElement('#root'); } catch { /* ignore in tests/env without DOM */ }
  }, []);


  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    fetch('/saved', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Handle successful save
          setIsModalOpen(false);
        } else {
          // Handle error
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
  <button id="dialogBtn" onClick={() => setIsModalOpen(true)} className="max-w-64 max-h-72 bg-white/40 dark:bg-zinc-500 p-4 rounded-lg shadow-lg flex justify-center items-center hover:bg-white/60 dark:hover:bg-zinc-600 transition-colors hover:z-30 cursor-pointer">
        <svg aria-hidden="true" data-prefix="far" data-icon="plus-octagon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-plus-octagon fa-w-16 fa-7x size-1/3"><path fill="currentColor" d="M497.9 150.5L361.5 14.1c-9-9-21.2-14.1-33.9-14.1H184.5c-12.7 0-24.9 5.1-33.9 14.1L14.1 150.5c-9 9-14.1 21.2-14.1 33.9v143.1c0 12.7 5.1 24.9 14.1 33.9l136.5 136.5c9 9 21.2 14.1 33.9 14.1h143.1c12.7 0 24.9-5.1 33.9-14.1L498 361.4c9-9 14.1-21.2 14.1-33.9v-143c-.1-12.8-5.2-25-14.2-34zm-33.9 177L327.5 464h-143L48 327.5v-143L184.5 48h143.1L464 184.5v143zM384 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12z" className=""></path></svg>
        </button>
        
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          shouldCloseOnOverlayClick={true}
          overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          className="bg-white dark:bg-zinc-800 rounded-lg p-14 max-w-md mx-4 outline-none"
          contentLabel="Create item"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Credentials</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Add your Credentials for respective platforms</p>
            <div className="mt-4">
              {/* Simple form or content goes here */}
              <form className="space-y-4 flex flex-col " onSubmit={handleSave} method="POST">
                <select name="platform" className="w-full p-2 border rounded bg-white dark:bg-zinc-700 mb-4" required>
                  <option value="">Select a platform</option>
                  <option value="google">🔍 Google</option>
                  <option value="microsoft">🪟 Microsoft</option>
                  <option value="amazon">🚚 Amazon</option>
                  <option value="instagram">📸 Instagram</option>
                  <option value="linkedin">💼 LinkedIn</option>
                  <option value="facebook">🧠 Facebook</option>
                  <option value="x">𝕏 X</option>
                  <option value="other">✳️ Other</option>
                </select>
                <input name="email" className="w-full p-2 border rounded bg-white dark:bg-zinc-700 mb-4" placeholder="Enter your UserName/Email..." required />
                <input name="password" className="w-full p-2 border rounded bg-white dark:bg-zinc-700 mb-4" type="password" placeholder="Enter your Password..." required />
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-zinc-600 rounded cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer flex-1 justify-between items-center hover:bg-blue-700">ADD <span className="font-bold scale-150">+</span></button>
                </div>
              </form>
            </div>
           
          </div>
        </Modal>
     
     </div>
    </main>
    </ThemeProvider>
    </>
  )
}

export default DashBoard;
