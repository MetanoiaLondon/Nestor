# Nestor
<b>Project Nestor is a POC for an AI ChatBot for Management Consultancy utilising GPT-3.5, PineCone &amp; LangChain.</b> 

<i>It a project within the June 2023 PineCone Hackathon.</i>

### Problem
Foundation LLMs like ChatGPT have demonstrated their potential to support creative workers as an intelligent assistant.  If they could also be provided with specific data/text for the individual worker or team, then they would be able  to "augment" the knowledge of the foundation model with additional intelligence.  Research papers by OpenAI, McKinsey and others suggest this a huge area of economic improvement, that is likely to affect 40% of knowledge-based or creative work. A variety of approaches have emerged to achieve this, but a leading technology stack is emerging of a foundation LLM plus a vector database such as PineCone to store specialist knowledge/data and a chatbot UI orchestrated with tools such as LangChain.  Early applications have proven technically feasible but the measurement of their effectiveness for specific roles is under-researched.

### This Project
In essence, the project will explore this technology stack applied to the use case of an intelligent assistant that acts as a management consultant - giving advice.  The  specialist knowledge will be a specialist body of knowledge on management consultancy.  The main outcome from the project will be a POC of a management consultancy chatbot.  Along with creating it, experiments will be run to see how well it functions across the key activities along the lifecycle of consultancy.  Additionally, experiments will be run on these activities using just the foundation model and then using the specialist (or augmented) chatbot to guage how different (if at all) the outputs are.

The project could also extend to creating a memory of the outputs loaded back into the vector database for use on later queries or tasks.  In this way Nestor - a consultancy chatbot - would respond to questions, tasks, etc. by using the foundation model, the wider resources of the Internet, the augmentation knowledge base encoded into the vector database, and (over time) the accumulating rememberance of past questions and tasks it has already responded to.

Further "tuning" of the chatbot could be developed by determining what effects the technical choices made during the creation of the augmentation knowledge base, has on the outcomes.  For example how long the text chunks used are, how many text chunks are selected from the vector store or how they are injected into the prompts passed to the foundation LLM.  

The project is aiming to create a POC using a readily available knowledge base.  Other consultancy knowledge bases could then be added into the PineCone vector database to augment the AI chatbot further.

### Generalisation
By taking a modular approach the Nestor consultancy chatbot should then be able to generalise to other knowledge-based or creative work activities by changing the specialist knowledge used for augmentation. By, additionally, ensuring that any prompting chains and templates are also modular with specialisation utilising variables that can be easily changed through the equivalent of a "requirements" file, then prompting can be optimised for different specialisations.

### Implementation of PineCone Vector Database for Augmentation of Foundation LLM
1.  A set of 22 lectures on core management consultancy activities is available from the BCS in the UK and will be converted from video to text.
2.  Using LangChain these text resources will be prepared and converted into embeddings using OpenAI's embeddings algorithms (using LC).
3.  The embeddings will be loaded into PineCone to create a vector database for search.
4.  Using LangChain, prompts (consultancy questions or tasks) will be converted to embeddings (OpenAI algorithm) and then used to extract the most relevant 10 texts from the vector database.
5.  Using LangChain these will become context for prompting the LLM alongside "role", questions/tasks, and other aspects of prompt engineering.

### Implementation of the AI Chatbot GUI
1. An AI Chatbot application will be developed in ReactJS that provides the basic question and response interactions with the user
2. OpenAI API will be used within this to interact with ChatGPT-3.5-Turbo (or ideally ChatGPT-4) for foundation LLM services
3. LangChain will be used within this to create the prompt and prompt context (including the specialsed knowedge stored in the vector DB).

### Implementing Memory
1. An additional development could be the capturing of question and answer pairs into a store for loading into another PineCone Vector DB.  This would be another source of augmentation for prompts ahead of passing the prompt to ChatGPT-3.5.



