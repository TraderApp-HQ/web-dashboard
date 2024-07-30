import React from "react";

interface IProps {
  userProps: {
    username: string;
    role: string;
  };
}

const UserDetails: React.FC<IProps> = ({ userProps }) => {
  return (
    <div>
      <p className="text-black text-base font-normal leading-normal tracking-wide">Hello, {userProps.username}</p>
      <p className=" text-slate-400 text-sm font-normal leading-snug tracking-wide">Staff {userProps.role}</p>
    </div>
  );
};

export default UserDetails;
