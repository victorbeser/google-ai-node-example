const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3002;

const upload = multer(); 

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("[API_KEY]");

async function generateText(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
        const result = await model.generateContent([prompt]);
        
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Erro ao gerar conteúdo:", error);
        return "Erro ao processar a solicitação.";
    }
}

app.post("/ai", upload.none(), async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) {
        return res.status(400).json({ error: "O campo 'prompt' é obrigatório." });
    }

    const responseText = await generateText(prompt);
    res.json({ response: responseText });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
