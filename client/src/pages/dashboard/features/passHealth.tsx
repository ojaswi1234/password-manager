import React from 'react'
import { ModeToggle } from '../../../components/modeToggle'

const passHealth = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-red-900 dark:to-yellow-800 text-black dark:text-white">
        <header className="w-full h-20 shadow-xl flex items-center justify-between px-8 sticky top-0 z-50">
            <h1 className="font-bold text-2xl ">Password CheckUp</h1>
            <div className="flex flex-row items-center gap-10">
            <ModeToggle />
            <a href="/logout">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="size-6 dark:fill-white"><path d="M534.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L434.7 224 224 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM192 96c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-53 0-96 43-96 96l0 256c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>
        </a>
        
            </div>
            

        </header>
    </div>
  )
}

export default passHealth