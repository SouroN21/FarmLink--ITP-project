import React from 'react'
import BuyerTopBar from './BuyerCom/BuyerTopBar'
import BuyerSideBar from './BuyerCom/BuyerSideBar'
import BuyerNavigation from './BuyerCom/BuyerNavigation'

const FarmerMain = () => {
  return (
    <React.Fragment>
      {/* heading section */}
      <section>
        <div>
          <BuyerTopBar/>
        </div>
      </section>

      {/* sidebar section */}
      <section>
        <div className='grid grid-cols-12'>
          <div className='col-span-3 bg-slate-100 h-screen md:col-span-2 px-5'>
             <BuyerSideBar/> 
          </div>


          <div className='col-span-9 bg-white-500 h-screen pl-2 md:col-span-10'>
              <BuyerNavigation/>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default FarmerMain