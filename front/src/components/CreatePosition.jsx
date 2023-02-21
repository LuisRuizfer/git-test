import { useEffect, useState, useContext } from 'react'
import { MessagesContext } from '../context/messagesContext'
import { prepareToDatabase, removeAccentsAndNormalize } from '../utils/utils'
import { createPosition, getAllPositions } from '../services/positions'
import Loader from '../utils/Loader'

export const CreatePosition = () => {
    const { addToast } = useContext(MessagesContext)
    const [loader, setLoader] = useState(false)

    // Positions States.
    const [positions, setPositions] = useState([])
    const [suggestedPositions, setSuggestedPositions] = useState([])
    const [positionText, setpositionText] = useState('')

    const [isCollapsed, setIsCollapsed] = useState()

    useEffect(() => {
        (async function () {
            // Call to positions service
            const positions = await getAllPositions()
            positions.data.length > 0 && setPositions(positions.data)
        })()
    }, [])

    const onChangeHandlePosition = (position) => {
        // Uppercases the position typed
        let modText = removeAccentsAndNormalize(position)
        let matches = []
        if (position.length > 0) {
            matches = positions.filter((position) => {
                // Uppercases the position from the database to compare and filter
                const upperCasedposition = removeAccentsAndNormalize(position.nombre)
                const regex = new RegExp(`^${modText}`)
                return upperCasedposition.match(regex)
            })
        }
        // Set the current suggested positions
        setSuggestedPositions(matches)
        setpositionText(prepareToDatabase(position))
    }

    const handleSubmitPosition = async (e) => {
        e.preventDefault()
        setLoader(true)
       
        if (positionText.length > 0) {
            const checkIfExist = positions.map(position => position.nombre).filter(position => removeAccentsAndNormalize(position) === removeAccentsAndNormalize(positionText))
            if (checkIfExist.length > 0) {
                addToast('¡Error!', '¡La posición ya existe!', 'danger')
            } else {
                // Service call to create the position
                const newPosition = await createPosition({ nombre: prepareToDatabase(positionText) })
                if (newPosition.status === 200) {
                    addToast('Nueva posición', newPosition.data.message, 'success')
                    setTimeout(() => { window.location.reload() }, 1500)
                } else {
                    addToast('¡Error!', newPosition.data.message, 'danger')
                    setLoader(false)
                }
            }
        } else { addToast('¡Error!', '¡Introduce una posición!', 'danger') }
        setLoader(false)
    }

    return (
        <>
            {isCollapsed
                ? (<div aria-expanded={isCollapsed} >
                    <div className='wrapper-brand-form'>
                        <form onSubmit={handleSubmitPosition}>
                        {loader && <Loader />}
                            <label> Añadir posición:</label>
                            <input id='position' type='text' placeholder='Posición' onChange={(e) => onChangeHandlePosition(e.target.value)} value={positionText} autoComplete='off' />
                            <button className='createButton'>Crear</button>
                        </form>
                        {
                            suggestedPositions.length > 0 && (<div className='suggestedText'>
                                <p>POSICION EXISTENTE</p>
                                {suggestedPositions.map(({ nombre, id }, i) => (
                                    <div key={i} ><p>{nombre}</p></div>))}
                            </div>)
                        }
                        <div className="closeButton" onClick={() => setIsCollapsed(!isCollapsed)}><h2>CERRAR</h2></div>
                    </div>
                </div>)
                : (<div className="collapse-button"
                    onClick={() => setIsCollapsed(!isCollapsed)}>
                    <h2 className='buttonCollapsed'>Crear posición</h2>
                </div>)}
        </>
    )
}
