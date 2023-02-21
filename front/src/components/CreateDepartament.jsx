// import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { MessagesContext } from '../context/messagesContext'
import { createDepartament, getAllDepartments } from '../services/departments'
import Loader from '../utils/Loader'
import { removeAccentsAndNormalize } from '../utils/utils'


export const CreateDepartament = () => {
    const { addToast } = useContext(MessagesContext)
    const [loader, setLoader] = useState(false)

    // Departaments States.
    const [departaments, setDepartament] = useState([])
    const [suggestedDepartament, setSuggestedDepartament] = useState([])
    const [departamentText, setDepartamentText] = useState('')
    
    const [isCollapsed, setIsCollapsed] = useState()

    useEffect(() => {
        (async function () {
            // Call to departaments service.
            const departaments = await getAllDepartments()
            departaments.data.length > 0 && setDepartament(departaments.data)
        })()
    }, [])

    const onChangeHandleDepartament = (departament) => {
        // Uppercases the departament typed.
        let modText = removeAccentsAndNormalize(departament)
        let matches = []
        if (departament.length > 0) {
            matches = departaments.filter((departament) => {
                // Uppercases the departament from the database to compare and filter
                const upperCasedDepartament = removeAccentsAndNormalize(departament.nombre)
                const regex = new RegExp(`^${modText}`)
                return upperCasedDepartament.match(regex)
            })
        }
        // Set the current suggested departaments.
        setSuggestedDepartament(matches)
        setDepartamentText(departament)
    }

    const handleSubmitDepartament = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        if (departamentText.length > 0) {
            const checkIfExist = departaments.map(departament => departament.nombre).filter(departament => removeAccentsAndNormalize(departament) === removeAccentsAndNormalize(departamentText))
            if (checkIfExist.length > 0) {
                addToast('¡Error!', '¡El departamento ya existe!', 'danger')
            } else {
                // Service call to create the departament
                const newdepartament = await createDepartament({ nombre: departamentText.charAt(0).toUpperCase() + departamentText.slice(1).toLowerCase() })
                if (newdepartament.status === 200) {
                    addToast('Nuevo departamento', newdepartament.data.message, 'success')
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)
                } else {
                    addToast('¡Error!', newdepartament.data.message, 'danger')
                    setLoader(false)
                }
            }
        } else {
            addToast('¡Error!', '¡Introduce un departamento!', 'danger')
        }
        setLoader(false)
    }


    return (
        <>
            {isCollapsed ? (
                <div aria-expanded={isCollapsed} >
                    <div className='wrapper-brand-form'>
                        <form onSubmit={handleSubmitDepartament}>
                        {loader && <Loader />}
                            <label> Añadir departamento:</label>
                            <input
                                id='departament'
                                type='text'
                                placeholder='Departamento'
                                onChange={(e) => onChangeHandleDepartament(e.target.value)}
                                value={departamentText}
                                autoComplete='off'
                            />
                            <button className='createButton'>Crear</button>
                        </form>
                        { 
                            suggestedDepartament.length > 0 && (
                                <div className='suggestedText'>
                                    <p>DEPARTAMENTO EXISTENTE</p>
                                    {suggestedDepartament.map(({ nombre, id }, i) => (
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
                        <h2 className='buttonCollapsed'>Crear departamento</h2>
                    </div>
                )}
        </>
    )
}

