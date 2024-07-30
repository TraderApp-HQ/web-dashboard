import React from "react";

interface IProps {
  color?: string;
}

const UserProfileIcon: React.FC<IProps> = ({ color }) => {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.618 19.25C16.618 15.648 12.602 12.72 9.00002 12.72C5.39802 12.72 1.38202 15.648 1.38202 19.25M9.00002 9.456C10.1545 9.456 11.2617 8.99738 12.0781 8.18104C12.8944 7.36469 13.353 6.25749 13.353 5.103C13.353 3.94851 12.8944 2.84131 12.0781 2.02496C11.2617 1.20862 10.1545 0.75 9.00002 0.75C7.84553 0.75 6.73833 1.20862 5.92198 2.02496C5.10564 2.84131 4.64702 3.94851 4.64702 5.103C4.64702 6.25749 5.10564 7.36469 5.92198 8.18104C6.73833 8.99738 7.84553 9.456 9.00002 9.456Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

UserProfileIcon.defaultProps = {
  color: "#414141",
};

export default UserProfileIcon;
