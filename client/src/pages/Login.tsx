import { useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import TextInput from "../components/reusable/inputs/TextInput.tsx";
import { Link, useNavigate } from "react-router-dom";
import { createGenericChangeHandler } from "../helper/genericInputHandler.ts";
import PasswordInput from "../components/reusable/inputs/PasswordInput.tsx";
import TipBox from "../components/reusable/TipBox.tsx";
import Button from "../components/reusable/Button.tsx";
import type { AuthRequestPayload, AuthResponse } from "@scope/server";
import { authRequest } from "@scope/server";

const LOGIN_INFORMATION_DEFAULT_VALUE: AuthRequestPayload = {
  nrp: "",
  password: "",
};

const Login = () => {
  const [loginInformation, setLoginInformation] = useState<AuthRequestPayload>(
    LOGIN_INFORMATION_DEFAULT_VALUE,
  );
  const [showInvalidCredentialsWarning, setShowInvalidCredentialsWarning] =
    useState(false);
  const loginInformationOnChangeHandler =
    createGenericChangeHandler(setLoginInformation);

  const navigate = useNavigate();

  const handleLoginSubmit = async (data: AuthRequestPayload) => {
    try {
      const response = await fetch(
        "http://localhost:8000/login",
        authRequest(data),
      );
      const responseBody: AuthResponse = await response.json();
      if (response.ok) {
        sessionStorage.setItem("session_token", responseBody.jwt);
        navigate("/approve");
      } else {
        setShowInvalidCredentialsWarning(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Primitive>
      <div className="flex flex-col gap-2">
        {showInvalidCredentialsWarning ? (
          <TipBox label="Invalid Credentials" variant="red" />
        ) : (
          ""
        )}
        <div className="flex flex-col gap-2 max-w-1/4">
          <TextInput
            label="NRP"
            name="user-nrp"
            id="user-nrp"
            requiredInput
            variant="black"
            isDisabled={false}
            value={loginInformation.nrp}
            onChangeHandler={loginInformationOnChangeHandler("nrp")}
          />
          <PasswordInput
            label="Password"
            name="user-password"
            id="user-password"
            requiredInput
            variant="black"
            isDisabled={false}
            value={loginInformation.password}
            onChangeHandler={loginInformationOnChangeHandler("password")}
          />

          <div
            className="flex"
            onClick={() => {
              handleLoginSubmit(loginInformation);
              setLoginInformation(LOGIN_INFORMATION_DEFAULT_VALUE);
              setShowInvalidCredentialsWarning(false);
            }}
          >
            <Button id="login-submit" variant="black" label="Sign in" />
          </div>
        </div>
        <Link
          to="/submit"
          className="text-blue-500 underline font-bold"
          target="_blank"
        >
          Are you a Requestor? Need to make a PR form? Click here instead
        </Link>
      </div>
    </Primitive>
  );
};

export default Login;
