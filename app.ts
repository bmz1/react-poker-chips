import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

const app: express.Application = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'build')));


export default app;
