
const testJson = {
    "type": "doc",
    "content": [
        {
            "type": "paragraph",
            "content": [
                {
                    "text": "Текст",
                    "type": "text"
                }
            ]
        },
        {
            "type": "paragraph",
            "content": [
                {
                    "text": "Зачёркнутый текст",
                    "type": "text",
                    "marks": [
                        {
                            "type": "strike"
                        }
                    ]
                }
            ]
        },
        {
            "text": "Подстрочный текст",
            "type": "text",
            "marks": [
                {
                    "type": "subsup",
                    "attrs": {
                        "type": "sub"
                    }
                }
            ]
        }
    ]
}

type JSONContent = {
    type?: string;
    attrs?: Record<string, any>;
    content?: JSONContent[];
    marks?: {
        type: string;
        attrs?: Record<string, any>;
        [key: string]: any;
    }[];
    text?: string;
    [key: string]: any;
};


function convertConfluenceTextNode(textNode: JSONContent): JSONContent {
    if (textNode.marks) {
        textNode.marks = textNode.marks.filter((element) => element.type == "strong" ||
            element.type == "em")
        // Не знаю как лучше реализовать удаление marks если они пустые
        if (textNode.marks.length == 0) textNode.marks = undefined
    }
    return textNode;
}

function convertConfluenceNodeToGramaxNode(confluenceNode: JSONContent): JSONContent {
    //Временно выделяю каждый элемент, чтобы мне нагляднее было
    if (confluenceNode.type == "doc") return confluenceNode;
    if (confluenceNode.type == "paragraph") return confluenceNode;
    if (confluenceNode.type == "text") return convertConfluenceTextNode(confluenceNode);
    return confluenceNode;
}

function convertConfluenceToGramax(confluenceJSON: JSONContent): JSONContent {
    const gramaxJSON = convertConfluenceNodeToGramaxNode(confluenceJSON);
    if (confluenceJSON.content) {
        gramaxJSON.content = confluenceJSON.content.map((content: JSONContent) => {
            return convertConfluenceToGramax(content);
        });
    }
    return gramaxJSON;
}

console.log(JSON.stringify(convertConfluenceToGramax(testJson)));