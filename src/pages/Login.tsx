import { useState } from "react";
import Primitive from "../components/Primitive";
import TextInput from "../components/TextInput";
import { resolveColorMappings } from "../helper/tailwindColorResolver";
import { Link } from "react-router-dom";
import { createGenericChangeHandler } from "../helper/genericInputHandler";

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
        <div className="flex gap-2 flex-wrap">
          <TextInput
            label="NRP"
            name="user-nrp"
            id="user-nrp"
            requiredInput={true}
            variant="yellow"
            isDisabled={false}
            value={loginInformation.nrp}
            onChangeHandler={loginInformationOnChangeHandler("nrp")}
          />
          <TextInput
            label="Password"
            name="user-password"
            id="user-password"
            requiredInput={true}
            variant="yellow"
            isDisabled={false}
            value={loginInformation.password}
            onChangeHandler={loginInformationOnChangeHandler("password")}
          />
          <div
            className={`text-xs lg:text-sm xl:text-base | text-white font-bold flex items-center px-4 rounded-xl ${resolveColorMappings("yellow", "button")} select-none`}
            onClick={() => {
              console.log(loginInformation);
              setLoginInformation(LOGIN_INFORMATION_DEFAULT_VALUE);
            }}
          >
            {" "}
            Sign in
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
