const env = require('./config/env');
const app = require('./app');

app.listen(env.port, () => {
  console.log(`Elite Suraksha API running on http://localhost:${env.port}`);
});