import { usersApi } from "@/services/ApiService";
import { useEffect, useState } from "react";

interface props {
    title: string
    found: (data: {
        firstName: string, 
        lastName: string, 
        user: string, 
        password: string
    }) => void
}

export default function UserSearch({ title, found }: props) {
  const [user, setUser] = useState("")
  const [fail, setFail] = useState(false)

  // submit on enter
  const submitIfEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setFail(false)
    if (e.key === "Enter") {
      findUser()
    }
  }

  const findUser = () => {
    usersApi.getUser(user).then(res => {
        if (res.statusCode == 200) {
            console.log(res.data.data)
            found(res.data.data)
        } else {
            setFail(true)
        }
    })
  }

  return (
    <>
        <div className="p-4">
            <h2 className="text-center font-bold text-4xl">{title}</h2>
        </div>
        <div className="p-4">
            Username:
            <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                onKeyDown={submitIfEnter}
                className={`border px-3 py-1 rounded w-full focus:outline-none ${fail ? "border-red-500" : ""}`}
            />

        </div>
        <div className="flex justify-center">
        <button 
        onClick={findUser}
        type="submit"
        className="px-4 border cursor-pointer mb-4 text-center hover:shadow-md">
            Search
        </button>
        </div>
    </>
  );
}
