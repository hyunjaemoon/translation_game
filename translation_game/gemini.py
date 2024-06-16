import os

import google.generativeai as genai

from dotenv import load_dotenv

# TODO: Migrate Translation Prompts / Gemini Interface Logic from hyunjaemoon.com

def get_model():
  load_dotenv()

  GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
  genai.configure(api_key=GEMINI_API_KEY)

  # for m in genai.list_models():
  #   if 'generateContent' in m.supported_generation_methods:
  #     print(m.name)

  return genai.GenerativeModel('gemini-1.5-flash')

if __name__ == '__main__':
  model = get_model()
  print(get_model().generate_content("What is the meaning of life?").text )
