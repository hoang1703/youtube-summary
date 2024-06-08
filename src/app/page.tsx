"use client";

import { useState } from "react";
import { getSummary } from "./actions";
import xml2js from "xml2js";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Home() {
  const [generation, setGeneration] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [xml, setXml] = useState<any[]>([]);
  let parser = new xml2js.Parser();

  return (
    <div>
      <h1>Youtube Summary</h1>
      <input
        type="text"
        placeholder="Video ID"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
      />
      <br />
      <br />
      <button
        onClick={async () => {
          const { text, xml } = await getSummary(videoId);
          setGeneration(text);
          parser.parseString(xml, function (err, result) {
            setXml(result.transcript.text);
          });
        }}
      >
        Summary
      </button>
      <div>{generation}</div>

      <h2>XML</h2>
      {xml.map((item, index) => (
        <div key={index}>
          <p>
            {item?._} (start: {item?.$?.start}, dur: {item?.$?.dur})
          </p>
        </div>
      ))}
    </div>
  );
}
