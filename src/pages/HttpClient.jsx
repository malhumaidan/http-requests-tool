import React, { useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

const HttpClient = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleRequest = async () => {
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
    }
  };

  return (
    <div className="http-client">
      <h2>HTTP Client</h2>

      <div>
        <label>URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label>Method:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div>
        <label>Headers (JSON):</label>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='{"Content-Type": "application/json"}'
        ></textarea>
      </div>

      {method !== "GET" && (
        <div>
          <label>Body (JSON):</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
          ></textarea>
        </div>
      )}

      <button onClick={handleRequest}>Send Request</button>

      <div>
        <h3>Response:</h3>
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
  );
};

export default HttpClient;
