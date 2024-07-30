import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Transition } from "@headlessui/react";
import VerificationModal from "~/components/AuthLayout/Modal/VerificationModal";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import InputField from "~/components/common/InputField";
import { NotificationChannel, VerificationType } from "~/apis/handlers/users/enums";
import SelectBox from "~/components/common/SelectBox";
import { UsersService } from "~/apis/handlers/users";
import { useFetch } from "~/hooks/useFetch";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import type { ISelectBoxOption } from "~/components/interfaces";
import { useCreate } from "~/hooks/useCreate";
import Toast from "~/components/common/Toast";
import AuthLayout from "../layout";

const Signup = () => {
  const router = useRouter();
  const usersService = new UsersService();
  // form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [country, setCountry] = useState<{ name: string; id: string }>();

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(router.asPath.split('?')[1]));
  const [validCredentials, setValidCredentials] = useState(false);
  const [countryOptions, setCountryOptions] = useState<ISelectBoxOption[]>([]);
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  const [isQueryParamsSet, setIsQueryParamsSet] = useState(false);
  const [passwordHints, setPasswordHints] = useState({
    uppercase: {
      value: true,
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
  });
  const validatePassword = (password: string) => {
    // Password Criteria
    const minLength = 8;
    const hasLowerCase = /(?=.*[a-z])/;
    const hasUpperCase = /(?=.*[A-Z])/;
    const hasDigit = /(?=.*\d)/;
    const hasSpecialChar = /(?=.*[@#%$!%*?&_])/;

    const isValidLength = password.length >= minLength;
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
  };

  const validateEmail = (email: string) => {
    // Email Criteria
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    setEmailValid(isValidEmail);
  };

  // handle form field changes
  const handleFirstNameChange = (value: string) => {
    setFirstName(value.trim());
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value.trim());
  };

  const handleEmailChange = (value: string) => {
    validateEmail(value);
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setShowHints(value.length > 0);
    validatePassword(value);
    setPassword(value);
  };

  const handleCountryChange = (option: ISelectBoxOption) => {
    setCountry({ name: option.displayText, id: option.value });
  };

  // validate form fields and set credentialsValid flag
  useEffect(() => {
    let isCredentialsValid: boolean;
    if (firstName && lastName && emailValid && passwordValid && country?.name) isCredentialsValid = true;
    else isCredentialsValid = false;
    setValidCredentials(isCredentialsValid);
  }, [emailValid, passwordValid, firstName, lastName, country]);

  // fetch all countries
  const {
    data: countries,
    isLoading: isCountryLoading,
    isSuccess: isCountrySuccess,
  } = useFetch({
    queryKey: [UsersQueryId.countries],
    queryFn: usersService.getAllCountries.bind(usersService),
  });

  // format countries to display on selectBox
  useEffect(() => {
    if (isCountrySuccess && countries) {
      const options: ISelectBoxOption[] = countries.map((country) => ({
        displayText: country.name,
        value: country._id.toString(),
        imgUrl: country.flag,
      }));
      setCountryOptions(options);
    }
  }, [isCountrySuccess, countries]);

  // Setup query to backend
  const {
    mutate: signupUser,
    isError,
    isPending,
    error,
    isSuccess,
    data,
  } = useCreate({
    mutationFn: usersService.signupUser.bind(usersService),
  });

  const handleSignUp = () => {
    signupUser({
      firstName,
      lastName,
      email,
      password,
      countryId: country?.id ? Number(country.id) : 89, // default to Nigeria
      countryName: country?.name ?? "Nigeria", // default to Nigeria
    });
  };

  // signup successful. Set query params and open verification modal
  useEffect(() => {
    if (isSuccess && data) {
      setSearchParams(
        (prev) => {
          const newSearchParams = new URLSearchParams(prev);
          newSearchParams.set("userid", data.id);
          newSearchParams.set("recipient", data.email);
          return newSearchParams;
        }
      );
      setShowVerificationModal(true);
    }
  }, [isSuccess, data]);

  // ensure query params are set
  useEffect(() => {
    if (searchParams.get("userid") && searchParams.get("recipient")) {
      setIsQueryParamsSet(true);
    }
  }, [searchParams]);

  const handleVerificationSuccess = async () => {
    setIsVerificationSuccess(true);
  };

  return (
    <>
      <section className="py-[100px] md:px-[20px] flex max-[768px]:justify-center max-[768px]:pt-[0px]">
        <div className="max-w-[419px] w-full">
          <header className="text-center mb-[40px]">
            <p className="text-[32px] text-[#102477] font-extrabold">Lets get started</p>
            <div className="flex items-center justify-center gap-x-[13px]">
              <p className="font-bold text-[#B25E09]">Create your Trader app account </p>
              <img src="/images/auth/coins.png" alt="coins" width={54} />
            </div>
          </header>
          <form className="space-y-[16px]">
            {/* first name */}
            <div className="flex flex-col gap-y-[8px]">
              <InputField
                type={"text"}
                placeholder="Enter your First name"
                labelText={"First Name"}
                onChange={handleFirstNameChange}
              />
            </div>
            {/* last name */}
            <div className="flex flex-col gap-y-[8px]">
              <InputField
                type={"text"}
                placeholder="Enter your Last name"
                labelText={"Last Name"}
                onChange={handleLastNameChange}
              />
            </div>
            {/* email address */}
            <div className="flex flex-col gap-y-[8px]">
              <InputField
                onChange={handleEmailChange}
                pattern={"[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"}
                type={"text"}
                placeholder={"Enter your email address"}
                labelText={"Email address"}
              />
            </div>
            {/* country */}
            <div className="flex flex-col gap-y-[8px]">
              <SelectBox
                labelText="Country"
                isSearchable={true}
                options={countryOptions}
                placeholder={isCountryLoading ? "Loading..." : "Select country"}
                setOption={handleCountryChange}
              />
            </div>
            {/* password */}
            <div className="flex flex-col gap-y-[8px]">
              <InputField
                onChange={handlePasswordChange}
                type={"password"}
                placeholder="-------------"
                labelText={"Password"}
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
              <button
                type="button"
                className="transition-opacity duration-300 bg-[#1836B2] rounded-2xl p-[10px] font-semibold w-full text-white disabled:opacity-60"
                onClick={handleSignUp}
                disabled={!validCredentials || isPending}
              >
                Sign up
              </button>
              <div className="text-[#08123B] text-center" onClick={() => {}}>
                Already have an account?{" "}
                <strong
                  className="text-[#1836B2] font-bold cursor-pointer"
                  onClick={() => {
                    router.push(LAYOUT_ROUTES.auth + ROUTES.login);
                  }}
                >
                  Sign in
                </strong>
              </div>
            </div>
          </form>
        </div>
      </section>
      {isQueryParamsSet && (
        <VerificationModal
          openModal={showVerificationModal}
          setOpenModal={() => setShowVerificationModal(true)}
          isSuccess={isVerificationSuccess}
          setIsSuccess={handleVerificationSuccess}
          notificationChannel={NotificationChannel.EMAIL}
          verificationType={[VerificationType.UPDATE, VerificationType.AUTHENTICATE]}
          redirectTo={LAYOUT_ROUTES.account}
        />
      )}
      {isError && (
        <Toast
          type="error"
          variant="filled"
          title="Signup Error"
          message={error?.message ?? "Signup error"}
          autoVanish
          autoVanishTimeout={10}
        />
      )}
    </>
  );
};

Signup.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;
export default Signup;