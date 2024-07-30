import React from "react";

interface UserTileProps {
  firstName?: string;
  lastName?: string;
  bgColor?: string;
  textColor?: string;
  size?: {
    width?: string;
    height?: string;
  };
}

const UserTile: React.FC<UserTileProps> = ({
  firstName,
  lastName,
  bgColor = "bg-blue-800",
  textColor = "text-white",
  size = { width: "w-[32px]", height: "h-[32px]" },
}) => {
  return (
    <div
      className={`flex items-center justify-center text-xs max-[640px]:w-[40px] max-[640px]:h-[40px] md:w-[40px] md:h-[40px] lg:w-[40px] lg:h-[40px] xl:w-[40px] xl:h-[40px] 2xl:w-[40px] 2xl:h-[40px] rounded-full p-2 md:text-sm font-semibold cursor-pointer ${textColor} ${bgColor} ${size.height} ${size.width}`}
    >
      {firstName?.charAt(0)}
      {lastName?.charAt(0)}
    </div>
  );
};

export default UserTile;
