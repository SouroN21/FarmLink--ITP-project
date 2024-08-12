import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const UserStats = () => {
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/stats");
        setUserStats(response.data);
        toast.success('data retrived succesfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            
            });
      } catch (error) {
        toast.error('something went wrong', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            
            });
        console.error("Error fetching user stats:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <div>
        {userStats && (
        <div>
            <p className="flex p-4 rounded-xl mt-4 ml-5 mr-5 bg-slate-200 text-teal-700 font-bold text-2xl">Our all Customers Count is {userStats.total.count}</p>
            <div className="flex justify-center">
                {Object.keys(userStats).map((role) => {
                    if (role !== "total") {
                        return (
              < div className="p-10 m-7 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 rounded-2xl text-center" key={role}>
                    <p className="text-white text-xl font-bold">{role}</p>
                    <p className="text-white text-lg"><strong>Total Count:</strong> {userStats[role].count}</p>
                    <p className="text-white text-lg"><strong>Average:</strong> {(userStats[role].count / userStats.total.count * 100).toFixed(2)}%</p>
              </div>
                );
                }
                    return null;
                })}
            </div>
        </div>
     )}
            
          <ToastContainer />
        </div>
    
       <div className="">


        <div className="">
        <ResponsiveContainer width="50%" height={400}>
            <BarChart
                data={Object.keys(userStats || {}).map((role) => {
                if (role !== "total") {
                    return { data: role, total: userStats[role].count };
                 }
                return null;
                    }).filter(Boolean)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>

        </div>
        </div>
    </div>
  );
};

export default UserStats;
