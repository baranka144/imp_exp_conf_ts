interface Article {
    title: string;
    content: any;
}

async function getArticles(url: string,email: string, token: string): Promise<Article[]> {
    let base64AuthString = btoa(`${email}:${token}`)
    const response = await fetch(`${url}/wiki/api/v2/pages?body-format=ATLAS_DOC_FORMAT`, {
        headers: {
            Authorization: `Basic ${base64AuthString}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as Promise<any>;
    const articles: Article[] = (await data).results.map((result: any) => ({
        title: result.title,
        content: result.body.atlas_doc_format.value,
    }));
    
    return articles;
}

const url = "https://yargynkin.atlassian.net";
const email = "gramax.team@ics-it.ru";
const token = "";

async function fetchArticles() {
    const articles: Article[] = await getArticles(url, email, token);
    console.log(articles);
}


fetchArticles();

