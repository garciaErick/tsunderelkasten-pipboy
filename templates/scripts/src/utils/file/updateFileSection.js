async function updateFileSection(tp, filePath, fullHeading, newContent) {
    try {
        let desiredHeadingLevel = "##";
        let sectionName = fullHeading.trim();
        const headingMatch = fullHeading.match(/^(#+)\s*(.+)$/);
        if (headingMatch) {
            desiredHeadingLevel = headingMatch[1];
            sectionName = headingMatch[2].trim();
        }
        
        const file = tp.app.vault.getAbstractFileByPath(filePath);
        if (!file) {
            return {
                success: false,
                message: `File not found: ${filePath}`
            };
        }
        
        let content = await tp.app.vault.read(file);
        
        const lines = newContent.split('\n');
        const cleanContent = lines.slice(1).join('\n').trim();
        
        const headingRegex = new RegExp(`^(#+)\\s*${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$`, 'gm');
        const match = content.match(headingRegex);
        
        if (match) {
            const existingHeadingLevel = match[0].match(/^#+/)[0];
            const sectionStart = content.indexOf(match[0]);
            
            let sectionEnd = content.length;
            const nextHeadingRegex = new RegExp(`^#{1,${existingHeadingLevel.length}}\\s`, 'gm');
            nextHeadingRegex.lastIndex = sectionStart + match[0].length;
            const nextMatch = nextHeadingRegex.exec(content);
            
            if (nextMatch) {
                sectionEnd = nextMatch.index;
            }
            
            const beforeSection = content.substring(0, sectionStart);
            const afterSection = content.substring(sectionEnd);
            
            const finalContent = `${existingHeadingLevel} ${sectionName}\n${cleanContent}`;
            
            const needsNewline = !beforeSection.endsWith('\n');
            content = beforeSection + (needsNewline ? '\n' : '') + finalContent + afterSection;
        } else {
            const finalContent = `${desiredHeadingLevel} ${sectionName}\n${cleanContent}`;
            
            if (content.trim() === '') {
                content = finalContent;
            } else {
                content += '\n' + finalContent;
            }
        }
        
        await tp.app.vault.modify(file, content);
        return {
            success: true,
            message: `Section "${sectionName}" updated in ${file.basename}`,
            file: file
        };
    } catch (error) {
        return {
            success: false,
            message: `Error updating section: ${error.message}`
        };
    }
}
module.exports = updateFileSection;