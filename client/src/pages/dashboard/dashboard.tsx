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
        <main className="w-screen min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800">
          <NavBar />

          <div className="w-full p-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">Manage your passwords and settings here.</p>
          </div>

          <div className="w-full mt-8 p-6 flex flex-col ">
            <button
                id="dialogBtn"
                onClick={() => setIsModalOpen(true)}
                className="w-fit p-3 bg-black dark:bg-white rounded-2xl  mb-6 flex justify-center items-center place-self-center-safe lg:place-self-end-safe cursor-pointer hover:scale-105 transition-transform lg:mr-24"
              >
               
                <span className="text-white dark:text-black font-bold">+ Add Credential</span>
              </button>
           
             
                       
              

              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                shouldCloseOnOverlayClick={true}
                overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md rounded-2xl p-8 max-w-md mx-4 outline-none shadow-2xl"
                contentLabel="Create item"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Add Credentials</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Add your credentials for respective platforms</p>
                  <form className="space-y-6 flex flex-col" onSubmit={handleSave} method="POST">
                    <select name="platform" className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                      <option value="">Select a platform</option>
                      <option value="google" className="font-bold"> Google</option>
                      <option value="microsoft" className="font-bold">Microsoft</option>
                      <option value="amazon" className="font-bold">Amazon</option>
                      <option value="instagram" className="font-bold"> Instagram</option>
                      <option value="linkedin" className="font-bold"> LinkedIn</option>
                      <option value="facebook" className="font-bold"> Facebook</option>
                      <option value="x" className="font-bold">𝕏</option>
                      <option value="other" className="font-bold">Other</option>
                    </select>
                    <input name="email" className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your Username/Email..." required />
                    <input name="password" className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="password" placeholder="Enter your Password..." required />
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-zinc-600 hover:bg-gray-300 dark:hover:bg-zinc-500 rounded-lg cursor-pointer transition-colors">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer flex-1 flex justify-center items-center transition-colors">
                        ADD <span className="font-bold ml-2">+</span>
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>
              <div className="container min-h-fit mx-auto p-8 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              

            </div>
          </div>
        </main>
      </ThemeProvider>
    </>
  )
}

export default DashBoard;
