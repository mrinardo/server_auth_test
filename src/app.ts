import express from 'express';
import { readFileSync } from 'fs';
import * as https from "https";
import {TLSSocket} from 'tls';

const port = 3000;
const app = express();
const opts = { key: readFileSync('certs/server_key.pem'),
              cert: readFileSync('certs/server_cert.pem'),
              requestCert: true,
              rejectUnauthorized: false,
              ca: [readFileSync('certs/server_cert.pem')]
            };

app.get('/', (req, res) => {
    res.send('<a href="signin">Signin with a valid client certificate</a>')
});

app.get('/signin', (req, res) => {
    const cert = ((req.socket) as TLSSocket).getPeerCertificate();

    if ( ((req.socket) as TLSSocket).authorized && cert.subject) {
        res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`)
    } else if (cert.subject) {
        res.status(403).send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not accepted here.`)
    } else {
        res.status(401).send('Sorry, but you need to provide a client certificate to continue.')
    }
});

https.createServer(opts, app).listen(port, () => {
    console.log(`Sample app listening at https://localhost:${port}`)
});