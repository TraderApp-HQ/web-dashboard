import React from "react";
import NotificationIcon from "~/components/icons/NotificationIcon";

interface IProps {
  notificationIconProps?: {
    width?: string;
    height?: string;
  };
}

const NotificationsDropdown: React.FC<IProps> = ({ notificationIconProps }) => {
  return (
    <div className="flex items-center justify-center w-[32px] h-[32px] text-xs md:w-[40px] md:h-[40px] border border-gray-400 rounded-full p-2 cursor-pointer">
      <NotificationIcon width={notificationIconProps?.width} height={notificationIconProps?.height} />
    </div>
  );
};

export default NotificationsDropdown;
