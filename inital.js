const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Assuming library is installed

// Replace with your actual API key retrieval method (e.g., from environment variable)
const key = process.env.GOOGLE_API_KEY
// console.log(key)
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
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generation_config:{"response_mime_type": "application/json"} });

const prompt = "List what is the url in this chrome screenshot and provide a summary of the content\nUsing this JSON schema:\nScreenshot = {\"url\": str, \"summary\": str}\nReturn a `list[Screenshot]`"; // Use template literal for multiline string

const imageParts = [
    fileToGenerativePart('chromess.png', 'image/png'),
    // fileToGenerativePart('image2.jpeg', 'image/jpeg'),
];

const result = await model.generateContent([prompt, ...imageParts]);
const response = await result.response;
console.log(response);

const text = response.text();

console.log(text);
// const url = text.
}

run();