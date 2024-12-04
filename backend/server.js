const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Путь к файлам данных
const textsFilePath = path.join(__dirname, "data", "texts.json");
const linksFilePath = path.join(__dirname, "data", "links.json");

// Функция для чтения данных из файла
const readDataFromFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

// ==================== Эндпоинты для текстов ==================== //

// GET /texts - Отдает все тексты
app.get("/texts", (req, res) => {
  const texts = readDataFromFile(textsFilePath);
  res.json(texts);
});

// GET /texts/:id - Отдает текст по ID
app.get("/texts/:id", (req, res) => {
  const id = req.params.id;
  const texts = readDataFromFile(textsFilePath);
  const text = texts.find((item) => item.id === id);

  if (text) {
    res.json(text);
  } else {
    res.status(404).send("Text not found");
  }
});

// POST /texts - Добавление нового текста
app.post("/texts", (req, res) => {
  const newText = req.body;

  // Добавление в texts.json
  let texts = readDataFromFile(textsFilePath);
  texts.push(newText);
  fs.writeFileSync(textsFilePath, JSON.stringify(texts, null, 2));

  res.status(201).send("Text added successfully");
});

// PUT /texts/:id - Редактирование текста
app.put("/texts/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  // Обновление texts.json
  let texts = readDataFromFile(textsFilePath);
  texts = texts.map((item) =>
    item.id === id ? { ...item, ...updatedData } : item
  );
  fs.writeFileSync(textsFilePath, JSON.stringify(texts, null, 2));

  res.send("Text updated successfully");
});

// ==================== Эндпоинты для ссылок ==================== //

// GET /links - Отдает все ссылки
app.get("/links", (req, res) => {
  const links = readDataFromFile(linksFilePath);
  res.json(links);
});

// GET /links/:id - Отдает ссылку по ID
app.get("/links/:id", (req, res) => {
  const id = req.params.id;
  const links = readDataFromFile(linksFilePath);
  const link = links.find((item) => item.id === id);

  if (link) {
    res.json(link);
  } else {
    res.status(404).send("Link not found");
  }
});

// POST /links - Добавление новой ссылки
app.post("/links", (req, res) => {
  const newLink = req.body;

  // Добавление в links.json
  let links = readDataFromFile(linksFilePath);
  links.push(newLink);
  fs.writeFileSync(linksFilePath, JSON.stringify(links, null, 2));

  res.status(201).send("Link added successfully");
});

// PUT /links/:id - Редактирование ссылки
app.put("/links/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  // Обновление links.json
  let links = readDataFromFile(linksFilePath);
  links = links.map((item) =>
    item.id === id ? { ...item, ...updatedData } : item
  );
  fs.writeFileSync(linksFilePath, JSON.stringify(links, null, 2));

  res.send("Link updated successfully");
});
// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
