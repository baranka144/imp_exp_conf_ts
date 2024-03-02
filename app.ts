interface Article {
    title: string;
    content: any;
}

async function getArticles(url: string,email: string, token: string): Promise<Article[]> {
    let base64AuthString = btoa(`${email}:${token}`)
    const response = await fetch(`${url}/wiki/rest/api/content`, {
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
        content: result._expandable,
    }));

    return articles;
}

const url = "https://yargynkin.atlassian.net";
const email = "gramax.team@ics-it.ru";
const token = "ATATT3xFfGF0AFD_Sha8m-EqAnmEylhhekS3o1zxIiLCPmy7a6VQas7W49rHzlVf7GFFr7i_MPDEFBXPkKbOhIJo1cqtfoXSxyJrUOlHjnYk0meuRxwqMBZSlTLyMiYBIpuGCYR2CxjgGjcN6RwbvKMt4Tp6fI2hlthDQtu04iLxSn6oPlvtKqY=EF530604";

async function fetchArticles() {
    const articles: Article[] = await getArticles(url, email, token);
    console.log(articles);
}

fetchArticles();
