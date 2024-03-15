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

function convertConfluenceParagraphNode(paragraphNode: JSONContent): JSONContent {
	if (paragraphNode.marks) delete paragraphNode.marks; //убрать отступы в paragraph
	return paragraphNode;
}

function convertConfluenceTextNode(textNode: JSONContent): JSONContent {
	if (textNode.marks) {
		textNode.marks = textNode.marks.filter((element) => element.type == "strong" ||
			element.type == "em" ||
			element.type == "link");
		if (textNode.marks.length == 0) delete textNode.marks;
	};
	return textNode;
}

function convertConfluenceHeadingNode(headingNode: JSONContent): JSONContent {
	return headingNode;
}

function convertConfluenceBulletListNode(bulletListNode: JSONContent): JSONContent {
	bulletListNode = {
		type: "bullet_list",
		attrs: { "tight": false },
		content: bulletListNode.content
	};
	return bulletListNode;
}

function convertConfluenceOrderedListNode(orderedListNode: JSONContent): JSONContent {
	orderedListNode.type = "ordered_list";
	orderedListNode.attrs["tight"] = false;
	return orderedListNode;
}

function convertConfluenceListItemNode(listItemNode: JSONContent): JSONContent {
	listItemNode.type = "list_item";
	return listItemNode;
}

function convertConfluenceBlockQuoteNode(blockQuoteNode: JSONContent): JSONContent {
	return blockQuoteNode;
}

function convertConfluenceExpandNode(expandNode: JSONContent): JSONContent {
	expandNode.type = "cut";
	expandNode.attrs = {
		"text": expandNode.attrs["title"],
		"expanded": "true",
		"isInline": false
	}
	return expandNode;
}

function convertConfluenceCodeBlockNode(codeBlockNode: JSONContent): JSONContent {
	codeBlockNode.type = "code_block";
	codeBlockNode.attrs = {
		"params": codeBlockNode.attrs["language"]
	}
	return codeBlockNode;
}

function convertConfluencePanelNode(panelNode: JSONContent): JSONContent {
	panelNode.type = "note";
	let type = "";
	switch (panelNode.attrs["panelType"]) {
		case "info":
			type = "info";
			break;
		case "error":
			type = "danger";
			break;
		case "note":
			type = "tip";
			break;
		case "warning":
			type = "note";
			break;
		default:
			type = "info";
			break;

	}
	panelNode.attrs = {
		"type": type,
		"title": "Заголовок"
	}
	return panelNode;
}

function convertConfluenceTableNode(tableNode: JSONContent): JSONContent {
	if (tableNode.attrs) delete tableNode.attrs;
	return tableNode;
}

function convertConfluenceTableRowNode(tableRowNode: JSONContent): JSONContent {
	return tableRowNode;
}

function convertConfluenceTableHeaderNode(tableHeaderNode: JSONContent): JSONContent {
	tableHeaderNode.attrs["colwidth"] = null;
	return tableHeaderNode;
}

function convertConfluenceTableCellNode(tableCellNode: JSONContent): JSONContent {
	tableCellNode.attrs["colwidth"] = null;
	return tableCellNode;
}

function convertConfluenceNodeToGramaxNode(confluenceNode: JSONContent): JSONContent {
	// завернуть ли doc в функцию
	if (confluenceNode.type == "doc") return confluenceNode;
	if (confluenceNode.type == "paragraph") return convertConfluenceParagraphNode(confluenceNode);
	if (confluenceNode.type == "text") return convertConfluenceTextNode(confluenceNode);
	if (confluenceNode.type == "heading") return convertConfluenceHeadingNode(confluenceNode);
	if (confluenceNode.type == "bulletList") return convertConfluenceBulletListNode(confluenceNode);
	if (confluenceNode.type == "orderedList") return convertConfluenceOrderedListNode(confluenceNode);
	if (confluenceNode.type == "listItem") return convertConfluenceListItemNode(confluenceNode);
	if (confluenceNode.type == "blockquote") return convertConfluenceBlockQuoteNode((confluenceNode));
	if (confluenceNode.type == "expand") return convertConfluenceExpandNode((confluenceNode));
	if (confluenceNode.type == "codeBlock") return convertConfluenceCodeBlockNode((confluenceNode));
	if (confluenceNode.type == "panel") return convertConfluencePanelNode((confluenceNode));
	if (confluenceNode.type == "table") return convertConfluenceTableNode((confluenceNode));
	if (confluenceNode.type == "tableRow") return convertConfluenceTableRowNode((confluenceNode));
	if (confluenceNode.type == "tableHeader") return convertConfluenceTableHeaderNode((confluenceNode));
	if (confluenceNode.type == "tableCell") return convertConfluenceTableCellNode((confluenceNode));
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
