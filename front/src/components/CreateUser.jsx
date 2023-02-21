import { useEffect, useState, useContext } from 'react'
// Services
import { getAllWorkers } from '../services/user'
import { getAllLocations } from '../services/locations'
import { getAllPositions } from '../services/positions'
import { getAllDepartments } from '../services/departments'

import { createUser } from '../services/user'

import { prepareToDatabase, removeAccentsAndNormalize } from '../utils/utils'
import { MessagesContext } from '../context/messagesContext'
import { CreatePosition } from './CreatePosition'
import { CreateLocation } from './CreateLocation'
import { CreateDepartament } from './CreateDepartament'
import Loader from '../utils/Loader'

function CreateUser() {
    // Workers state.
    const [workers, setWorkers] = useState([])
    const [departments, setDepartments] = useState([])
    const [responsables, setResponsables] = useState([])
    const [locations, setLocations] = useState([])
    const [positions, setPositions] = useState([])
    const [loader, setLoader] = useState(false)

    // States to insert in DDBB.
    const [newUserInfo, setNewUserInfo] = useState({ name: '', lastname: '', user_email: '', department: 0, responsable: 0, location: 0, position: 0, isManager: null, active: 1 })
    const [isCollapsed, setIsCollapsed] = useState()
    const { addToast } = useContext(MessagesContext)

    useEffect(() => {
        (async function () {
            // Call to workers service
            const workers = await getAllWorkers()
            workers && setWorkers(workers.data)
            const locations = await getAllLocations()
            locations && setLocations(locations.data)
            const positions = await getAllPositions()
            positions && setPositions(positions.data)
            const departments = await getAllDepartments()
            departments && setDepartments(departments.data)
            const onlyActive = workers.data.length > 0 && workers.data.filter(worker => worker.manager === 1)
            setResponsables(onlyActive)
        })()
    }, [])
    const handleSubmitStaff = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        const { name, lastname, user_email, department, responsable, location, position, isManager } = newUserInfo
        const allValuesFilled = (name && lastname && user_email && department && responsable && location && position && (isManager || !isManager)) ? true : false
        if (!allValuesFilled) {
            addToast('¡Error!', '¡Rellena todos los campos!', 'danger')
            setLoader(false)
            return
        } else {
            const regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
            const checkEmailFormat = user_email.match(regex)
            if (checkEmailFormat === null) {
                addToast('¡Error!', '¡Formato de email inválido!', 'danger')
                setLoader(false)
                return
            }
            const checkEmail = workers.map(({ email }) => email).filter(email => (removeAccentsAndNormalize(email).trim() === removeAccentsAndNormalize(user_email)))
            if (checkEmail.length > 0) {
                addToast('¡Error!', '¡El email ya existe!', 'danger')
                setLoader(false)
                return
            } else {
                // Service call to create the user.
                const newUser = await createUser(newUserInfo)
                if (newUser.status === 200) {
                    addToast('Nuevo usuario', '¡Usuario creado!', 'success')
                    setTimeout(() => { window.location.reload() }, 1500)
                } else {
                    addToast('¡Error!', '¡Error al crear usuario!', 'danger')
                    setLoader(false)
                }
            }
        }
        setLoader(false)
    }

    return (
        <>  {isCollapsed ? (
            <>
                <h1>Añadir personal</h1>
                <div className='wrapper-brand-form'>
                    <form className='userForm' onSubmit={handleSubmitStaff}>
                    {loader && <Loader />}
                        <div>
                            <p>Nombre:</p>
                            <input id='name' type='text' placeholder='Nombre' onChange={(e) => setNewUserInfo({ ...newUserInfo, name: prepareToDatabase((e.target.value).trim()) })} autoComplete='off' />
                        </div>

                        <div>
                            <p>Apellidos:</p>
                            <input id='lastName' type='text' placeholder='Apellidos' onChange={(e) => setNewUserInfo({ ...newUserInfo, lastname: prepareToDatabase((e.target.value).trim()) })} autoComplete='off' />
                        </div>

                        <div>
                            <p>Email:</p>
                            <input id='email' type='text' placeholder='Email' onChange={(e) => setNewUserInfo({ ...newUserInfo, user_email: (e.target.value).trim().toLowerCase() })} autoComplete='off' />
                        </div>

                        <div>
                            <p>Departamento:</p>
                            <select onChange={(e) => setNewUserInfo({ ...newUserInfo, department: parseInt(e.target.value) })}>
                                <option value={''}>Departamento</option>
                                {departments && departments.map(({ id, nombre }) => (
                                    <option key={id} className="department" value={id}>{nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="closeButton-user" onClick={() => {
                            setNewUserInfo({ name: '', lastname: '', user_email: '', department: 0, responsable: 0, location: 0, position: 0, isManager: null, active: 1 })
                            setIsCollapsed(!isCollapsed)
                        }}>
                            <h2>CERRAR</h2>
                        </div>

                        <div>
                            <p>Ubicación:</p>
                            <select onChange={(e) => setNewUserInfo({ ...newUserInfo, location: parseInt(e.target.value) })}>
                                <option value={''}>Ubicación</option>
                                {locations && locations.map(({ id, nombre }) => (
                                    <option key={id} className="department" value={id}>{nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <p>Posición:</p>
                            <select onChange={(e) => setNewUserInfo({ ...newUserInfo, position: parseInt(e.target.value) })}>
                                <option value={''}>Posición</option>
                                {positions && positions.map(({ id, nombre }) => (
                                    <option key={id} className="department" value={id}>{nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <p>Responsable:</p>
                            <select onChange={(e) => setNewUserInfo({ ...newUserInfo, responsable: parseInt(e.target.value) })}>
                                <option value={''}>Responsable</option>
                                {responsables && responsables.map(({ id, nombre, apellidos }) => (
                                        <option key={id} className="department" value={id}>{nombre} {apellidos}</option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <p>¿Es manager?</p>
                            <select onChange={(e) => setNewUserInfo({ ...newUserInfo, isManager: parseInt(e.target.value) })}>
                                <option value={0}>¿Es responsable?</option>
                                <option key={0} className="department" value={0}>NO</option>
                                <option key={1} className="department" value={1}>SI</option>
                            </select>
                        </div>
                        <button className='createButton'>Crear</button>
                    </form>
                </div>
            </>
        ) :
            (
                <div className="collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <h2 className='buttonCollapsed'>Añadir usuario</h2>
                </div>
            )}
            <CreateDepartament />
            <CreateLocation />
            <CreatePosition />
        </>
    )
}
export default CreateUser