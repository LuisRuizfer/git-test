// import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { MessagesContext } from '../context/messagesContext'
import { createLocation, getAllLocations } from '../services/locations'
import Loader from '../utils/Loader'
import { removeAccentsAndNormalize } from '../utils/utils'


export const CreateLocation = () => {
    const { addToast } = useContext(MessagesContext)
    const [loader, setLoader] = useState(false)

    // locations States.
    const [locations, setLocations] = useState([])
    const [suggestedLocations, setSuggestedLocations] = useState([])
    const [locationText, setLocationText] = useState('')
    
    const [isCollapsed, setIsCollapsed] = useState()

    useEffect(() => {
        (async function () {
            // Call to locations service
            const locations = await getAllLocations()
            locations.data.length > 0 && setLocations(locations.data)
        })()
    }, [])

    const onChangeHandleLocation = (location) => {
        // Uppercases the location typed.
        let modText = removeAccentsAndNormalize(location)
        let matches = []
        if (location.length > 0) {
            matches = locations.filter((location) => {
                // Uppercases the location from the database to compare and filter
                const upperCasedLocation = removeAccentsAndNormalize(location.nombre)
                const regex = new RegExp(`^${modText}`)
                return upperCasedLocation.match(regex)
            })
        }
        // Set the current suggested locations.
        setSuggestedLocations(matches)
        setLocationText(location)
    }

    const handleSubmitLocation = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        if (locationText.length > 0) {
            const checkIfExist = locations.map(location => location.nombre).filter(location => removeAccentsAndNormalize(location) === removeAccentsAndNormalize(locationText))
            if (checkIfExist.length > 0) {
                addToast('¡Error!', '¡La ubicación ya existe!', 'danger')
            } else {
                // Service call to create the location
                const newLocation = await createLocation({ nombre: locationText.charAt(0).toUpperCase() + locationText.slice(1).toLowerCase() })
                if (newLocation.status === 200) {
                    addToast('Nueva ubicación', newLocation.data.message, 'success')
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)
                } else {
                    addToast('¡Error!', newLocation.data.message, 'danger')
                    setLoader(false)
                }
            }
        } else {
            addToast('¡Error!', '¡Introduce una ubicación!', 'danger')
        }
        setLoader(false)
    }


    return (
        <>
            {isCollapsed ? (
                <div aria-expanded={isCollapsed} >
                    <div className='wrapper-brand-form'>
                        <form onSubmit={handleSubmitLocation}>
                        {loader && <Loader />}
                            <label> Añadir ubicación (edificio y planta):</label>
                            <input
                                id='location'
                                type='text'
                                placeholder='Ubicación'
                                onChange={(e) => onChangeHandleLocation(e.target.value)}
                                value={locationText}
                                autoComplete='off'
                            />
                            <button className='createButton'>Crear</button>
                        </form>
                        { 
                            suggestedLocations.length > 0 && (
                                <div className='suggestedText'>
                                    <p>UBICACION EXISTENTE</p>
                                    {suggestedLocations.map(({ nombre, id }, i) => (
                                        <div key={i} >
                                            <p>* {nombre}</p>
                                        </div>
                                    )
                                    )}
                                </div>
                            )
                        }
                        <div className="closeButton"
                            onClick={() => setIsCollapsed(!isCollapsed)}>
                            <h2>CERRAR</h2>
                        </div>
                    </div>
                </div>
            ) :
                (
                    <div className="collapse-button"
                        onClick={() => setIsCollapsed(!isCollapsed)}>
                        <h2 className='buttonCollapsed'>Crear ubicación</h2>
                    </div>
                )}
        </>
    )
}
