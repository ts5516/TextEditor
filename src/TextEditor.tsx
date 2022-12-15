import { useEffect, useState } from 'react';
import { EditableDivEvent, EditableDiv } from './EditableDiv';
import Wordbook from './wordbook.txt';

function TextEditor() {
    const [html, setHtml] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [wordbook, setWordbook] = useState<string[]>([]);

    useEffect(() => {
        fetch(Wordbook)
            .then((response) => response.text())
            .then((text) => { setWordbook(text.split('\r\n')) });
    }, []);

    const handleChange = (evt: EditableDivEvent) => {
        const contentArray = evt.target.content.split('\n');
        const htmlArray = evt.target.html.split(/<div>|<\/div>/).filter((text) => {
            return text !== '';
        });
        const newArray = contentArray.map((text, index) => {
            return convertText(text, index);
        });

        let arr = '';
        for (let i = 0; i < htmlArray.length; i++) {
            if (newArray[i] === '') {
                arr += '<div>' + htmlArray[i] + '</div>';
            } else {
                arr += '<div>' + newArray[i] + '</div>';
            }
        }

        setContent(evt.target.content);
        setHtml(arr);
    }

    const convertText = (text: string, index: number): string => {
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