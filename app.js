import { promises as fs, readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import express from "express";

const app = express();
const port = 8000;
app.use(express.static("html"));

const DIC_ = {
	a : getDicLines('dic/dic-a.csv'),
	b : getDicLines('dic/dic-b.csv'),
}

const FAV_ = {
	ab : 'fav/fav-ab.csv',
	a  : 'fav/fav-a.csv',
	b  : 'fav/fav-b.csv'	
}

createFavFiles();

app.get('/get/random/word/:type', (req, res) => {
	const lines = DIC_[req.params.type];
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
        const fileContent = await fs.readFile(FAV_['ab'], 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim());
		const resLines = lines.map(line => line.split(','));
		res.json(resLines);	
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/get/fav/words/:type', async (req, res) => {
	const file = FAV_[req.params.type];
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
        await fs.appendFile(FAV_['ab'], newLine, 'utf8');
        res.json({ success: true, message: 'Sentence saved successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/save/fav/word/:type/:word', async (req, res) => {
    const {type, word} = req.params;
	const file = FAV_[type];
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
	const file = FAV_[type];
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

function getDicLines(file) {
	const fileContent = readFileSync(file, 'utf8');
	const lines = fileContent.split('\n').filter(line => line.trim());
	return lines;
}

function createFavFiles() {
	Object.values(FAV_).forEach((file) => {
	  if (!existsSync(file)) {
		const dir = dirname(file);
		if (!existsSync(dir)) {
		  mkdirSync(dir, { recursive: true });
		}
		writeFileSync(file, '', 'utf8');
	  }
	});
  }