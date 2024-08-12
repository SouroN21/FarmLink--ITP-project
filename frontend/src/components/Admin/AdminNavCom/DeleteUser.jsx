import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      try {
        const response = await axios.delete(`http://localhost:5000/users/${id}`);
        setMessage(response.data.message);
        // Remove the deleted user from the local state
        setUsers(users.filter((user) => user._id !== id));
        toast.success('User Deleded succesfully!', {
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
        toast.error('can not delete user', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            
            });
        console.error("Failed to delete user:", error);
      }
    }
  };
      //search user
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 ">
      <h1 className="text-teal-500 m-4 text-xl font-bold">User Management</h1>
      <input
        className="rounded-md outline-none bg-slate-100 p-3 w-80"
        type="text"
        placeholder="Search by email"
        onChange={handleSearch}
      />
      
      <table className="m-5 rounded-md">
        <thead>
          <tr className="m-7 bg-teal-500">
            <th className="p-3 text-white">ID</th>
            <th className="p-3 text-white">Email</th>
            <th className="p-3 text-white">First Name</th>
            <th className="p-3 text-white">Role</th>
            <th className="p-3 text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="p-2 pr-6">{user._id}</td>
              <td className="p-2 pr-6">{user.email}</td>
              <td className="p-2 pr-6">{user.firstName}</td>
              <td className="p-2 pr-6">{user.role}</td>
              <td className="p-2 pr-6">
                {user.role !== "admin" && (
                  <button className="p-2 bg-teal-500 rounded-md text-white font-bold hover:bg-red-600" onClick={() => handleDelete(user._id)}>Delete</button>
                  
                )}
                <ToastContainer />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
