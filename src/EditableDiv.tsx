import { memo, useState, useRef, useEffect } from 'react';

type ContentEditableEvent = EditableDivEvent;

export type EditableDivEvent = {
    target: {
        html: string,
        content: string
    }
};

interface Props {
    html: string
    content: string
    onChange: ((event: ContentEditableEvent) => void)
}

type Point = {
    X: number
    Y: number
}

function EditableDiv(props: Props) {
    const [html, setHtml] = useState(props.html);
    const divRef = useRef<HTMLDivElement>(null);
    const [caret, setCaret] = useState<Point>({ X: 0, Y: 0 });

    useEffect(() => {
        const el = divRef.current;
        if (!el) return;
        console.log('useEffect');
        if (props.html !== el.innerHTML) {
            el.innerHTML = props.html;
        }

        // getCaretPosition();
        // console.log(caret);
        replaceCaret(el);
    }, [divRef, props]);

    const emitChange = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.nativeEvent.isComposing || !divRef.current) { return; }

        console.log('start emitChange');

        const el = divRef.current;
        props.onChange({
            target: {
                html: el.innerHTML,
                content: el.innerText
            }
        });

        setCaret(getCaretPosition());
        console.log(caret);
    };

    const setCaretPosition = () => {
        // var tag = divRef.current;
        // if (tag) {
        //     // Creates range object
        //     var setpos = document.createRange();

        //     // Creates object for selection
        //     var set = window.getSelection();
        //     if (set) {
        //         // Set start position of range
        //         setpos.setStart(tag.childNodes[0], caret.Y + caret.X);

        //         // Collapse range within its boundary points
        //         // Returns boolean
        //         setpos.collapse(true);

        //         // Remove all ranges set
        //         set.removeAllRanges();

        //         // Add range with respect to range object.
        //         set.addRange(setpos);

        //         // Set cursor on focus
        //         tag.focus();
        //     }
        // }
    };

    const getCaretPosition = () => {
        let x = 0, y = 0;
        const isSupported = typeof window.getSelection !== "undefined";
        const elem = divRef.current;
        if (isSupported) {
            const selection = window.getSelection();

            if (selection && elem) {
                if (selection.rangeCount !== 0) {
                    const range = selection.getRangeAt(0).cloneRange();
                    range.selectNodeContents(elem);
                    range.setEnd(range.endContainer, range.endOffset)
                    console.log(range.toString());

                    const rect = range.getClientRects()[0];
                    if (rect) {
                        x = rect.left; // since the caret is only 1px wide, left == right
                        y = rect.top; // top edge of the caret
                    }
                }
            }
        }
        return { X: x, Y: y };
    }

    return (
        <div
            className='Contenteditable'
            ref={divRef}
            onInput={emitChange}
            contentEditable
            suppressContentEditableWarning={true}
        >
        </div>
    );
}

memo(EditableDiv, (props: Readonly<Props>, nextProps: Readonly<Props>) => {
    console.log('memo');
    return nextProps.html === props.html;
});

function replaceCaret(el: HTMLElement) {
    // Place the caret at the end of the element
    const target = document.createTextNode('');
    el.appendChild(target);
    // do not move caret if element was not focused
    const isTargetFocused = document.activeElement === el;
    if (target !== null && target.nodeValue !== null && isTargetFocused) {
        var sel = window.getSelection();
        if (sel !== null) {
            var range = document.createRange();
            range.setStart(target, target.nodeValue.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        if (el instanceof HTMLElement) el.focus();
    }
}

export { EditableDiv }