import React, { useState } from 'react'

const DialogBox = () => {
    
  return (

    <div>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Dialog Box</h2>
            <p className="mb-4">This is a dialog box. You can add your content here.</p>
            <button  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Close
            </button>
            </div>
        </div>
    </div>
  )
}

export default DialogBox