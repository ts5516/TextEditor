import React, { useState, useRef, useEffect } from 'react';

export type EditableDivEvent = {
    target: {
        content: string,
        key: string
    }
};

interface Props {
    html: string
    content: string
    onChange: ((event: EditableDivEvent) => void)
}

type Caret = {
    start: number
    end: number
}

function EditableDiv(props: Props) {
    const divRef = useRef<HTMLDivElement>(null);
    const [caret, setCaret] = useState<Caret>({ start: 0, end: 0 });
    const [pressedkey, setPressedkey] = useState<string>('');

    useEffect(() => {
        if (divRef.current && props.html !== divRef.current.innerHTML) {
            divRef.current.innerHTML = props.html;
        }

        recoverCaret(caret);
    }, [divRef, props]);

    const emitChange = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.nativeEvent.isComposing || !divRef.current) { return; }

        props.onChange({
            target: {
                content: divRef.current.innerText,
                key: pressedkey
            }
        });

        saveCaret();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        setPressedkey(event.key);
    };

    const recoverCaret = (caret: Caret) => {
        if (!divRef.current) { return; };

        const range = document.createRange();
        range.setStart(divRef.current, 0);
        range.collapse(true);

        let nodeStack: Node[] = [divRef.current];
        let node: Node | undefined = undefined;
        let foundStart = false, stop = false;
        let charIndex = 0;

        while (!stop && nodeStack.length !== 0) {
            node = nodeStack.pop();
            if (node === undefined) {
                return;
            } else if (node.nodeType === 3 && node.nodeValue !== null) {
                const nextCharIndex = charIndex + node.nodeValue.length;
                if (!foundStart &&
                    caret.start >= charIndex && caret.start <= nextCharIndex) {
                    range.setStart(node, caret.start - charIndex);
                    foundStart = true;
                }
                if (foundStart &&
                    caret.end >= charIndex && caret.end <= nextCharIndex) {
                    range.setEnd(node, caret.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const saveCaret = () => {
        const select = window.getSelection();
        if (!select || !divRef.current) { return; }

        const range = select.getRangeAt(0);
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(divRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);

        const start = preSelectionRange.toString().length;
        const caret: Caret = pressedkey === 'Enter' ?
            {
                start: start + 1,
                end: start + range.toString().length
            } :
            {
                start: start,
                end: start + range.toString().length
            }

        setCaret(caret);
    }

    return (
        <div
            className='Contenteditable'
            ref={divRef}
            onInput={emitChange}
            onKeyDown={handleKeyDown}
            contentEditable
            suppressContentEditableWarning={true}
        >
        </div>
    );
}

export { EditableDiv }