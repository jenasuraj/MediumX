import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.prompts import PromptTemplate


load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
model = init_chat_model("llama3-8b-8192", model_provider="groq")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ValueData(BaseModel):
    value: str
    

@app.post("/api/command")
async def receive_data(data: ValueData):

    promptData = """
    
    User's Text: {text}.
    
    Enhance the User's Text.
    Convert the User's Text into more structured form.
    Add extra things related to User's Text.
    For example if User's Text says: "Hello", then you could modify to Hello, Greetings.
    Just return the modified text of User's Text and don't add extra things like: Here's a modified version and etc.
    You don't need to return like : "Here's the updated version or anything like that, just return the modified one.
    If the User's text is about write essay,blog etc , then give detailed overview about 500 words.
    """
    
    prompt = PromptTemplate.from_template(promptData)
    chain = prompt | model
    print(f"data revieved i.e {data.value}")
    response = chain.invoke({ "text": data.value}) 
    return {"message": response.content.strip()}

       



@app.post("/api/receive")
async def receive_data(data: ValueData):

    
    print("hello")
    promptData = """
    
    User's Text: {text}.
    
    Enhance the User's Text.
    Convert the User's Text into more structured form.
    Add extra things related to User's Text.
    For example if User's Text says: "Hello", then you could modify to Hello, Greetings.
    Just return the modified text of User's Text and don't add extra things like: Here's a modified version and etc.
    You don't need to return like : "Here's the updated version or anything like that, just return the modified one
    """
    
    prompt = PromptTemplate.from_template(promptData)
    chain = prompt | model
    print(f"data revieved i.e {data.value}")
    response = chain.invoke({ "text": data.value}) 
    return {"message": response.content.strip()}


