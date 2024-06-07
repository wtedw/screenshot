import pathlib
import textwrap
import os
import PIL.Image
import google.generativeai as genai
import json

GOOGLE_API_KEY=os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

# for m in genai.list_models():
#   if 'generateContent' in m.supported_generation_methods:
#     print(m.name)

model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})

# different model 1.5 pro can pass strictly follow schema
# https://ai.google.dev/gemini-api/docs/api-overview#json
# https://hasanaboulhasan.medium.com/how-to-get-consistent-json-from-google-gemini-with-practical-example-48612ed1ab40

img = PIL.Image.open('chromess.png')

prompt = """
  List what is the url in this chrome screenshot and provide a summary of the content
  
  Using this JSON schema:

  Screenshot = {"url": str, "summary": str}

  Return a `list[Screenshot]`
"""

response = model.generate_content([prompt, img], stream=True)
response.resolve()

print(response)

data = json.loads(response.text)
print(data[0])
print(data[0]['url'])
