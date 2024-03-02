
interface Article {
  title: string;
  content: any;
}

const token = "ATATT3xFfGF0iAGCCqE5ikIv6lBb3JDW_CUCWTEbhoMTP4TPJlUVYZ2V-76DxHLECZJ3sql2woZTXxD9DC8XN8A1wg9slBmRk9Ink_7aBAzx_ySbuZeWWDDVRGHzr_kFcjf-hXebX_3CUr2zVk2rnnSlEea21L9aaForcHq34M2HdBpoPPtanyw=87E6C781";
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