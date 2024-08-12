import React from 'react'
import FarmerNavBar from './FarmerCom/FarmerNavBar'
import Sidebar from './FarmerCom/SideBar'
import FarmerNavigation from './FarmerCom/FarmerNavigation'

const FarmerMain = () => {
  return (
    <React.Fragment>
      {/* heading section */}
      <section>
        <div>
          <FarmerNavBar />
        </div>
      </section>

      {/* sidebar section */}
      <section>
        <div className='grid grid-cols-12'>
          <div className='col-span-3 bg-slate-100 h-screen md:col-span-2 px-5'>
             <Sidebar/> 
          </div>


          <div className='col-span-9 bg-white-500 h-screen pl-2 md:col-span-10'>
              <FarmerNavigation/>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default FarmerMain