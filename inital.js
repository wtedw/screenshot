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

// const imgUrl = "https://i.imgur.com/WY5B7d3.png"
const imgUrl = "https://stock.adobe.com/au/images/little-girl-looking-at-horse-poop-while-on-a-nature-walk/457419181"

const prompt = `
List what is the url in this screenshot and provide a summary of the content

Using this JSON schema:

Screenshot = {"url": str, "summary": str}

Return a \`list[Screenshot]\`

Given the image link
${imgUrl}`; // Use template literal for multiline string

console.log(prompt);

const imageParts = [
    fileToGenerativePart('chromess.png'),
    // fileToGenerativePart('image2.jpeg', 'image/jpeg'),
];

const result = await model.generateContent([prompt]);
// const result = await model.generateContent([prompt, ... imageParts]);
const response = await result.response;
console.log(response);

const text = response.text();
console.log(text);

// trying with the tempurature settings

const cleanString = text.trim().replace(/^```json\s*|.*?```$/gm, '');

console.log(cleanString);

// const resJSON = JSON.parse(cleanString);
// console.log(resJSON);
// console.log(resJSON.url);
}

run();