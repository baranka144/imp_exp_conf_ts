
interface Article {
  title: string;
  content: any;
}

const text = `gramax.team@ics-it.ru:${token}`;

fetch('https://yargynkin.atlassian.net/wiki/rest/api/content', {
  headers: {
    Authorization: `Basic ${btoa(text)}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
}
})
  .then(response => response.json() as Promise<any>)
  .then(data => {
    console.log(data.results.map((result: any) => ({
      title: result.title,
      content: result._expandable
  })))
  })
    
    
    //   console.log(
    //     `Response: ${response.status} ${response.statusText}`
    //   );
    //   return response.text();
    // })
    // .then(text => console.log(text))
    // .catch(err => console.error(err));