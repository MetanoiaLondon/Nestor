require('dotenv').config();
import { useState } from "react";
import ReactMarkdown from 'react-markdown'
import Head from "next/head";
import { createParser } from "eventsource-parser";
import { Configuration, OpenAIApi } from "openai";

const openaiConfig = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

const openai = new OpenAIApi(openaiConfig);

console.log(openaiConfig.apiKey)
console.log(`Bearer ${openaiConfig.apiKey}`)

export default function Home() {

  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are Nestor, a helpful management consultant.",
    },
  ]);

  const API_URL = "https://api.openai.com/v1/chat/completions";

  const sendRequest = async () => {
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setUserMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages,
          stream: true,
        }),
      });

      const reader = response.body.getReader();

      let newMessage = "";
      const parser = createParser((event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            return;
          }
          const json = JSON.parse(event.data);
          const content = json.choices[0].delta.content;

          if (!content) {
            return;
          }

          newMessage += content;

          const updatedMessages2 = [
            ...updatedMessages,
            { role: "assistant", content: newMessage },
          ];

          setMessages(updatedMessages2);
        } else {
          return "";
        }
      });

      // eslint-disable-next-line
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        parser.feed(text);
      }
    } catch (error) {
      console.error("error");
      window.alert("Error:" + error.message);
    }
  };


  return (
    <>
      <Head>
        <title>Nestor</title>
      </Head>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <nav className="bg-white shadow w-full">
          <div className="px-4 h-14 flex justify-between items-center">
            <div className="text-2xl font-bold">Nestor: Your AI Management Consultant</div>
          </div>
          <div className="px-4 h-14 flex justify-between items-center">
            <div className="text-lg font-light">POC powered by tech from PineCone, OpenAI & LangChain</div>
          </div>
        </nav>

        {/* Message History */}
        <div className="flex-1 overflow-y-scroll">
          <div className="mx-auto w-full max-w-screen-md p-4 ">
            {messages
              .filter((msg) => msg.role !== "system")
              .map((msg, idx) => (
                <div key={idx} className="my-3">
                  <div className="font-bold">
                    {msg.role === "user" ? "Client's Query" : "Consultant's Advice"}
                  </div>
                  <div className="text-lg prose">
                    <ReactMarkdown>{msg.content}</ReactMarkdown></div>
                </div>
              ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="mx-auto w-full max-w-screen-md px-4 pt-0 pb-2 flex">
          <textarea
            className="border rounded-md text-lg p-2 flex-1"
            rows={1}
            placeholder="How can I help you..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button
            onClick={sendRequest}
            className="border rounded-md bg-blue-500 hover:bg-blue-600 text-white px-4 ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}