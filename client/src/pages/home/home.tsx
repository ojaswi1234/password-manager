

import { ModeToggle } from '../../components/modeToggle'

const home = () => {
  
  return (
    <div className="w-screen h-screen bg-gradient-to-bl from-[#fdbb2d] via-[#b21f1f] to-[#1a2a6c] p-5 ">
        <div className="w-full h-full bg-white dark:bg-black mx-auto ">
            <header className="flex justify-between items-center p-5 text-black bg-transparent dark:text-white">
                <a href="/" className="dark:text-white text-2xl font-bold">Password Manager</a>
                <ModeToggle />
            </header>

            <div className="container mx-auto p-4 flex flex-col items-center justify-center h-[80vh]">
              <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Password Manager</h1>
              <p className="text-lg mb-8 text-center max-w-xl">
                Securely store and manage all your passwords in one place. Easily access your credentials, generate strong passwords, and keep your accounts safe.
              </p>
              <a
                href="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </a>
            </div>
        </div>
            
    </div>
  )
}

export default home