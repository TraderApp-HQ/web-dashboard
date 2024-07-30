import { clsx } from "clsx";

export default function ({ className }: { className?: string }) {
    return (
        <div className={clsx("flex space-x-1", className)}>
            <span className="h-2 w-2 bg-gray-600 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-600 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-600 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-600 rounded-full"></span>
        </div>
    )
}