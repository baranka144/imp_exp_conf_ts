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
	}
	return textNode;
}

function convertConfluenceNodeToGramaxNode(confluenceNode: JSONContent): JSONContent {
	// Временно выделяю каждый элемент, чтобы мне нагляднее было
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

fs.writeFileSync(Path.join(__dirname, "./out.json"), JSON.stringify(convertConfluenceToGramax(testJson), null, 4), { encoding: "utf-8", flag: "wx" });
