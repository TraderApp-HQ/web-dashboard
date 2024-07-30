import { useNavigate } from "@remix-run/react";
import React, { useEffect } from "react";

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`details`);
  }, [navigate]);

  return <div />;
}
