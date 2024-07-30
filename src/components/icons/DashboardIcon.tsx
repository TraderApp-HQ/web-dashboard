import React from "react";
interface IProps {
  color?: string;
}

const DashboardIcon: React.FC<IProps> = ({ color = "#414141" }) => {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.66699 9.19352H6.33366C8.00033 9.19352 8.83366 8.36019 8.83366 6.69352V5.02686C8.83366 3.36019 8.00033 2.52686 6.33366 2.52686H4.66699C3.00033 2.52686 2.16699 3.36019 2.16699 5.02686V6.69352C2.16699 8.36019 3.00033 9.19352 4.66699 9.19352Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.667 9.19352H16.3337C18.0003 9.19352 18.8337 8.36019 18.8337 6.69352V5.02686C18.8337 3.36019 18.0003 2.52686 16.3337 2.52686H14.667C13.0003 2.52686 12.167 3.36019 12.167 5.02686V6.69352C12.167 8.36019 13.0003 9.19352 14.667 9.19352Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.667 19.1935H16.3337C18.0003 19.1935 18.8337 18.3602 18.8337 16.6935V15.0269C18.8337 13.3602 18.0003 12.5269 16.3337 12.5269H14.667C13.0003 12.5269 12.167 13.3602 12.167 15.0269V16.6935C12.167 18.3602 13.0003 19.1935 14.667 19.1935Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.66699 19.1935H6.33366C8.00033 19.1935 8.83366 18.3602 8.83366 16.6935V15.0269C8.83366 13.3602 8.00033 12.5269 6.33366 12.5269H4.66699C3.00033 12.5269 2.16699 13.3602 2.16699 15.0269V16.6935C2.16699 18.3602 3.00033 19.1935 4.66699 19.1935Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default DashboardIcon;
