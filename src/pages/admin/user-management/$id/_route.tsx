import { Outlet } from "@remix-run/react";

const Users: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Users;
