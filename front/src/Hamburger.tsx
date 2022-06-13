
import react from 'react';


export default function Hamburger(props: {numberOfHamburgers:number}) {

    return  (
        <div>
            {props.numberOfHamburgers} Hamburgers are tasty
        </div>
    )
}