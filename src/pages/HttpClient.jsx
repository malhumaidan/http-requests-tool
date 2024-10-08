import React, { useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiLoader } from "react-icons/fi";

const HttpClient = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState([{ key: "", value: "" }]);
  const [token, setToken] = useState(""); // State for JWT token
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">HTTP Client</h2>

      {/* Request Form */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700">
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
        </div>

        {/* JWT Token Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
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

        {/* Headers Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Headers:
          </label>
          {headers.map((header, index) => (
            <div key={index} className="flex gap-2 mb-2">
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
            </div>
          ))}
          <button
            onClick={() => handleAddField("header")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md shadow-sm"
          >
            Add Header
          </button>
        </div>

        {/* Body Input (if not GET) */}
        {method !== "GET" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Body:
            </label>
            {body.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
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
              </div>
            ))}
            <button
              onClick={() => handleAddField("body")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-md shadow-sm"
            >
              Add Body Field
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleRequest}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-sm w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="flex justify-center items-center">
              <FiLoader className="animate-spin mr-2" />
              Sending...
            </span>
          ) : (
            "Send Request"
          )}
        </button>
      </div>

      {/* Response Section */}
      <div className="mt-6 w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Response:</h3>
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
