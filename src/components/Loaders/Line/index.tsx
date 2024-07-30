import clsx from "clsx";
import Polygon from "../Polygon";

type LineProps = {
  width?: "sm" | "md" | "lg" | "full";
  height?: "sm" | "md" | "lg";
  className?: string;
};

const widthMapping = {
  sm: "!w-1/4",
  md: "!w-1/2",
  lg: "!w-3/4",
  full: "!w-full",
};

const heightMapping = {
  sm: "!h-2",
  md: "!h-4",
  lg: "!h-6",
};

/**
 * Renders a line loader component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.width - The width of the line loader. Default is "sm".
 * @param {string} props.height - The height of the line loader. Default is "sm".
 * @param {string} props.className - Additional CSS class names for the line loader.
 * @returns {JSX.Element} The line loader component.
 */
const Line: React.FC<LineProps> = ({ width = "sm", height = "sm", className }) => {
  const w = widthMapping[width];
  const h = heightMapping[height];

  return <Polygon size="sm" variant="rounded" className={clsx(`h-2`, w, h, className)} />;
};

Line.defaultProps = {
  width: "sm",
  height: "sm",
  className: "",
};

export default Line;
