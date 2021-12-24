import express from 'express';
import routes from './routes/index';

const app = express();
app.use('/', routes);
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

export default app;
