import express from 'express';
import router from './routes';
import cors from 'cors'
import swaggerDocs from './utils/swagger';

//changed port to fit my system
export const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors())
app.use('/api/v1/', router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  swaggerDocs(app, PORT)
});
