import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa"; // Import icons from react-icons

const ResponseSection = ({
  response,
  error,
  statusCode,
  handleCopy,
  copied,
}) => {
  const getStatusIcon = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300)
      return <FaCheckCircle className="text-green-500" />;
    if (statusCode >= 400 && statusCode < 500) {
      console.log("here");
      return <FaExclamationCircle className="text-yellow-500" />;
    }
    if (statusCode >= 500) return <FaTimesCircle className="text-red-500" />;
    return <FaCheckCircle className="text-gray-500" />;
  };

  return (
    <div className="mt-6 w-[95%] bg-white shadow-lg rounded-lg p-8 relative">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        Response:
        {statusCode && (
          <span className="ml-2">{getStatusIcon(statusCode)}</span>
        )}
      </h3>

      {/* Copy Button */}
      <button
        className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md"
        onClick={handleCopy}
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* Response Box */}
      <div className="bg-gray-100 p-4 rounded-lg overflow-auto h-[500px]">
        {response && (
          <SyntaxHighlighter language="json" style={solarizedlight}>
            {JSON.stringify(response, null, 2)}
          </SyntaxHighlighter>
        )}
        {error && (
          <SyntaxHighlighter language="json" style={solarizedlight}>
            {JSON.stringify({ error: error }, null, 2)}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
};

export default ResponseSection;
