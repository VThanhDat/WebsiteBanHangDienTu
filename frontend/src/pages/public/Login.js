import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// import { auth } from "../../firebase/config";
import { InputField, Button } from "components";
import { apiForgotPassword, apiLogin, apiRegister } from "apis";
import path from "utils/path";
import { useDispatch, useSelector } from "react-redux";
import { userSlice } from "store/user/userSlice";
import icons from "utils/icons";
import { validate } from "utils/helpers";

const { AiOutlineClose, FaArrowLeftLong } = icons;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [invalidFields, setInvalidFields] = useState([]);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = useCallback(async () => {
    const { firstName, lastName, phone, ...data } = payload;

    const invalidCount = isRegister
      ? validate(payload, setInvalidFields)
      : validate(data, setInvalidFields);
    if (!invalidCount) {
      if (isRegister) {
        const response = await apiRegister(payload);
        await Swal.fire(
          response.success ? "Congratulation" : "Opps!",
          response.mes,
          response.success ? "success" : "error",
        ).then(() => {
          if (response.success) {
            setIsRegister(false);
            setPayload({
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              phone: "",
            });
          }
        });
      } else {
        const response = await apiLogin(data);
        if (response?.success) {
          dispatch(
            userSlice.actions.login({
              isLoggedIn: true,
              token: response.accessToken,
              userData: response.userData,
            }),
          );
          navigate(`/${path.HOME}`);
        } else {
          await Swal.fire("Opps!", response?.mes, "error");
        }
      }
    }
    return true;
  }, [isRegister, payload]);
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    Swal.fire(
      response.success ? "Success" : "Opps!",
      response.mes || "Please check your mail to reset your password",
      response.success ? "success" : "error",
    ).then(() => {
      if (response.success) {
        setIsForgotPassword(false);
        setEmail("");
      }
    });
  };
  const handleLoginWithFacebook = () => {};

  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <div
        className={`absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-overlay ${
          isForgotPassword ? "" : "hidden"
        }`}
        onClick={(e) => setIsForgotPassword(false)}
      >
        <div
          className="flex w-1/3 animate-slide-top flex-col rounded-xl bg-white p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between">
            <label htmlFor="email">Enter your email to reset password:</label>
            <button onClick={() => setIsForgotPassword(false)}>
              <AiOutlineClose size={20} />
            </button>
          </div>
          <input
            className="mb-6 mt-2 w-full border-b p-2 outline-none placeholder:text-sm"
            type="text"
            id="email"
            placeholder="Exp: email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button name="Submit" handleClick={handleForgotPassword}></Button>
        </div>
      </div>
      <div className="flex w-[500px] flex-col items-center rounded-xl border bg-white px-5 pb-5 pt-5 shadow-2xl">
        <div className="relative mb-5 flex w-full items-center">
          <button
            className="absolute left-0 flex items-center gap-2 rounded-full bg-gray-100 p-2 shadow-lg hover:bg-gray-200"
            onClick={() => navigate(`/${path.HOME}`)}
          >
            <FaArrowLeftLong size={20} className="text-main" />
            <span className="text-main">Home</span>
          </button>
          <h3 className="mx-auto font-semibold text-main">
            {isRegister ? "Register" : "Login"}
          </h3>
        </div>

        {isRegister && (
          <>
            <div className="flex items-center gap-3">
              <InputField
                value={payload.firstName}
                setValue={setPayload}
                nameKey="firstName"
                title={"First Name"}
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
              <InputField
                value={payload.lastName}
                setValue={setPayload}
                nameKey="lastName"
                title={"Last Name"}
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>
            <InputField
              value={payload.phone}
              setValue={setPayload}
              nameKey="phone"
              title={"Phone"}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </>
        )}
        <InputField
          value={payload.email}
          setValue={setPayload}
          nameKey="email"
          title={"Email"}
          invalidFields={invalidFields}
          setInvalidFields={setInvalidFields}
        />
        <InputField
          value={payload.password}
          setValue={setPayload}
          nameKey="password"
          type={"password"}
          title={"Password"}
          invalidFields={invalidFields}
          setInvalidFields={setInvalidFields}
          handleSubmit={handleSubmit}
        />
        <div className="my-2 flex w-full items-center justify-between text-sm">
          {!isRegister ? (
            <span
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot your account?
            </span>
          ) : (
            <span></span>
          )}
          <span
            className="cursor-pointer text-blue-500 hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
            }}
          >
            {isRegister ? "Go login" : "Create new account"}
          </span>
        </div>
        <div className="mt-4 w-full">
          <Button
            name={isRegister ? "Register" : "Login"}
            handleClick={handleSubmit}
          />
        </div>
        {!isRegister && (
          <>
            <div className="mt-4 w-full">
              <Button
                disabled
                name={"Login with Facebook"}
                handleClick={handleLoginWithFacebook}
                backgroundColor="bg-blue-600"
              />
            </div>
            <div className="mt-4 w-full">
              <Button
                disabled
                name={"Login with Google"}
                handleClick={handleSubmit}
                backgroundColor="bg-orange-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
