import React, { useEffect, useState } from 'react';

function TextEditor() {
    const [content, setContent] = useState('');

    useEffect(() => {

    });

    const handleKeyDown = (key: string) => {
        //setContent(content + key);
        console.log(content);
    };

    return (
        <div
            className="TextEditor"
            contentEditable="true"
            suppressContentEditableWarning={true}
            onKeyDown={(e) => handleKeyDown(e.key)}>
            {content}
        </div>
    );
}

export { TextEditor }