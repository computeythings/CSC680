import { ApiResponse } from "@/services/ApiService";

interface props {
    firstname: string
    lastname: string
    user: string
    title: string
    onSubmit: () => void;
}

export default function UserDisplay({ firstname, lastname, user, title, onSubmit }: props) {

  return (
    <>
        <div className="p-4">
            <h2 className="text-center font-bold text-4xl">{title}</h2>
        </div>
        <div className="p-4">
            First Name:
            <span>{firstname}</span>
        </div>
        <div className="p-4">
            Last Name:
            <span>{lastname}</span>
        </div>
        <div className="p-4">
            user:
            <span>{user}</span>
        </div>
        <div className="flex justify-center">
        <button 
        onClick={onSubmit}
        type="submit"
        className="px-4 border cursor-pointer mb-4 text-center hover:shadow-md">
            Delete
        </button>
        </div>
    </>
  );
}
