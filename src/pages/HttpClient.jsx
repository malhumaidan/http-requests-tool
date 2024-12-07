import React, { useEffect, useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiLoader, FiTrash } from "react-icons/fi";

const HttpClient = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState([{ key: "", value: "" }]);
  const [token, setToken] = useState(""); // State for JWT token
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false); // State for copy status

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey && event.key === "Enter") {
        event.preventDefault(); // Prevent default browser behavior
        handleRequest(); // Trigger the send button's action
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown); // Cleanup listener
    };
  }, []);

  // Convert key-value pairs to JSON object
  const parseKeyValuePairs = (pairs) => {
    return pairs.reduce((acc, pair) => {
      if (pair.key) acc[pair.key] = pair.value;
      return acc;
    }, {});
  };

  const handleRequest = async () => {
    setLoading(true);
    try {
      // Convert headers array to object
      const parsedHeaders = parseKeyValuePairs(headers);

      // Add JWT token to headers
      if (token) {
        parsedHeaders["Authorization"] = `Bearer ${token}`;
      }

      const parsedBody = method !== "GET" ? parseKeyValuePairs(body) : null;

      const result = await axios({
        method,
        url,
        headers: parsedHeaders,
        data: parsedBody,
      });

      setResponse(result.data);
      setError(null);
    } catch (err) {
      setResponse(null);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = (type) => {
    if (type === "header") {
      setHeaders([...headers, { key: "", value: "" }]);
    } else if (type === "body") {
      setBody([...body, { key: "", value: "" }]);
    }
  };

  const handleFieldChange = (index, field, value, type) => {
    const newFields = type === "header" ? [...headers] : [...body];
    newFields[index][field] = value;
    type === "header" ? setHeaders(newFields) : setBody(newFields);
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    } else if (error) {
      navigator.clipboard.writeText(JSON.stringify({ error: error }, null, 2));
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const handleRemoveField = (index, type) => {
    if (type === "header") {
      const updatedHeaders = headers.filter((_, i) => i !== index);
      setHeaders(updatedHeaders);
    } else if (type === "body") {
      const updatedBody = body.filter((_, i) => i !== index);
      setBody(updatedBody);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">HTTP Client</h2>

      {/* Request Form */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-[95%]">
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-start">
              Method:
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 text-start">
              URL:
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="https://example.com"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleRequest}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-sm "
              disabled={loading}
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <FiLoader className="animate-spin mr-2" />
                  Sending...
                </span>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>

        {/* JWT Token Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-start">
            JWT Token:
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter JWT Token"
          />
        </div>

        {/* // Headers Input Section */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 text-start">
              Headers:
            </label>
            <button
              onClick={() => handleAddField("header")}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md shadow-sm"
            >
              Add Header
            </button>
          </div>
          {headers.map((header, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={header.key}
                onChange={(e) =>
                  handleFieldChange(index, "key", e.target.value, "header")
                }
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Key"
              />
              <input
                type="text"
                value={header.value}
                onChange={(e) =>
                  handleFieldChange(index, "value", e.target.value, "header")
                }
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Value"
              />
              <FiTrash
                onClick={() => handleRemoveField(index, "header")}
                className="text-red-500 cursor-pointer hover:text-red-700"
                size={20}
              />
            </div>
          ))}
        </div>

        {/* // Body Input Section (if not GET) */}
        {method !== "GET" && (
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 text-start">
                Body:
              </label>
              <button
                onClick={() => handleAddField("body")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-md shadow-sm"
              >
                Add Body Field
              </button>
            </div>
            {body.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={item.key}
                  onChange={(e) =>
                    handleFieldChange(index, "key", e.target.value, "body")
                  }
                  className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Key"
                />
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) =>
                    handleFieldChange(index, "value", e.target.value, "body")
                  }
                  className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Value"
                />
                <FiTrash
                  onClick={() => handleRemoveField(index, "body")}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                  size={20}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Section */}
      <div className="mt-6 w-[95%] bg-white shadow-lg rounded-lg p-8 relative">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Response:</h3>

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
    </div>
  );
};

export default HttpClient;
