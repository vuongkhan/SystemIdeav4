import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import loginImg from "../assets/img/login.jpg";
import { login } from "../api/apiService";  
import { decodeJwt } from "../api/jwtDecode";
import jwtDecode from 'jwt-decode';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const permission = decodeJwt().permission;
      console.log("permission: " + permission)
    
      if (permission === "QAManager") {
        window.location.href = "http://localhost:4000/?token=" + token;
      } else {
        // window.location.href = '/home';
      }
    }
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(email, password);
      
      const token = response.token;
      
      localStorage.setItem("token", token);
      setIsLoggedIn(true);

      console.log(token);

      const permission = decodeJwt().permission;
      console.log("permission: " + permission)
    
      if (permission === "QAManager") {
        window.location.href = '/admin';
      } else {
        window.location.href = '/home';
      }

    } catch (error) {
      console.log(error);
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={loginImg} alt="" />
      </div>
      <div className="bg-gray-800 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="max-w-[400px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8">
          <h2 style={{ color: "white" }} className="text-4xl dark:text-white font-bold text-center">Login</h2>
          <div className="text-left flex flex-col text-gray-400 py-2">
            <label htmlFor="email">Email</label>
            <input type="text" value={email} onChange={handleEmailChange} className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"></input>
          </div>
          <div className="text-left flex flex-col text-gray-400 py-2">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} className="p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"></input>
          </div>
          <button id="submit" className="md:shadow-xl w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg">
            Login
          </button>
          
          <div style={{ color: "white" }}>{loginError}</div>
        </form>
      </div>
    </div>
  );
};

export default Login;
