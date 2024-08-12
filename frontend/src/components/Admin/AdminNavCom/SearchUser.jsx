import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

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

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const downloadPDF = async (user) => {
    try {
      const response = await axios.post("http://localhost:5000/download", { user }, { responseType: 'arraybuffer' });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_data.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((user) =>
    roleFilter === "" || user.role === roleFilter
  );

  return (
    <div className="p-5 ">
      <h1 className="text-teal-500 m-4 text-xl font-bold">All Users</h1>
      <div className="flex items-center">
        <input
          className="rounded-md outline-none bg-slate-100 p-3 w-80"
          type="text"
          placeholder="Search by first name or email"
          onChange={handleSearch}
        />
        <select
          className="rounded-md outline-none bg-slate-100 p-3 ml-5"
          onChange={handleRoleFilter}
          value={roleFilter}
        >
          <option value="">All Roles</option>
          <option value="farmer">Farmer</option>
          <option value="buyer">Buyer</option>
          <option value="delivery">Delivery</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <table className="m-5 rounded-md">
        <thead>
          <tr className="m-7 bg-teal-500">
            <th className="p-3 text-white">ID</th>
            <th className="p-3 text-white">First Name</th>
            <th className="p-3 text-white">Last Name</th>
            <th className="p-3 text-white">Email</th>
            <th className="p-3 text-white">Role</th>
            <th className="p-3 text-white">Generate ID Card</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="p-2 pr-6">{user._id}</td>
              <td className="p-2 pr-6">{user.firstName}</td>
              <td className="p-2 pr-6">{user.lastName}</td>
              <td className="p-2 pr-6">{user.email}</td>
              <td className="p-2 pr-6">{user.role}</td>
              <td>
              {user.role === "delivery" && (
                <button className="p-2 rounded-md bg-teal-500 font-bold text-white hover:bg-teal-300" onClick={() => downloadPDF(user)}>Download PDF</button>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
