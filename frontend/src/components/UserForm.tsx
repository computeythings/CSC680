import { ApiResponse } from "@/services/ApiService";
import { useEffect, useState } from "react";

interface UserData {
  firstname: string;
  lastname: string;
  user: string;
  password: string;
  role: string
}

interface props {
  firstname?: string;
  lastname?: string;
  user?: string;
  password?: string;
  title: string;
  onSubmit: (data: UserData) => Promise<ApiResponse<any>>;
}

export default function UserForm({ firstname="", lastname="", user="", password="", title, onSubmit }: props) {
  const roles = ["admin", "valet", "parking_attendant"]
  const [usr, setUser] = useState("")
  const [fname, setFirstName] = useState("")
  const [lname, setLastName] = useState("")
  const [pwd, setPassword] = useState("")
  const [submitFail, setSubmitFail] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  useEffect(() => {
    setFirstName(firstname)
    setLastName(lastname)
    setUser(user)
    setPassword(password)
  }, [firstname, lastname, user, password])

  // submit on enter
  const submitIfEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setSubmitFail(false)
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!usr || !fname || !lname || !pwd) {
        setSubmitFail(true) 
        return
    }
    onSubmit({ firstname: fname, lastname: lname, user: usr, password: pwd, role: selectedRole }).then(res => {
        if (res.statusCode == 200) {
            setUser("")
            setFirstName("")
            setLastName("")
            setPassword("")
            setSelectedRole("")
        } else {
            console.log(res)
            alert("Nope")
        }
    })
  }

  return (
    <>
        <div className="p-4">
            <h2 className="text-center font-bold text-4xl">{title}</h2>
        </div>
        <div className="p-4">
            First Name:
            <input
                type="text"
                value={fname}
                onChange={e => setFirstName(e.target.value)}
                onKeyDown={submitIfEnter}
                className={`border px-3 py-1 rounded w-full focus: outline-none ${submitFail && !fname ? "border-red-500" : ""}`}
            />

        </div>
        <div className="p-4">
            Last Name:
            <input
                type="text"
                value={lname}
                onChange={e => setLastName(e.target.value)}
                onKeyDown={submitIfEnter}
                className={`border px-3 py-1 rounded w-full focus: outline-none ${submitFail && !lname ? "border-red-500" : ""}`}
            />

        </div>
        <div className="p-4">
            Username:
            <input
                type="text"
                value={usr}
                onChange={e => setUser(e.target.value)}
                onKeyDown={submitIfEnter}
                className={`border px-3 py-1 rounded w-full focus: outline-none ${submitFail && !usr ? "border-red-500" : ""}`}
            />

        </div>
        <div className="p-4">
            Password:
            <input
                type="password"
                value={pwd}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={submitIfEnter}
                className={`border px-3 py-1 rounded w-full focus: outline-none ${submitFail && !pwd ? "border-red-500" : ""}`}
            />
        </div>
        <div className="flex my-8">
          <div className="ml-auto">Role:</div>
          <div className="flex ml-4 mr-auto">
          {roles.map(role => (
            <label key={role} className="flex items-center space-x-2 mx-4">
              <input
                type="checkbox"
                checked={selectedRole === role}
                onChange={() => setSelectedRole(role)}
              />
              <span>{role}</span>
            </label>
          ))}
          </div>
        </div>
        <div className="flex justify-center">
        <button 
            onClick={handleSubmit}
            type="submit"
            className="px-4 border cursor-pointer mb-4 text-center hover:shadow-md">
                Submit
        </button>
        </div>
    </>
  );
}
