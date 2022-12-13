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

function EditableDiv(props: Props) {
    const [html, setHtml] = useState(props.html);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = divRef.current;
        if (!el) return;

        if (props.html !== el.innerHTML) {
            el.innerHTML = props.html;
        }

        replaceCaret(el);
    });

    const emitChange = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if (evt.nativeEvent.isComposing) return;

        const el = divRef.current;
        if (!el) return;
        const elHtml = el.innerHTML;
        if (elHtml !== html) {
            const evt1 = Object.assign({}, evt, {
                target: {
                    html: elHtml,
                    content: el.innerText
                }
            });
            props.onChange(evt1);
        }
        setHtml(elHtml);
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