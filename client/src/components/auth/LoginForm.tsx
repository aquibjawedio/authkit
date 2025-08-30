import { axiosClient } from "@/api/axiosClient";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ErrorDTO {
  response: {
    data?: {
      message?: string;
    };
  };
}

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorDTO>();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("FORM DATA : ", formData);
    try {
      setLoading(true);
      const user = await axiosClient.post("/auth/login", formData);
      console.log("USER : ", user);
      setLoading(false);
    } catch (error) {
      setError(error as ErrorDTO);
      setLoading(false);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.log("IF ERROR : ", error);
    return (
      <div className="bg-red-400 font-semibold text-2xl p-2 ">
        {error?.response?.data?.message ||
          "Something went wrong while logging in."}
      </div>
    );
  }

  return (
    <div className="w-fit p-2 bg-red-300">
      <h1> Welcome Back</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="">Enter your email</label>
          <input
            type="email"
            name="email"
            className="border "
            value={formData.email}
            onChange={handleOnChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Enter your password</label>
          <input
            type="password"
            name="password"
            className="border"
            value={formData.password}
            onChange={handleOnChange}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
