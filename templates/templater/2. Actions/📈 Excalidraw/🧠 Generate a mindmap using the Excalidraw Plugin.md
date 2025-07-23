<%*
// Select text and then use insert templater
const IDX = Object.freeze({"depth":0, "text":1, "parent":2, "size":3, "children": 4, "objectId":5});

// Check if an editor is the active view
const editor = this.app.workspace.activeLeaf?.view?.editor;
if(!editor) {
    new Notice("No active editor found");
    return;
	}

// Get selected text or use entire document
let selectedText = editor.getSelection();
let lines;

if (selectedText) {
    lines = selectedText.split('\n');
    new Notice(`Processing ${lines.length} selected lines`);
} else {
    // Fallback to entire document
    lines = [];
    for(let i = 0; i < editor.lineCount(); i++) {
        lines.push(editor.getLine(i));
    }
    new Notice("No selection found, processing entire document");
}

// Initialize the tree with the title of the document as the first element
let tree = [[0, this.app.workspace.activeLeaf?.view?.getDisplayText(), -1, 0, [], 0]];

// Helper function with better error handling
function getLineProps(line) {
    const props = line.match(/^(\t*)-\s+(.*)/);
    
    if (!props) {
        return null;
    }
    
    return [props[1].length + 1, props[2]];
}

// A vector that will hold last valid parent for each depth
let parents = [0];
let validLineIndex = 1; // Start at 1 because 0 is the document title

// Load outline into tree from selected lines
for(let i = 0; i < lines.length; i++) {
    const lineProps = getLineProps(lines[i]);
    
    // Skip lines that don't match the expected format
    if (!lineProps) continue;
    
    const [depth, text] = lineProps;
    
    if(depth > parents.length) parents.push(validLineIndex);
    else parents[depth] = validLineIndex;
    
    tree.push([depth, text, parents[depth - 1], 1, []]);
    tree[parents[depth - 1]][IDX.children].push(validLineIndex);
    validLineIndex++;
}

if (tree.length <= 1) {
    new Notice("No valid outline items found in selection. Make sure lines start with '- ' and use tabs for indentation.");
    return;
}

// Recursive function to crawl the tree and identify height aka. size of each node
function crawlTree(i) {
    if(i >= tree.length) return 0;
    let size = 0;
    
    if((i + 1 >= tree.length || tree[i + 1][IDX.depth] <= tree[i][IDX.depth]) || i == tree.length - 1) {
        tree[i][IDX.size] = 1; 
        return 1; 
    }
    
    tree[i][IDX.children].forEach((node) => { 
        size += crawlTree(node);
    });
    
    tree[i][IDX.size] = size; 
    return size;   
}

crawlTree(0);

// Build the mindmap in Excalidraw
const width = 300;
const height = 100;
const ea = ExcalidrawAutomate;
ea.reset();

// Stores position offset of branch/leaf in height units
let offsets = [0];

for(let i = 0; i < tree.length; i++) {
    const depth = tree[i][IDX.depth];
    if (depth == 1) ea.style.strokeColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    
    tree[i][IDX.objectId] = ea.addText(
        depth * width,
        ((tree[i][IDX.size] / 2) + offsets[depth]) * height,
        tree[i][IDX.text],
        {box: true}
    );  
    
    // Set child offset equal to parent offset
    if((depth + 1) > offsets.length) offsets.push(offsets[depth]);
    else offsets[depth + 1] = offsets[depth];
    
    offsets[depth] += tree[i][IDX.size];
    
    if(tree[i][IDX.parent] != -1) {
        ea.connectObjects(
            tree[tree[i][IDX.parent]][IDX.objectId], "right",
            tree[i][IDX.objectId], "left",
            {startArrowHead: 'dot'}
        );
    }
}

await ea.create({onNewPane: true});

// Clear the template output so it doesn't replace your selected text
tR = "";
%>