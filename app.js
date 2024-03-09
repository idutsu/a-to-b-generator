import { promises as fs } from 'fs';
import express from "express";
const app = express();
const port = 8000;
app.use(express.static("html"));

const TYPE_A = 'a';
const TYPE_B = 'b';
const DIC_A  = 'dic/dic-a.csv';
const DIC_B  = 'dic/dic-b.csv';
const FAV_AB = 'fav/fav-ab.csv';
const FAV_A  = 'fav/fav-a.csv';
const FAV_B  = 'fav/fav-b.csv';

const getDicLines = async (type) => {
	const file = (type === TYPE_A) ? DIC_A : DIC_B;
	const fileContent = await fs.readFile(file, 'utf8');
	const lines = fileContent.split('\n').filter(line => line.trim());
	return lines;
}

const dicLinesA = await getDicLines(TYPE_A);
const dicLinesB = await getDicLines(TYPE_B);

app.get('/get/random/word/:type', (req, res) => {
    const type = req.params.type;
	const lines = (type === TYPE_A) ? dicLinesA : dicLinesB;
    try {
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        const randomRowArray = randomLine.split(',');
        res.json(randomRowArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/get/fav/abs', async (req, res) => {
    try {
        const fileContent = await fs.readFile(FAV_AB, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim());
		const resLines = lines.map(line => line.split(','));
		res.json(resLines);	
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/get/fav/words/:type', async (req, res) => {
	const type = req.params.type;
	const file = (type === TYPE_A) ? FAV_A : FAV_B;
    try {
        const fileContent = await fs.readFile(file, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim());
		res.json(lines);	
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/save/fav/ab/:a/:b', async (req, res) => {
    const { a, b } = req.params;
    const newLine = `${a},${b}\n`;
    try {
        await fs.appendFile(FAV_AB, newLine, 'utf8');
        res.json({ success: true, message: 'Sentence saved successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/save/fav/word/:type/:word', async (req, res) => {
    const {type, word} = req.params;
	const file = (type === TYPE_A) ? FAV_A : FAV_B;
	const newLine = `${word}\n`;
    try {
        await fs.appendFile(file, newLine, 'utf8');
        res.json({ success: true, message: 'Word saved successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/delete/fav/ab/:a/:b', async (req, res) => {
    const { a, b } = req.params;
    try {
        const fileContent = await fs.readFile(FAV_AB, 'utf8');
        const lines = fileContent.split('\n');
        const filteredLines = lines.filter(line => {
            const [currentA, currentB] = line.split(',');
            return !(currentA === a && currentB === b);
        });
        await fs.writeFile(FAV_AB, filteredLines.join('\n'), 'utf8');
        res.json({ success: true, message: 'Sentence deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/delete/fav/word/:type/:word', async (req, res) => {
    const { type, word } = req.params;
	const file = (type === TYPE_A) ? FAV_A : FAV_B;
    try {
        const fileContent = await fs.readFile(file, 'utf8');
        const lines = fileContent.split('\n');
        const filteredLines = lines.filter(line => {
            return !(line.trim() === word);
        });
        await fs.writeFile(file, filteredLines.join('\n'), 'utf8');
        res.json({ success: true, message: 'Word deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => console.log(`http://localhost:${port}`));

