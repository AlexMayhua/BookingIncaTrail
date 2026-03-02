import { useState } from "react"
import parser from 'html-react-parser'

export default function Accordion(props) {
    const [isShowing, setIsShowing] = useState(false);
    const toggle = () => {
        setIsShowing(!isShowing);
    };

    return (
        <div>
            <h3 onClick={toggle} className={isShowing ? ' bg-stone-100 py-4 px-2  mt-1.5' : 'border border-stone-200 py-4 px-2 mt-1.5'}>
                {props.title}</h3>


            <p className={isShowing ? 'block ' : 'hidden '}>
                {
                    parser(props.content)
                }
            </p>
        </div>
    );
}