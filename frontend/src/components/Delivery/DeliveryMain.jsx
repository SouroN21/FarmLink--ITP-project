import React from 'react'
import DeliveryToBar from "./DeliveryCom/DeliveryToBar"
import DeliverySideBar from "./DeliveryCom/DeliverySideBar"
import DeliveryNavigation from './DeliveryCom/DeliveryNavigation'

const DeliveryMain = () => {
  return (
    <React.Fragment>
      {/* heading section */}
      <section>
        <div>
          <DeliveryToBar />
        </div>
      </section>

      {/* sidebar section */}
      <section>
        <div className='grid grid-cols-12'>
          <div className='col-span-3 bg-slate-100 h-screen md:col-span-2 px-5'>
             <DeliverySideBar/> 
          </div>


          <div className='col-span-9 bg-white-500 h-screen pl-2 md:col-span-10'>
              <DeliveryNavigation/>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default DeliveryMain