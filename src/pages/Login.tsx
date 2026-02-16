import { useState } from "react";
import Primitive from "../components/Primitive.tsx";
import TextInput from "../components/TextInput.tsx";
import { resolveColorMappings } from "../helper/tailwindColorResolver.ts";
import { Link } from "react-router-dom";
import { createGenericChangeHandler } from "../helper/genericInputHandler.ts";
import PasswordInput from "../components/PasswordInput.tsx";

interface LoginInformation {
  nrp: string;
  password: string;
}

const LOGIN_INFORMATION_DEFAULT_VALUE: LoginInformation = {
  nrp: "",
  password: "",
};

const Login = () => {
  const [loginInformation, setLoginInformation] = useState<LoginInformation>(
    LOGIN_INFORMATION_DEFAULT_VALUE,
  );
  const loginInformationOnChangeHandler =
    createGenericChangeHandler(setLoginInformation);

  return (
    <Primitive>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 max-w-1/4">
          <TextInput
            label="NRP"
            name="user-nrp"
            id="user-nrp"
            requiredInput
            variant="yellow"
            isDisabled={false}
            value={loginInformation.nrp}
            onChangeHandler={loginInformationOnChangeHandler("nrp")}
          />
          <PasswordInput
            label="Password"
            name="user-password"
            id="user-password"
            requiredInput
            variant="yellow"
            isDisabled={false}
            value={loginInformation.password}
            onChangeHandler={loginInformationOnChangeHandler("password")}
          />
          <div
            className={`text-xs lg:text-sm xl:text-base | w-max text-white font-bold flex items-center px-4 py-2 rounded-xl ${resolveColorMappings("yellow", "button")} select-none`}
            onClick={() => {
              console.log(loginInformation);
              setLoginInformation(LOGIN_INFORMATION_DEFAULT_VALUE);
            }}
          >
            {" "}
            <button type="button">Sign in</button>
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
