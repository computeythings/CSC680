import React, { useState } from 'react';
import Password from "@/components/Password";
import Username from "@/components/Username";

export default function Login() {
  const [selectedUser, setSelectedUser] = useState("");
  const handleUser = (text: string) => {
    setSelectedUser(prev => (prev === text ? "" : text));
  };
  const [selectedPassword, setSelectedPassword] = useState("");
  
  const handlePassword = (text: string) => {
    setSelectedPassword(prev => (prev === text ? "" : text));
  };
  const passwords = ["testpassword1","testpassword2","testpassword3","testpassword4"]
  const users = ["testuser1","testuser2","testuser3","testuser4"]
  return (
    <div className="flex items-center justify-center p-0">
        {passwords.map(pwd => (
            <Password
            text={pwd}
            isSelected={selectedPassword === pwd}
            onClick={() => handlePassword(pwd)}
            />
        ))}
        {users.map(username => (
            <Password
            text={username}
            isSelected={selectedUser === username}
            onClick={() => handleUser(username)}
            />
        ))}
        
        <div className="w-screen flex items-center justify-center">
            <button
                type="submit"
                className="text-blue-500 underline hover:text-blue-700 cursor-pointer bg-white p-2">
                LOGIN
            </button>
        </div>
    </div>
  );
}
