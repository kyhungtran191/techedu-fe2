import React, { useState, ReactNode, ElementType, useEffect } from 'react'
import DefaultHeader from './Header'
import DefaultSidebar from './Sidebar'
import { useLocation } from 'react-router-dom'
// import Header from '../components/Header/index'
// import Sidebar from '../components/Sidebar/index'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface IProps {
  children: React.ReactNode
  HeaderCustom?: ElementType | ElementType<HeaderProps>
  SidebarCustom?: ElementType<SidebarProps>
  isSideBar?: boolean
}
const ClientMainLayout: React.FC<IProps> = ({ children, HeaderCustom, SidebarCustom, isSideBar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const HeaderComponent = HeaderCustom || DefaultHeader
  const SidebarComponent = SidebarCustom || DefaultSidebar

  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className='relative'>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className='flex h-screen overflow-hidden'>
        {/* <!-- ===== Sidebar Start ===== --> */}
        {isSideBar && SidebarComponent && (
          <SidebarComponent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        <div className='relative flex flex-col flex-1 overflow-y-auto'>
          {HeaderComponent &&
            (HeaderCustom ? (
              // If HeaderCustom is a function component that accepts props, pass them
              <HeaderComponent sidebarOpen={sidebarOpen} setSidebarOpen={(value: boolean) => setSidebarOpen(value)} />
            ) : (
              <HeaderComponent sidebarOpen={sidebarOpen} setSidebarOpen={(value: boolean) => setSidebarOpen(value)} />
            ))}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className='py-4 px-2 h-[calc(100vh-96px)]'>
            <div className='px-2 py-3 sm:px-4 sm:py-[18px] bg-neutral-silver-1 rounded-[20px] h-full'>
              <div className='rounded-[20px] h-full '>{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ClientMainLayout
