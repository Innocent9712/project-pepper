import express from 'express';
import router from './routes';
import cors from 'cors'
import swaggerDocs from './utils/swagger';


export const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors())
app.use('/api/v1/', router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  swaggerDocs(app, PORT)
});