import Primitive from "../components/reusable/Primitive.tsx";
import TextInput from "../components/reusable/inputs/TextInput.tsx";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/reusable/inputs/PasswordInput.tsx";
import TipBox from "../components/reusable/TipBox.tsx";
import Button from "../components/reusable/Button.tsx";
import { useState } from "react";
import type { LoginPayload, LoginResponse } from "@scope/server";
import { jwtRequestPayload } from "@scope/server";
import { createGenericChangeHandler } from "../helper/genericInputHandler.ts";
import serverDomain from "../helper/serverDomain.ts";
const JWT_REQUEST_URL = `${serverDomain}/jwt/request`;

const DEFAULT_FORM_CONTENT: LoginPayload = {
  nrp: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [loginInformation, setLoginInformation] =
    useState<LoginPayload>(DEFAULT_FORM_CONTENT);
  const [credentialIsInvalid, setCredentialIsInvalid] = useState(false);
  const [inputIsEmpty, setInputIsEmpty] = useState(false);
  const [loginIsLoading, setLoginIsLoading] = useState(false);
  const [loginIsError, setLoginIsError] = useState<Error | null>(null);

  const loginInputChangeHandler =
    createGenericChangeHandler(setLoginInformation);

  const handleSubmit = async () => {
    setInputIsEmpty(false);
    setCredentialIsInvalid(false);
    if (
      loginInformation.nrp === DEFAULT_FORM_CONTENT.nrp ||
      loginInformation.password === DEFAULT_FORM_CONTENT.password
    ) {
      setInputIsEmpty(true);
    } else {
      setLoginIsLoading(true);
      try {
        const response = await fetch(
          JWT_REQUEST_URL,
          jwtRequestPayload(loginInformation),
        );

        const responseBody: LoginResponse = await response.json();

        if (response.ok) {
          sessionStorage.setItem("session_token", responseBody.jwt);
          navigate("/approve");
        } else {
          setCredentialIsInvalid(true);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const error: Error = new Error(
          `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
        );
        setLoginIsError(error);
      } finally {
        setLoginIsLoading(false);
      }
    }
  };

  return (
    <Primitive
      isLoading={[loginIsLoading]}
      isErr={[loginIsError]}
      componentName="Login.tsx"
      pageTitle="Login"
    >
      <div className="flex flex-col gap-2">
        {credentialIsInvalid && (
          <TipBox label="Invalid Credentials" variant="red" />
        )}
        {inputIsEmpty && (
          <TipBox label="Please fill out both NRP and Password" variant="red" />
        )}

        <div className="flex flex-col gap-2 lg:max-w-1/4">
          <TextInput
            label="NRP"
            name="user-nrp"
            id="user-nrp"
            requiredInput
            variant="black"
            isDisabled={false}
            value={loginInformation.nrp}
            onChangeHandler={loginInputChangeHandler("nrp")}
          />
          <PasswordInput
            label="Password"
            name="user-password"
            id="user-password"
            requiredInput
            variant="black"
            isDisabled={false}
            value={loginInformation.password}
            onChangeHandler={loginInputChangeHandler("password")}
          />

          <div
            className="flex"
            onClick={() => {
              handleSubmit();
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
