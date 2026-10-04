export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    next();
  });

  app.get('/login/', (req, res) => {
    res.send('angel36b');
  });

  app.get('/code/', (req, res) => {
    const offset = 7;
    let filePath = import.meta.url.substring(offset);
    if (/^\/[A-Za-z]:\//.test(filePath)) {
      filePath = filePath.substring(1);
    }
    filePath = decodeURIComponent(filePath);
    createReadStream(filePath).pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    const input = req.params.input;
    const hash = crypto.createHash('sha1').update(input).digest('hex');
    res.send(hash);
  });

  const reqHandler = (req, res) => {
    const addr = req.query.addr || req.body.addr;
    http.get(addr, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        res.send(data);
      });
    });
  };

  app.get('/req/', reqHandler);
  app.post('/req/', reqHandler);

  app.all('*', (req, res) => {
    res.send('angel36b');
  });

  return app;
}