import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Transition } from "@headlessui/react";
import InputField from "~/components/common/InputField";
import Button from "~/components/common/Button";
import { useCreate } from "~/hooks/useCreate";
import { UsersService } from "~/apis/handlers/users";
import Toast from "~/components/common/Toast";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import AuthLayout from "../../layout";

const ResetPassword = () => {
 const router = useRouter();
  const usersService = new UsersService();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(router.asPath.split('?')[1]));
  const [canSubmit, setCanSubmit] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const verificationToken = searchParams.get("token") ?? "";
  const userId = searchParams.get("id") ?? "";
  const [passwordHints, setPasswordHints] = useState({
    uppercase: {
      value: false,
      text: "Uppercase letters",
    },
    lowercase: {
      value: false,
      text: "Lowercase letters",
    },
    special: {
      value: false,
      text: "Special characters",
    },
    numeric: {
      value: false,
      text: "Numeric characters",
    },
    eightchar: {
      value: false,
      text: "At least 8 characters long",
    },
    confirmPassword: {
      value: false,
      text: "Passwords must match",
    },
  });

  const validatePassword = (password: string) => {
    // Password Criteria
    const minLength = 8;
    const hasLowerCase = /(?=.*[a-z])/;
    const hasUpperCase = /(?=.*[A-Z])/;
    const hasDigit = /(?=.*\d)/;
    const hasSpecialChar = /(?=.*[@#%$!%*?&_])/;
    ///(?=.*[@$!%*?&_-%])/;

    const isValidLength = password?.length >= minLength;
    const isValidLowerCase = hasLowerCase.test(password);
    const isValidUpperCase = hasUpperCase.test(password);
    const isValidDigit = hasDigit.test(password);
    const isValidSpecialChar = hasSpecialChar.test(password);

    setPasswordHints((prevHints) => ({
      ...prevHints,
      uppercase: { ...prevHints.uppercase, value: isValidUpperCase },
      lowercase: { ...prevHints.lowercase, value: isValidLowerCase },
      numeric: { ...prevHints.numeric, value: isValidDigit },
      eightchar: { ...prevHints.eightchar, value: isValidLength },
      special: { ...prevHints.special, value: isValidSpecialChar },
    }));

    const isValidate = isValidLength && isValidLowerCase && isValidUpperCase && isValidDigit && isValidSpecialChar;
    setPasswordValid(isValidate);
    return isValidate;
  };

  const validateConfirmPassword = (value: string) => {
    const doPasswordsMatch = value === password;
    setConfirmPasswordValid(doPasswordsMatch);
    setPasswordHints((prevHints) => ({
      ...prevHints,
      confirmPassword: { ...prevHints.confirmPassword, value: doPasswordsMatch },
    }));
  };

  // check if query params are set and redirect if not. This is typically used on page reload
  useEffect(() => {
    if (!verificationToken || !userId) {
      router.push("/auth/login");
      return;
    }
  }, [verificationToken, userId]);

  const handlePasswordChange = (value: string) => {
    setShowHints(value.length > 0);
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setShowHints(value.length > 0 || password.length > 0);
    setConfirmPassword(value);
  };

  useEffect(() => {
    validatePassword(password);
    validateConfirmPassword(confirmPassword);
    setCanSubmit(passwordValid && confirmPasswordValid);
  }, [passwordValid, confirmPasswordValid, password, confirmPassword]);

  // Setup query to backend
  const {
    mutate: resetPassword,
    isError,
    isPending,
    error,
    isSuccess,
    data,
  } = useCreate({
    mutationFn: usersService.resetUserPassword.bind(usersService),
  });

  const handleSubmit = () => {
    resetPassword({ verificationToken, password, userId });
  };

  useEffect(() => {
    if (isSuccess) {
      setPassword("");
      setConfirmPassword("");
      setShowHints(false);
      setCanSubmit(false);
      setTimeout(() => {
        router.push("/auth/login");
      }, 5000);
    }
  }, [isSuccess]);

  return (
    <section className="py-[100px] h-full md:px-[20px] flex items-center max-[768px]:justify-center max-[768px]:pt-[0px]">
      <div className="max-w-[419px] w-full">
        <header className="flex flex-col items-center mb-[40px]">
          <img src="/images/auth/padlock.png" width={73} alt="padlock" className="mb-[12px]" />
          <p className="text-[32px] text-[#102477] font-extrabold">Reset password</p>
          <div className="flex items-center justify-center gap-x-[13px]">
            <p className="font-bold text-[#B25E09]">Please enter a new password.</p>
          </div>
        </header>
        <form className="space-y-[16px]">
          {/* new password */}
          <div className="flex flex-col gap-y-[8px]">
            <InputField
              onChange={handlePasswordChange}
              type={"password"}
              placeholder="-------------"
              labelText={"New Password"}
              value={password}
            />
          </div>
          {/* confirm password */}
          <div className="flex flex-col gap-y-[8px]">
            <InputField
              pattern="/(?=.*[@$!%*?&])/"
              type={"password"}
              placeholder="-------------"
              labelText={"Confirm Password"}
              onChange={handleConfirmPasswordChange}
              value={confirmPassword}
            />
          </div>
          {/* password hints */}
          <Transition
            show={showHints}
            enter="transition duration-500"
            enterFrom="opacity-0 translate-x-[50%]"
            enterTo="opacity-100 translate-x-[0%]"
            leave="transition duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div>
              <p className="text-[#414141] text-[10px] mb-[8px]">Password must include:</p>
              <div className="flex flex-wrap gap-[8px] text-[10px]">
                {Object.values(passwordHints).map((hint, index) => (
                  <p
                    key={index}
                    className={`p-[4px_6px] ${
                      hint.value ? "bg-[#EDFDF8] text-[#04724D]" : "bg-[#F3F5F6] text-[#848F9F]"
                    } rounded-3xl`}
                  >
                    {hint.text}
                  </p>
                ))}
              </div>
            </div>
          </Transition>
          {/* action button */}
          <div className="p-[16px] space-y-[16px]">
            <Button
              className="w-full"
              labelText="Reset Password"
              onClick={handleSubmit}
              disabled={!canSubmit || isPending}
            />
            {isSuccess && (
              <div
                className="text-[#08123B] flex justify-center items-center gap-x-[11px] cursor-pointer"
                onClick={() => router.push(LAYOUT_ROUTES.auth + ROUTES.login)}
              >
                <img src="/icons/arrow-left.svg" alt="arrow-left" width={24} />
                Back to Login
              </div>
            )}
          </div>
        </form>
      </div>
      {isError && (
        <Toast
          type="error"
          variant="filled"
          title={error?.name ?? "Password Reset Error"}
          message={error?.message ?? "Something went wrong resetting your password"}
          autoVanish
          autoVanishTimeout={10}
        />
      )}
      {isSuccess && (
        <Toast
          type="success"
          variant="filled"
          title={"Password Reset Successful."}
          message={data ?? "Your password was reset successfully!"}
          autoVanish
          autoVanishTimeout={10}
        />
      )}
    </section>
  );
}

ResetPassword.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;
export default ResetPassword
