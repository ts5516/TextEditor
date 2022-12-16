import { useState } from 'react';
import { EditableDivEvent, EditableDiv } from './EditableDiv';
import { getWordbook } from './wordbook';

function TextEditor() {
    const [html, setHtml] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const wordbook = getWordbook();

    const handleChange = (evt: EditableDivEvent) => {
        const contentArray = evt.target.content.replace(/\n\n/gi, '\n').split('\n');
        const converted = contentArray.map((text, index) => {
            const result = convertText(text);
            if (index > 0) {
                return '<div>' + result + '</div>';
            } else {
                return result;
            }
        }).join('\n');
        console.log(converted);
        console.log(contentArray);

        setHtml(converted);
        setContent(evt.target.content);
    }

    const convertText = (text: string): string => {
        let convertT = text;
        wordbook.forEach(word => {
            const addText = '<font color="red">' + word + '</font>';
            const regex = new RegExp(word, 'gi');
            convertT = convertT.replace(regex, addText);
        });

        return convertT;
    }

    return (
        <div className="TextEditor">
            <EditableDiv
                html={html}
                content={content}
                onChange={handleChange} />
        </div>
    );
}

export { TextEditor }