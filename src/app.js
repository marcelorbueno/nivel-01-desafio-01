const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likesRepo = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const id = uuid();
  const { title, url, techs } = request.body;
  const likes = 0;

  const repo = { id, title, url, techs, likes };
  
  repositories.push(repo);

  const like = { id, likes }

  likesRepo.push(like);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const likes = likesRepo[repositoryIndex]['likes'];

  const repository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);
  likesRepo.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repository = repositories[repositoryIndex];
  
  const likeRepoItem = likesRepo[repositoryIndex];

  const updatedLikes = repository['likes'] + 1;

  repository['likes'] = updatedLikes;
  likeRepoItem['likes'] = updatedLikes;
  
  repositories[repositoryIndex] = repository;
  likesRepo[repositoryIndex] = likeRepoItem;

  return response.json(repository);
});

module.exports = app;
