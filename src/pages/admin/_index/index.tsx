import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";

export default function Account() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`${LAYOUT_ROUTES.admin}${ROUTES.dashboard.homepage}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div />;
}
