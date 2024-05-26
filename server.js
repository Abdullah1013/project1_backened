const express= require('express'); 
const dbConnect= require('./database/index')
const errorHandler =require('./middlewares/errorHandling');
const app = express();
const router= require('./routes/index');
const PORT=5000;

app.get('/',(req,res)=>{
    res.send({msg:'hello from main'})
})
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
app.use(router);
dbConnect();

app.use(errorHandler);
app.listen(PORT,console.log(`Server Running on port: ${PORT}`))