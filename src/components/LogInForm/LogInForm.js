import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../SignUpForm/SignUpForm.css";
import { baseUrl } from "../../utils";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ClientContext } from "../../context/ClientContext";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";

function LogInForm() {
  const { setClient } = useContext(ClientContext);
  const { register, handleSubmit } = useForm();
  const [loading, isLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const onSubmit = (data) => {
    isLoading(true);
    const formData = {
      username: data.username,
      password: data.password,
    };
    axios
      .post(`${baseUrl}/login`, formData)
      .then((res) => {
        isLoading(false);
        setClient(res);
        Swal.fire({
          title: "Success!",
          text: "Successfully Logged in",
          icon: "success",
          confirmButtonText: "Okay",
        });
        // console.log(res);
        navigate("/client");
        localStorage.setItem("client", JSON.stringify(res));
      })
      .catch((error) => {
        setErrors(error.response.data?.error);
        isLoading(false);
      });
  };

  return (
    <div className="sign-up-container">
      <div className="form-details">
        <h1>Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
          <label htmlFor="username">Username</label>
          <input type="text" {...register("username")} />

          <label htmlFor="password">Password</label>
          <input type="password" {...register("password")} />

          {errors.map((err, index) => (
            <p key={index} className="fied-errors">
              {err}.
            </p>
          ))}

          <button className="signup-btn">
            {loading ? <PulseLoader color="#FFF" /> : "Submit"}
          </button>
        </form>
        <p className="login-signup-toogle">
          New to VenueVibe? <Link to="/">Join Now</Link>
        </p>
      </div>
    </div>
  );
}

export default LogInForm;
