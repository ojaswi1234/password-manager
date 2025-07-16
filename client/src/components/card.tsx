import React from 'react'

const Card = (props : { src:string,  name:string, }) => {
  return (
   
        <div className=" h-[150px] bg-white dark:bg-zinc-800 shadow-md rounded-lg p-6 flex flex-row">
            <img src={props.src} alt="Card Image" className="w-1/2 h-14 object-cover rounded-md mb-4" />
            <div className="flex flex-col justify-between ">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{props.name}</h2>
           
            <button className=" px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ">
              Action
            </button>
            </div>
        </div>
    
  )
}

export default Card