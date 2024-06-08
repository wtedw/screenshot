const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const key = process.env.GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(key);

function fileToGenerativePart(path, mimeType) {
return {
    inlineData: {
    data: Buffer.from(fs.readFileSync(path)).toString('base64'),
    mimeType,
    },
};
}

async function run() {
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generation_config:{"response_mime_type": "application/json"}, "temp": 0.5});

const prompt =  `what is the url in this chrome screenshot and provide a summary of the content\nUsing this JSON schema:\nScreenshot = {\"url\": str, \"summary\": str}\nReturn a 'Screenshot'`;

const imageParts = [
    fileToGenerativePart('chromess.png', 'image/png'),
];

const result = await model.generateContent([prompt, ...imageParts]);
const response = await result.response;
// console.log(response);

const text = response.text();
// console.log(text);


const cleanString = text.trim().replace(/^```json\s*|.*?```$/gm, '');
// console.log(cleanString);

const resJSON = JSON.parse(cleanString);
// console.log(resJSON);
console.log(resJSON.url);
}

run();