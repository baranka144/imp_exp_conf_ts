interface Article {
    title: string;
    content: any;
}

async function getArticles(url: string,email: string, token: string): Promise<Article[]> {
    let base64AuthString = btoa(`${email}:${token}`)
    const response = await fetch(`${url}/wiki/rest/api/content?type=page&expand=body.view`, {
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
const token = "ATATT3xFfGF0iAGCCqE5ikIv6lBb3JDW_CUCWTEbhoMTP4TPJlUVYZ2V-76DxHLECZJ3sql2woZTXxD9DC8XN8A1wg9slBmRk9Ink_7aBAzx_ySbuZeWWDDVRGHzr_kFcjf-hXebX_3CUr2zVk2rnnSlEea21L9aaForcHq34M2HdBpoPPtanyw=87E6C781";

async function fetchArticles() {
    const articles: Article[] = await getArticles(url, email, token);
    console.log(articles);
}

fetchArticles();

export { };
