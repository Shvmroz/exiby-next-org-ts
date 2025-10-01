import { AlertTriangle } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="flex items-center justify-center h-[80vh] px-4">
      <div className="max-w-sm w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-blue-500" />
        </div>

        {/* Error Code + Message in one line */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
            404
          </h1>
          <span className="text-gray-400">|</span>
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
    </div>
  );
}
