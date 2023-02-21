//Imports
import { createContext, useEffect, useState, useCallback } from 'react';

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

export const MessagesContext = createContext();
export const MessagesProvider = ({ children }) => {

    const [messagges, setMessagges] = useState([]);

    //Agregar Mensaje
    // 3 tipos: danger - warning - success
    const addToast = useCallback((title, body, type) => {
        setMessagges(messagges => [...messagges, { title, body, type }])
    }, [setMessagges]);


    useEffect(() => {
        if (messagges.length > 0) {
            const contador = setTimeout(() => { setMessagges(messagges => messagges.slice(1)) }, 3000);
            return () => clearTimeout(contador)
        }
    }, [messagges])

    return (
        <MessagesContext.Provider value={{ addToast }}>
            {children}
            <div className='messagesPadre'>
                {(messagges.length > 0) && messagges.map(({ title, body, type }, i) => (
                    <div key={i} className={`card ${type}`}>
                        <div className='header'>
                            <FontAwesomeIcon icon={faExclamation} />
                            <p>{title}</p>
                        </div>
                        <p className='body'>{body}</p>
                    </div>
                ))}
            </div>
        </MessagesContext.Provider>
    );
};