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
        const textArray = evt.target.content.split(/(<div>)/);
        const newArray = textArray.map(text => {
            return convertText(text);
        });

        setContent(evt.target.content);
        setHtml(newArray.join(''));
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