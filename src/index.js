import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import {db} from './configs/index.js'
import route from './routes/index.js'
import {notFoundHandler} from './utils/handlers/index.js'
import {errorHandler} from './utils/handlers/index.js'

dotenv.config()

const corsOptions = {
    origin: JSON.parse(process.env.DOMAIN_CLIENT),
    credentials: true,
};
const cookieOptions = {
    secret: process.env.SECRET_KEY,
};

// init app
const app = express()
app.set('env', 'development')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser(cookieOptions));
app.use(methodOverride("_method"));

db.connect(true)

// init routes
route(app)

// Handler
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3001

app.listen(port, () => {
    const timeStart = new Date();
    console.log(`${timeStart} - App listening at http://localhost:${port} in development mode`);
})