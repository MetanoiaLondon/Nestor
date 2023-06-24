require('dotenv').config();
import { useState } from "react";
import ReactMarkdown from 'react-markdown'
import Head from "next/head";
import { createParser } from "eventsource-parser";
import { Configuration } from "openai";

const openaiConfig = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

// Create a skill
const systemPrompt = () => {
  // Prompt text
  const promptText = `You are a business consultant that helps users by responding to their queries. 
  
  Follow these guidelines.
  1. Start by summarising the query.
  2. Advise the user whether the query is something that is encountered frequently in business or whether it is an unusual query.
  3. Then answer the query.
  4. Then select three actions that the user should take immediately.
  5. Finally ask if the user needs any further advice on parts of the answer.
  
  Focus on clear and simple and practical guidance.
  
  The style should be professional and optimistic and in a business-like tone.
  
  The answer should be less than 1000 words.
  
  Query summary: temperature = 0.7`;

  // Return the prompt text
  return promptText;
};

// Call the systemPrompt function & set the skill
const systemPromptText = systemPrompt();

// Add in some augmented knowledge
const systemContextText = "... Please use this context in your response."

export default function Home() {

  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        `'Context:' ${systemContextText} 'Question:' ${systemPromptText}`,
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
            <div className="text-2xl font-bold">Nestor: Your AI Consultant</div>
          </div>
          <div className="px-4 h-14 flex justify-between items-center">
            <div className="text-lg font-light">Powered by PineCone and OpenAI</div>
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
            placeholder="How can I advise you today?"
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