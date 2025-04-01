const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const http = require('http');
const fs = require('fs');
import { Request, Response } from 'express';

const PORT = 5003;
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));

app.use(fileUpload());
app.use(express.json());
app.use(express.static('./src/static'));
app.use(express.urlencoded({ extended: true }));

app.post('/users', function(req: Request, res: Response){
    try {
        if (req.body.password === "855abgc287") {
            let currentUsers = JSON.parse(fs.readFileSync('DBs/Users.json', 'utf8'));
            res.status(200).json({ message: "Успешное получение списка пользователей", users: currentUsers });
        }
        else {
            res.status(400).json({ message: "Неверный код доступа" });
        }
    }
    catch (error) {
        res.status(400).json({ message: "Ошибка получения списка пользователей" });
        console.log(error);
    }
})

app.post('/auth', function(req: Request, res: Response){
    try {
        const { fio, number, status } = req.body;
        let newUser = { fio, number, status };
        let currentUsers = JSON.parse(fs.readFileSync('DBs/Users.json', 'utf8'));
        let updatedUsers = JSON.stringify([...currentUsers, newUser], null, 2);
        fs.writeFileSync('DBs/Users.json', updatedUsers);
        res.status(200).json({ message: "Успешная регистрация" });
    }
    catch (error) {
        res.status(400).json({ message: "Ошибка регистрации" });
        console.log(error);
    }
})
async function startApp() {
    try {
        server.listen(PORT, () => console.log('Server started at PORT' + " " + PORT));
    } catch (error) {
        console.error(error);
    }
}

startApp();
