//Imports
import { createContext, useState } from "react";

//Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const ModalContext = createContext();
export const ModalProvider = ({ children }) => {

    const [open, setOpen] = useState(false);
    const [content, setContent] = useState({ title: '', body: '' });

    const handleClick = data => (data) && setOpen(false)

    return (
        <ModalContext.Provider value={{ setOpen, setContent }}>
            {children}
            {(open) &&
                <div className="modal-container" data="container" onClick={e => handleClick(e.target.attributes.data)}>
                    <div className="modal-content">
                        <div className="modal-cabecera">
                            <h2>{content.title}</h2>
                            <FontAwesomeIcon icon={faTimes} onClick={() => setOpen(false)} />
                        </div>
                        <div className="modal-cuerpo">
                            {content.body}
                        </div>
                    </div>
                </div>
            }
        </ModalContext.Provider>
    );
};