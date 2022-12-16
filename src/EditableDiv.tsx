import { memo, useState, useRef, useEffect } from 'react';

type ContentEditableEvent = React.SyntheticEvent<any, Event> & EditableDivEvent;
type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
type DivProps = Modify<JSX.IntrinsicElements["div"], { onChange: ((event: ContentEditableEvent) => void) }>;

export type EditableDivEvent = {
    target: {
        html: string,
        content: string
    }
};

interface Props extends DivProps {
    html: string
    content: string
}

type Pos = {
    Y: number,
    X: number
}

function EditableDiv(props: Props) {
    const [html, setHtml] = useState(props.html);
    const divRef = useRef<HTMLDivElement>(null);
    const [caret, setCaret] = useState<Pos>({ Y: 0, X: 0 });

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
        if (el.innerHTML !== html) {
            console.log('change editor');

            props.onChange(Object.assign({}, event, {
                target: {
                    html: el.innerHTML,
                    content: el.innerText
                }
            }));
        }

        // setCaretPosition();
        // console.log(caret);
        setHtml(el.innerHTML);
    };

    return (
        <div
            className='Contenteditable'
            ref={divRef}
            onInput={emitChange}
            contentEditable
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: props.html }}>
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