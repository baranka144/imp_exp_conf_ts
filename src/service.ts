import express from 'express';

interface Article {
    title: string;
    content: any;
}

// async function getArticles(url: string,email: string, token: string): Promise<Article[]> {
//     let base64AuthString = btoa(`${email}:${token}`)
//     const response = await fetch(`${url}/wiki/api/v2/pages?body-format=ATLAS_DOC_FORMAT`, {
//         headers: {
//             Authorization: `Basic ${base64AuthString}`,
//             Accept: 'application/json',
//         },
//     });

//     if (!response.ok) {
//         throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json() as Promise<any>;
//     const articles: Article[] = (await data).results.map((result: any) => ({
//         title: result.title,
//         content: result.body.atlas_doc_format.value,
//     }));
    
//     return articles;
// }

// const url = "https://yargynkin.atlassian.net";
// const email = "gramax.team@ics-it.ru";
// const token = "";

// async function fetchArticles() {
//     const articles: Article[] = await getArticles(url, email, token);
//     console.log(articles);
// }

//сервер на экспрессе

const app = express();
const port = 3000;

const allowedOrigins = ['http://localhost:5173','https://dev.gram.ax'];

const corsMiddleware = (req, res, next) => {
  const origin = req.header('Origin');
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Url, Auth-String');
  next();
};

app.use(corsMiddleware);

app.get('/json', async (req, res) => {
  try {
    let atlassianUrl: String = req.headers.url;
    let base64AuthString: String = req.get('Auth-String');
    const response = await fetch(`${atlassianUrl}/wiki/api/v2/pages?body-format=ATLAS_DOC_FORMAT`, {
        headers: {
            Authorization: `Basic ${base64AuthString}`,
            Accept: 'application/json',
        },
    });

    const data = await response.json() as Promise<any>;
    res.json(data);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching data.');
  }
});

app.listen(port, () => {
    console.log('Server started on port 3000');
  });

//

