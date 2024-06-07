# screenshot


## API gemini calls

### to run just create a .env file and put your google api key that you get from https://makersuite.google.com/app/apikey
```GOOGLE_API_KEY = <copy api key here>```

### the only thing to note is that I only python has the setting to return json for js you have to generate the json yourself:
```generation_config={"response_mime_type": "application/json"})```
^ the python model setting for json which I don't think is on nodejs

### single example works well so far