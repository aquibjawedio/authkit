import { Link } from "@tanstack/react-router";
import { LogIn, Sparkles } from "lucide-react";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 ">
      <h1 className="text-xl font-semibold">HELLO AND WELCOME TO THE FULLSTACK AUTH SYSTEM</h1>
      <p className="bg-orange-500 text-gray-50 font-bold rounded-full border border-gray-100 px-4 py-1 cursor-pointer flex items-center justify-center gap-1">
        <Sparkles className="w-4 h-4" />
        PROJECT NAME IS AUTHKIT
      </p>
      <Link
        to="/auth/login"
        className="bg-blue-500 text-gray-50 font-bold rounded-full border border-gray-100 px-4 py-1 cursor-pointer flex items-center justify-center gap-1"
      >
        <LogIn />
        Login
      </Link>
    </div>
  );
};

export default App;
