

import { BackgroundBeams } from '../../components/background-beams'


const home = () => {
  
  return (
    <div className="w-screen h-screen bg-gradient-to-bl from-[#fdbb2d] via-[#b21f1f] to-[#1a2a6c] p-2 ">
        <div className="w-full h-full bg-zinc-900 mx-auto rounded-2xl">
           <BackgroundBeams className="absolute inset-0 z-0" />
            <header className="flex justify-between items-center p-5 text-black bg-transparent dark:text-white">
                <a href="/" className="text-white text-2xl font-bold">Password Manager</a>
                
            </header>

            <div className="container mx-auto p-4 flex flex-col items-center justify-center h-[80vh] text-white">
           
              <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Password Manager</h1>
              <p className="text-lg mb-8 text-center max-w-xl">
                Securely store and manage all your passwords in one place. Easily access your credentials, generate strong passwords, and keep your accounts safe.
              </p>
              <a
                href="/welcome"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition z-20 "
              >
                Get Started
              </a>
            </div>
        </div>
            
    </div>
  )
}

export default home