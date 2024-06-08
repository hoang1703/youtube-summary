"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { parseString } from "xml2js";

export async function getSummary(videoId: string) {
  const res = await fetch(
    `https://youtubetranscript.com/?server_vid2=${videoId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch transcript");
  }

  const xml = await res.text();
  const data = await new Promise<string>((resolve, reject) => {
    parseString(xml, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.transcript.text.map((t: any) => t._).join(" "));
      }
    });
  });

  const prompt = `Summarize the video with this caption`;

  const { text, finishReason, usage } = await generateText({
    model: openai("gpt-3.5-turbo"),
    prompt,
  });

  return { text, finishReason, usage, xml };
}
