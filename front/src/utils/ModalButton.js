//Imports
import { useContext } from "react";
import { ModalContext } from "../context/ModalContext";

function ModalButton({ props, name, className }) {

    const { setOpen, setContent } = useContext(ModalContext);

    const openModal = () => {
        setOpen(true);
        setContent({ title: props.title, body: props.body });
    }

    return (
        <div className={`${className ? className : ''} modalButton`} onClick={() => openModal()}>
            {name ? <p>{name}</p> : ''}
        </div>
    )
}
export default ModalButton;