import React from 'react'
import AdminToBar from "../Admin/AdminCom/AdminTopBar";
import AdminSideBar from "../Admin/AdminCom/AdminSideBar";
import AdminNavigation from "../Admin/AdminCom/AdminNavigation";

const AdminMain = () => {
  return (
    
    <React.Fragment >
      {/* heading section */}
      <section>
        <div>
          <AdminToBar />
        </div>
      </section>

      {/* sidebar section */}
      <section>
        <div className='grid grid-cols-12'>
          <div className='col-span-3 bg-slate-100 h-screen md:col-span-2 px-5'>
             <AdminSideBar/> 
          </div>


          <div className='col-span-9 bg-white-500 h-screen pl-2 md:col-span-10'>
              <AdminNavigation/>
          </div>
        </div>
      </section>
    </React.Fragment>
    
  )
}

export default AdminMain