import fs from "fs";
import Path from "path";
import testJson from "./in.json";

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
		textNode.marks = textNode.marks.filter((element) => element.type == "strong" || element.type == "em");
		if (textNode.marks.length == 0) delete textNode.marks;
	};
	return textNode;
}

function convertConfluenceBulletListNode(bulletListNode: JSONContent): JSONContent {
	bulletListNode = {
		type : "bullet_list",
		attrs : { "tight" : false },
		content : bulletListNode.content
	}
	return bulletListNode;
}

function convertConfluenceOrderedListNode(orderedListNode: JSONContent): JSONContent {
	orderedListNode.type = "ordered_list";
	orderedListNode.attrs["tight"] = false;
	return orderedListNode;
}

function convertConfluenceListItemNode(listItemNode: JSONContent): JSONContent {
	listItemNode.type = "list_item"
	return listItemNode;
}

function convertConfluenceNodeToGramaxNode(confluenceNode: JSONContent): JSONContent {
	// Временно выделяю каждый элемент, чтобы мне нагляднее было
	// Типы которые просто возвращаю без вызова функций их завернуть в функции на случай изменений или нет?
	// Просто doc и paragraph довольно базовые, вот blockquote можно думаю
	if (confluenceNode.type == "doc") return confluenceNode;
	if (confluenceNode.type == "paragraph") return confluenceNode;
	if (confluenceNode.type == "text") return convertConfluenceTextNode(confluenceNode);
	if (confluenceNode.type == "bulletList") return convertConfluenceBulletListNode(confluenceNode);
	if (confluenceNode.type == "orderedList") return convertConfluenceOrderedListNode(confluenceNode);
	if (confluenceNode.type == "listItem") return convertConfluenceListItemNode(confluenceNode);
	if (confluenceNode.type == "blockquote") return confluenceNode;
	return {};
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
//Поменял флаг wx на w, приходилось удалять out.json, так должно было быть или нет?
fs.writeFileSync(Path.join(__dirname, "./out.json"), JSON.stringify(convertConfluenceToGramax(testJson), null, 4), { encoding: "utf-8", flag: "w" });
