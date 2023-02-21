import { useEffect, useState, useContext } from 'react'
import { createNewType, getAllTypes } from '../services/types'
import { MessagesContext } from '../context/messagesContext'
import { removeAccentsAndNormalize, prepareToDatabase } from '../utils/utils'
import Loader from '../utils/Loader'


export const Type = () => {
    const { addToast } = useContext(MessagesContext)
    const [loader, setLoader] = useState(false)
    
    // Types States
    const [types, setTypes] = useState([])
    const [suggestedTypes, setSuggestedTypes] = useState([])
    const [typeText, setTypeText] = useState('')

    const [isCollapsed, setIsCollapsed] = useState()

    useEffect(() => {
        (async function () {
            // Call to types service
            const types = await getAllTypes()
            types.data.length > 0 && setTypes(types.data)
        })()
    }, [])

    const onChangeHandlerType = (type) => {
        // Uppercases the brand typed
        let modText = removeAccentsAndNormalize(type)
        let matches = []
        if (type.length > 0) {
            matches = types.filter((type) => {
                // Uppercases the brand from the database to compare and filter
                const upperCasedType = removeAccentsAndNormalize(type.name)
                const regex = new RegExp(`^${modText}`)
                return upperCasedType.match(regex)
            })
        }
        // Set the current suggested brands
        setSuggestedTypes(matches)
        setTypeText(prepareToDatabase(type))
    }

    const handleSubmitType = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        if (typeText.length > 0) {
            const checkIfExist = types.map(type => type.name).filter(type => removeAccentsAndNormalize(type) === removeAccentsAndNormalize(typeText))
            if (checkIfExist.length > 0) {
                addToast('¡Error!', '¡El tipo ya existe!', 'danger')
            } else {
                // Service call to create the type
                const newType = await createNewType({ name: prepareToDatabase(typeText) })
                if (newType.status === 200) {
                    addToast('Nuevo tipo', '¡Nuevo tipo creado!', 'success')
                    setTimeout(() => { window.location.reload() }, 1500)
                    setLoader(false)
                } else { addToast('¡Error!', '¡Error al crear el tipo!', 'danger') }
            }
        } else { addToast('¡Error!', '¡Introduce un nuevo tipo!', 'danger') }
        setLoader(false)
    }

    return (
        <>
        {isCollapsed
            ? (
                <div aria-expanded={isCollapsed} >
                    <div className='wrapper-brand-form'>
                        <form onSubmit={handleSubmitType}>
                        {loader && <Loader />}
                            <label> Añade un tipo:</label>
                            <input id='type' type='text' placeholder='Tipo' onChange={(eventType) => onChangeHandlerType(eventType.target.value)} value={typeText} autoComplete='off' />
                            <button className='createButton'>Crear</button>
                        </form>
                        {
                            suggestedTypes.length > 0 && (
                                <div className='suggestedText'>
                                    <p>TIPO EXISTENTE</p>
                                    {suggestedTypes.map(({ name }, i) => (
                                        <div key={i} ><p>* {name}</p></div>))}
                                </div>)
                        }
                        <div className="closeButton" onClick={() => setIsCollapsed(!isCollapsed)}>
                            <h2>CERRAR</h2>
                        </div>
                    </div>
                </div>)
            : (
                <div className="collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <h2 className='buttonCollapsed'>TIPO</h2>
                </div>
            )
        }
        </>
    )
}

