"use client";

import { useState } from "react";
import classes from "../HomepageFeatures/featureCard.module.css";
import Heading from "@theme/Heading";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { toUtf8HexString } from "@site/src/scripts/utils";
import CodeBlock from "@theme/CodeBlock";

const verifierUrlBase = "https://web2json-verifier-test.flare.rocks";
const apiKey = "00000000-0000-0000-0000-000000000000";

const attestationTypeBase = "Web2Json";
const sourceIdBase = "PublicWeb2";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export function PrepareWeb2JsonRequestCard() {
  const [url, setUrl] = useState("https://swapi.info/api/people/3");
  const [postProcessJq, setPostProcessJq] = useState(
    '{name: .name, height: .height, mass: .mass, numberOfFilms: .films | length, uid: (.url | split("/") | .[-1] | tonumber)}',
  );
  const [httpMethod, setHttpMethod] = useState("GET");
  const [headers, setHeaders] = useState("{}");
  const [queryParams, setQueryParams] = useState("{}");
  const [body, setBody] = useState("{}");
  const [abiSignature, setAbiSignature] = useState(
    `{"components": [{"internalType": "string", "name": "name", "type": "string"},{"internalType": "uint256", "name": "height", "type": "uint256"},{"internalType": "uint256", "name": "mass", "type": "uint256"},{"internalType": "uint256", "name": "numberOfFilms", "type": "uint256"},{"internalType": "uint256", "name": "uid", "type": "uint256"}],"name": "task","type": "tuple"}`,
  );

  // const contractName = useDeferredValue(data);
  const [abiEncodedRequest, setAbiEncodedRequest] = useState("");

  const { mutate } = useMutation({
    mutationFn: async () => {
      const requestBody = {
        url: url,
        httpMethod: httpMethod,
        headers: headers,
        queryParams: queryParams,
        body: body,
        postProcessJq: postProcessJq,
        abiSignature: abiSignature,
      };
      const attestationType = toUtf8HexString(attestationTypeBase);
      const sourceId = toUtf8HexString(sourceIdBase);

      const request = {
        attestationType: attestationType,
        sourceId: sourceId,
        requestBody: requestBody,
      };
      const response = await fetch(
        `${verifierUrlBase}/Web2Json/prepareRequest`,
        {
          method: "POST",
          headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(request),
        },
      );
      return response.json();
    },
    onSuccess: (result) => {
      setAbiEncodedRequest(result.abiEncodedRequest);
    },
  });

  return (
    <div className={`${classes.card} input-card margin-bottom--md`}>
      <Heading as="h3" className="input-card-title">
        Prepare a Web2Json request
      </Heading>
      <span>
        url
        <input
          type="text"
          placeholder="Enter a url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-card-input"
        />
      </span>
      <span>
        postProcessJq
        <input
          type="text"
          placeholder="Enter a jq filter"
          value={postProcessJq}
          onChange={(e) => setPostProcessJq(e.target.value)}
          className="input-card-input"
        />
      </span>
      <span>
        httpMethod
        <select
          className="input-card-input"
          value={httpMethod}
          onChange={(e) => setHttpMethod(e.target.value)}
        >
          {HTTP_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </span>
      <span>
        headers
        <input
          type="text"
          placeholder="Enter headers"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          className="input-card-input"
        />
      </span>
      <span>
        queryParams
        <input
          type="text"
          placeholder="Enter query params"
          value={queryParams}
          onChange={(e) => setQueryParams(e.target.value)}
          className="input-card-input"
        />
      </span>
      <span>
        body
        <input
          type="text"
          placeholder="Enter body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="input-card-input"
        />
      </span>
      <span>
        abiSignature
        <input
          type="textF"
          placeholder="Enter contract name"
          value={abiSignature}
          onChange={(e) => setAbiSignature(e.target.value)}
          className="input-card-input"
        />
      </span>

      <button
        onClick={() => {
          mutate();
        }}
        className="input-card-button"
        aria-label="Prepare ABI-encoded request"
        title="Prepare ABI-encoded request"
      >
        Prepare ABI-encoded request
      </button>
      <p className="input-card-result">
        <CodeBlock language="json" title="abiEncodedRequest">
          {abiEncodedRequest}
        </CodeBlock>
      </p>
    </div>
  );
}

export function PrepareWeb2JsonRequestApp() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <PrepareWeb2JsonRequestCard />
    </QueryClientProvider>
  );
}
