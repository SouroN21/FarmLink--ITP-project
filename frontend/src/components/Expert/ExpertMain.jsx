import React from 'react'
import ExpertTopBar from "./ExpertCom/ExpertTopBar"
import ExpertSideBar from "./ExpertCom/ExpertSideBar"
import ExpertNavigation from "./ExpertCom/ExpertNavigation"

const ExpertMain = () => {
  return (
    <React.Fragment>
      {/* heading section */}
      <section>
        <div>
          <ExpertTopBar />
        </div>
      </section>

      {/* sidebar section */}
      <section>
        <div className='grid grid-cols-12'>
          <div className='col-span-3 bg-slate-100 h-screen md:col-span-2 px-5'>
             <ExpertSideBar/> 
          </div>


          <div className='col-span-9 bg-white-500 h-screen pl-2 md:col-span-10'>
              <ExpertNavigation/>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default ExpertMain