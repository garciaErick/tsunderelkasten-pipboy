<%*
const today = tp.date.now("YYYY-MM-DD dddd");
const fileName = `${today}.md`;
const {file, success} = await tp.user.getFileByTitle(tp, fileName);
if(!success){
    return;
}
tp.user.openFile(file.path);
%>