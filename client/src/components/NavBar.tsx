import { ModeToggle } from "./modeToggle"


const NavBar = () => {
  return (
   <header className="w-screen flex-1 items-center p-2 sticky top-0 z-50">
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 dark:text-white px-5">
        <div className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="size-8 dark:fill-white"><path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z"/></svg>
      <div className="text-lg font-bold ">Password Manager</div>
      </div>
      <div className="flex items-center space-x-4">
        <a href="/profile" className="dark:text-white"><svg aria-hidden="true" data-prefix="fas" data-icon="user-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-user-alt fa-w-16 fa-7x size-6 dark:fill-white"><path fill="currentColor" d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128z" className=""></path></svg></a>
        <ModeToggle />
        
      </div>
    </nav>
   </header>
  )
}

export default NavBar