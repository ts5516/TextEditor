import { useState } from 'react';
import { EditableDivEvent, EditableDiv } from './EditableDiv';
import { getWordbook } from './wordbook';

function TextEditor() {
    const [html, setHtml] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const wordbook = getWordbook();

    const handleChange = (evt: EditableDivEvent) => {
        const contentArray = contentSplitToEnter(evt.target.content);
        const converted = contentArray.map((text, index) => {
            const result = convertText(text, evt.target.keycode);
            if (index > 0) {
                return '<div>' + result + '</div>';
            } else {
                return result;
            }
        }).join('');

        setHtml(converted);
        setContent(evt.target.content);
    }

    const contentSplitToEnter = (content: string): string[] => {
        return content.replace(/\n\n/gi, '\n').split('\n');
    }

    const convertText = (text: string, key: string): string => {
        const convertColor = convertTextColor(text);
        const convertEmpty = convertEmptyToWhitespace(convertColor);
        const convertEnd = removeEndSpaceIfKeyIsNotSpace(convertEmpty, key);

        return convertEnd;
    }

    const convertTextColor = (text: string): string => {
        let convertT = text;

        for (let word of wordbook) {
            const addText = '<font color="red">' + word + '</font>';
            const regex = new RegExp(word, 'gi');
            convertT = convertT.replace(regex, addText);
        }

        return convertT;
    }

    const convertEmptyToWhitespace = (text: string): string => {
        return text === '' ? '&nbsp;' : text;
    }

    const removeEndSpaceIfKeyIsNotSpace = (text: string, key: string)
        : string => {
        if (key !== 'Space') {
            return text.trimEnd();
        } else {
            return text;
        }
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