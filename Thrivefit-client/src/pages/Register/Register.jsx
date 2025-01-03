import { Link, ScrollRestoration, useNavigate } from "react-router-dom";
import useAuthProvider from "../../hooks/useAuthProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { updateProfile } from "firebase/auth";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Register = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const { emailPasswordRegister, setUser } = useAuthProvider();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmitRegister = (data) => {
    const { email, password, photoURL, name } = data;

    emailPasswordRegister(email, password)
      .then((res) => {
        updateProfile(res.user, {
          displayName: name,
          photoURL: photoURL,
        })
          .then(() => {
            // create user entry in the database
            const userInfo = {
              name: data.name,
              email: data.email,
              profilePicture: data.photoURL
            };
            axiosPublic.post("/user", userInfo)
            .then(result=> {
              if(result.data?.insertedId){
                reset();
                toast.success("Register successful.");
                // console.log(res.user);
                setUser(res.user);
                navigate("/");
              }
            })
            
          })
          .catch(() => {
            toast.error("Error occured.");
          });
      })
      .catch((err) => {
        if (err?.customData?._tokenResponse?.error?.message == "EMAIL_EXISTS") {
          toast.error("Email already exists.");
        } else {
          console.log(err);
          toast.error("Register unsuccessful.");
        }
      });
  };

  return (
    <div className="mx-2">
      <Helmet>
        <title>ThriveFit | Register</title>
      </Helmet>
      <ScrollRestoration />
      <div
        data-aos="zoom-in"
        className="w-full mb-9 border border-gray-200  border-gray-100/25 max-w-md mx-auto mt-12 p-8 space-y-3 rounded-xl bg-white  text-gray-900"
      >
        <h1 className="text-2xl font-bold text-center text-black  font-bugrasimo">
          Register Now!
        </h1>
        <form onSubmit={handleSubmit(onSubmitRegister)} className="space-y-6">
          <div className="space-y-1 text-sm">
            <label
              htmlFor="username"
              className="block text-gray-900 "
            >
              Name
            </label>
            <input
              {...register("name", {
                required: {
                  value: true,
                  message: "This field is required.",
                },
              })}
              type="text"
              name="name"
              placeholder="Name"
              className="w-full placeholder:text-gray-700 px-4 py-3 rounded-md border-2 border-gray-500 bg-main text-gray-800 focus:border-violet-400 bg-transparent appearance-none"
            />
            {errors?.name?.message && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <label
              htmlFor="username"
              className="block text-gray-900 "
            >
              Photo URL
            </label>
            <input
              {...register("photoURL", {
                required: {
                  value: true,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i,
                  message: "URL must be valid and must include http or https",
                },
              })}
              type="url"
              name="photoURL"
              placeholder="Photo URL"
              className="w-full placeholder:text-gray-700 px-4 py-3 rounded-md border-2 border-gray-500 bg-main text-gray-800 focus:border-violet-400 bg-transparent appearance-none"
            />
            {errors?.photoURL?.message && (
              <span className="text-red-500">{errors.photoURL.message}</span>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <label
              htmlFor="username"
              className="block text-gray-900 "
            >
              Email
            </label>
            <input
              {...register("email", {
                required: {
                  value: true,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
                  message: "Email must be valid",
                },
              })}
              type="email"
              name="email"
              placeholder="Email"
              className="w-full  placeholder:text-gray-700 px-4 py-3 rounded-md border-2 border-gray-500 bg-main text-gray-800 focus:border-violet-400 bg-transparent appearance-none"
            />
            {errors?.email?.message && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <label
              htmlFor="password"
              className="block text-gray-900 "
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register("password", {
                  required: {
                    value: true,
                    message: "This field is required.",
                  },
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters.",
                  },
                  validate: {
                    oneLower: (value) => {
                      if (/^(?=.*[a-z])/.test(value)) {
                        return true;
                      }
                      return "Password must include a lowercase character.";
                    },
                    oneUpper: (value) => {
                      if (/^(?=.*[A-Z])/.test(value)) {
                        return true;
                      }
                      return "Password must include a uppercase character.";
                    },
                  },
                })}
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full placeholder:text-gray-700 px-4 py-3 rounded-md border-2 border-gray-500 bg-main text-gray-800 focus:border-violet-400 bg-transparent appearance-none"
              />
              <span
                className="absolute top-4 right-3 cursor-pointer  p-1"
                onClick={() => {
                  setShowPass(!showPass);
                }}
              >
                {showPass ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {errors?.password?.message && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none font-bugrasimo"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-sm text-center sm:px-6 text-gray-800">
          Have an account?
          <Link
            to="/login"
            className="underline font-bold text-gray-800  ml-2"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
