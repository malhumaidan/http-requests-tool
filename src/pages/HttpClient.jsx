import React, { useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiLoader } from "react-icons/fi";

const HttpClient = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const parsedBody = body ? JSON.parse(body) : null;

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">HTTP Client</h2>

      {/* Request Form */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <div className="flex gap-4 mb-4">
          {/* Method Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Method:
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          {/* URL Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              URL:
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* Headers Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Headers (JSON):
          </label>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder='{"Content-Type": "application/json"}'
            rows="3"
          ></textarea>
        </div>

        {/* Body Input (if not GET) */}
        {method !== "GET" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Body (JSON):
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder='{"key": "value"}'
              rows="3"
            ></textarea>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleRequest}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm w-full transition"
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
        <div className="bg-gray-100 rounded-lg p-4 overflow-auto h-[700px]">
          {response && (
            <SyntaxHighlighter language="json" style={solarizedlight}>
              {JSON.stringify(response, null, 2)}
            </SyntaxHighlighter>
          )}
          {error && (
            <SyntaxHighlighter language="json" style={solarizedlight}>
              {error}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    </div>
  );
};

export default HttpClient;
