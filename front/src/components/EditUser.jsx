import { useEffect, useState, useContext } from 'react'
// Services
import { editUser, getAllWorkers } from '../services/user'
// Misc.
import { removeAccentsAndNormalize, checkStartsWith } from '../utils/utils'
import { MessagesContext } from '../context/messagesContext'
import back from '../assets/back.png'
import forward from '../assets/forward.png'
import Loader from '../utils/Loader'


function EditUser() {
    // Workers state.
    const [workers, setWorkers] = useState([])
    const [filteredWorkers, setFilteredWorkers] = useState([])

    const { addToast } = useContext(MessagesContext)
    const [loader, setLoader] = useState(false)

    const [emails, setEmails] = useState([])
    const [departments, setDepartments] = useState([])
    const [responsables, setResponsables] = useState([])
    console.log('emails: ', emails)

    const [locations, setLocations] = useState([])
    const [positions, setPositions] = useState([])
    const [managers, setManagers] = useState([])
    // Pagination
    const [page, setPage] = useState(1)
    const [paginacion, setPaginacion] = useState({ inicio: 0, final: 10 })
    const [totalPaginacion, setTotalPaginacion] = useState([])
     // Steper pagination.
     const handleNext = () => {
        if (page <= totalPaginacion.length) { setPage(page + 1) }
    }
    const handleBack = () => {
        if (page > 0) { setPage(page - 1) }
    }
    // Filter state
    const [searchParams, setSearchParams] = useState({
        name: '',
        lastname: '',
        email: '',
        department: 0,
        location: 0,
        position: 0,
        responsable: 0,
        manager: 3
    })

    const [toEdit, setToEdit] = useState({
        id_to_edit: 0,
        isOpen: false
    })

    const [changeDataUser, setChangeDataUser] = useState({
        id: 0,
        nombre: '',
        apellidos: '',
        email: '',
        id_departamento: 0,
        id_edificio_planta: 0,
        id_posicion: 0,
        responsable: 0,
        manager: 3
    })

    useEffect(() => {
        (async function () {
            // Call to workers service
            const workers = await getAllWorkers()
            // workers.data.length > 0 && setWorkers(workers.data)
            const onlyActive = workers.data.length > 0 && workers.data.filter(worker => worker.activo === 1)
            setFilteredWorkers(onlyActive)
            setWorkers(onlyActive)
            if (workers.data.length > 0) {
                const departments = workers.data
                    .map(({ id_departamento, departamento }) => ({ id_departamento: id_departamento, departamento: departamento }))
                    .filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.id_departamento === value.id_departamento && t.departamento === value.departamento)))
                departments.length > 0 && setDepartments(departments)

                const emails = [...new Set(workers.data.map(({ email }) => email))]
                emails.length > 0 && setEmails(emails)

                const responsables = [...new Set(workers.data.map(({ responsable }) => parseInt(responsable)))]
                responsables.length > 0 && setResponsables(responsables)

                const locations = workers.data
                    .map(({ id_ubicacion, ubicacion }) => ({ id_ubicacion: id_ubicacion, ubicacion: ubicacion }))
                    .filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.id_ubicacion === value.id_ubicacion && t.ubicacion === value.ubicacion)))
                locations.length > 0 && setLocations(locations)

                const positions = workers.data
                    .map(({ id_posicion, posicion }) => ({ id_posicion: id_posicion, posicion: posicion }))
                    .filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.id_posicion === value.id_posicion && t.posicion === value.posicion)))
                positions.length > 0 && setPositions(positions)

                const managers = [...new Set(workers.data.map(({ manager }) => parseInt(manager)))]
                setManagers(managers)
            }
        })()
    }, [])
    useEffect(() => {
        if (filteredWorkers && filteredWorkers.length > 0) {
            //Calcular la paginacion total
            let auxArr = []
            for (let i = 0; i < Math.ceil(filteredWorkers.length / 10); i++) {
                auxArr.push(i + 1)
            }
            setTotalPaginacion(auxArr)
            // Número de páginas
            const variable = page - 1
            setPaginacion({ inicio: 10 * variable, final: 10 * page })
        }
    }, [filteredWorkers, page])

    const getName = (id) => {
        return workers.filter(worker => worker.id === id).map(({ nombre, apellidos }) => `${nombre} ${apellidos}`).join('')
    }

    const selectManager = (id) => {
        const yes = 'Sí'
        const no = 'No'
        if (id === 0) { return no } 
        else { return yes }
    }

    const onChangeHandlerInput = (text, filterType) => {
        const modText = removeAccentsAndNormalize(text)
        // Sets new filters based on received 'text'
        const newName = filterType === 'name' ? modText : searchParams.name
        const newLastname = filterType === 'lastname' ? modText : searchParams.lastname
        const newEmail = filterType === 'email' ? modText : searchParams.email
        const newDepartment = filterType === 'department' ? parseInt(text) : searchParams.department
        const newLocation = filterType === 'location' ? parseInt(text) : searchParams.location
        const newPosition = filterType === 'position' ? parseInt(text) : searchParams.position
        const newResponsable = filterType === 'responsable' ? parseInt(text) : searchParams.responsable
        const newManager = filterType === 'manager' ? parseInt(text) : searchParams.manager
        setSearchParams({
            name: newName,
            lastname: newLastname,
            email: newEmail,
            department: newDepartment,
            location: newLocation,
            position: newPosition,
            responsable: newResponsable,
            manager: newManager
        })
        // Checks if any filter is empty
        const isNameEmpty = newName === '' && true
        const isLastnameEmpty = newLastname === '' && true
        const isEmailEmpty = newEmail === '' && true
        const isDepartmentEmpty = newDepartment === 0 && true
        const isLocationEmpty = newLocation === 0 && true
        const isPositionEmpty = newPosition === 0 && true
        const isResponsableEmpty = newResponsable === 0 && true
        const isManagerEmpty = newManager === 3 && true
        const results = (isNameEmpty && isLastnameEmpty && isEmailEmpty && isDepartmentEmpty
            && isLocationEmpty && isPositionEmpty && isResponsableEmpty && isManagerEmpty)
            ? workers
            : workers.filter(({ nombre, apellidos, email, id, id_departamento, id_ubicacion, id_posicion, responsable, manager }) => {
                return (
                    (!isNameEmpty ? checkStartsWith(nombre, newName) : true)
                    && (!isLastnameEmpty ? checkStartsWith(apellidos, newLastname) : true)
                    && (!isEmailEmpty ? checkStartsWith(email, newEmail) : true)
                    && (!isDepartmentEmpty ? (id_departamento === newDepartment) : true)
                    && (!isLocationEmpty ? (parseInt(id_ubicacion) === newLocation) : true)
                    && (!isPositionEmpty ? (parseInt(id_posicion) === newPosition) : true)
                    && (!isResponsableEmpty ? (parseInt(responsable) === newResponsable) : true)
                    && (!isManagerEmpty ? (parseInt(manager) === newManager) : true)
                )
            })
        setFilteredWorkers(results)
    }

    const sendChanges = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        const { id } = changeDataUser
        const userToEdit = await editUser(changeDataUser, id)
        if (userToEdit.status === 200) {
            addToast('Edición de usuario', userToEdit.data.message, 'success')
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } else {
            addToast('¡Error!', userToEdit.data.message, 'danger')
        }
        setLoader(false)
    }

    return (
        <>
            <div className="materialsPadre">
                <div className="materialTable">
                    <h1>Edición de usuario</h1>
                </div>

                <div className="searcher-editUser">
                    <div>
                        <p>Nombre:</p>
                        <input name='name' type="text" placeholder='Nombre'
                            autoComplete='off' value={searchParams.name}
                            onChange={(e) => onChangeHandlerInput(e.target.value, 'name')}
                        />
                    </div>

                    <div>
                        <p>Apellidos:</p>
                        <input name='lastname' type="text" placeholder='Apellidos'
                            autoComplete='off' value={searchParams.lastname}
                            onChange={(e) => onChangeHandlerInput(e.target.value, 'lastname')}
                        />
                    </div>

                    <div>
                        <p>Email:</p>
                        <input name='email' type="text" placeholder='Email'
                            autoComplete='off' value={searchParams.email}
                            onChange={(e) => onChangeHandlerInput(e.target.value, 'email')}
                        />
                    </div>

                    <div>
                        <p>Departamento:</p>
                        <select onChange={(e) => onChangeHandlerInput(e.target.value, 'department')}>
                            <option value={0}>Departamento</option>
                            {departments && departments.length > 0 &&
                                departments.map(({ departamento, id_departamento }, i) => (
                                    <option key={i} className="department" value={id_departamento}>{departamento}</option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <p>Ubicación:</p>
                        <select onChange={(e) => onChangeHandlerInput(e.target.value, 'location')}>
                            <option value={0}>Ubicación</option>
                            {locations && locations.length > 0 &&
                                locations.map(({ id_ubicacion, ubicacion }, i) => (
                                    <option key={i} className="department" value={id_ubicacion}>{ubicacion}</option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <p>Posición:</p>
                        <select onChange={(e) => onChangeHandlerInput(e.target.value, 'position')}>
                            <option value={0}>Posición</option>
                            {positions && positions.length > 0 &&
                                positions.map(({ id_posicion, posicion }, i) => (
                                    <option key={i} className="department" value={id_posicion}>{posicion}</option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <p>Responsable:</p>
                        <select onChange={(e) => onChangeHandlerInput(e.target.value, 'responsable')}>
                            <option value={0}>Responsable</option>
                            {responsables.length > 0 &&
                                responsables.map((responsable, i) => (
                                    <option key={i} className="responsable" value={responsable}>{getName(responsable)}</option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <p>¿Es manager?</p>
                        <select onChange={(e) => onChangeHandlerInput(e.target.value, 'manager')}>
                            <option value={3}>¿Es responsable?</option>
                            {managers && managers.length > 0 &&
                                managers.map((manager, i) => (
                                    <option key={i} className="responsable" value={manager}>{selectManager(Number(manager))}</option>
                                ))}
                        </select>
                    </div>

                </div>
                <div className="header-editUser">
                    <div></div>
                    <div>Nombre</div>
                    <div>Apellidos</div>
                    <div>Email</div>
                    <div>Departamento</div>
                    <div>Ubicación</div>
                    <div>Posición</div>
                    <div>Responsable</div>
                    <div>¿Es manager?</div>
                </div>

                <div name="model" id="model">
                    {
                        (filteredWorkers && filteredWorkers.length > 0) &&
                        (filteredWorkers.map(({ id, nombre, apellidos, email, id_departamento, departamento, id_posicion, posicion, id_ubicacion, ubicacion, responsable, manager }, i) => {
                            return (
                                (i >= paginacion.inicio && i < paginacion.final) &&
                                <div key={i} className=''>
                                    {(toEdit.isOpen === true && toEdit.id_to_edit === id)
                                        ? (
                                            <form onSubmit={sendChanges} className='editUser-toEdit'>
                                                 {loader && <Loader />}
                                                <div className='buttonCollapsed-edit'
                                                    onClick={() => {
                                                        setToEdit({ id_to_edit: parseInt(id), isOpen: !(toEdit.isOpen) })
                                                        setChangeDataUser({
                                                            id: 0,
                                                            nombre: '',
                                                            apellidos: '',
                                                            email: '',
                                                            id_departamento: 0,
                                                            id_edificio_planta: 0,
                                                            id_posicion: 0,
                                                            responsable: 0,
                                                            manager: 0
                                                        })
                                                    }
                                                    }>
                                                    Cerrar
                                                </div>
                                                <div>
                                                    <p>Nombre:</p>
                                                    <input name='name' type="text" className="searcher-editUser-input"
                                                        placeholder={nombre} autoComplete='off'
                                                        onChange={(e) => setChangeDataUser({ ...changeDataUser, nombre: e.target.value })} />
                                                </div>

                                                <div>
                                                    <p>Apellidos:</p>
                                                    <input type="text" className="searcher-editUser-input"
                                                        placeholder={apellidos} autoComplete='off'
                                                        onChange={(e) => setChangeDataUser({ ...changeDataUser, apellidos: e.target.value })} />
                                                </div>

                                                <div>
                                                    <p>Email:</p>
                                                    <input type="text" className="searcher-editUser-input"
                                                        placeholder={email} autoComplete='off'
                                                        onChange={(e) => setChangeDataUser({ ...changeDataUser, email: e.target.value })} />
                                                </div>

                                                <div>
                                                    <p>Departamento:</p>
                                                    <select className='selectToUserEdit'
                                                        onChange={(e) => setChangeDataUser({ ...changeDataUser, id_departamento: Number(e.target.value) })}>
                                                        <option value={id_departamento}>{departamento}</option>
                                                        {departments && departments.length > 0 &&
                                                            departments.map(({ id_departamento, departamento }, i) => (
                                                                <option key={i} value={id_departamento}>{departamento}</option>
                                                            ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <p>Ubicación:</p>
                                                    <select className='ToEdit-short'
                                                        onChange={(e) => setChangeDataUser({ ...changeDataUser, id_edificio_planta: Number(e.target.value) })}>
                                                        <option value={id_ubicacion}>{ubicacion}</option>
                                                        {locations && locations.length > 0 &&
                                                            locations.map(({ id_ubicacion, ubicacion }, i) => (
                                                                // (id_ubicacion !== ubicacion) &&
                                                                <option key={i} value={id_ubicacion}>{ubicacion}</option>
                                                            ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <p>Posición</p>
                                                    <select className='selectToUserEdit'
                                                        onChange={(e) => setChangeDataUser({ ...changeDataUser, id_posicion: Number(e.target.value) })}>
                                                        <option value={id_posicion}>{posicion}</option>
                                                        {positions && positions.length > 0 &&
                                                            positions.map(({ id_posicion, posicion }, i) => (
                                                                (id_posicion !== posicion) &&
                                                                <option key={i} value={id_posicion}>{posicion}</option>
                                                            ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <p>Responsable:</p>
                                                    <select className='selectToUserEdit'
                                                        onChange={(e) => setChangeDataUser({ ...changeDataUser, responsable: Number(e.target.value) })}>
                                                        <option value={responsable}>{getName(Number(responsable))}</option>
                                                        {workers && workers.length > 0 &&
                                                            workers.map((worker, i) => (
                                                                (worker.manager === 1) &&
                                                                <option key={i} value={worker.id}>{worker.nombre} {worker.apellidos}</option>
                                                            ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <p>Manager:</p>
                                                    <select className='ToEdit-short'
                                                        onChange={(e) => setChangeDataUser({ ...changeDataUser, manager: Number(e.target.value) })}>
                                                        <option value={manager}>{selectManager(Number(manager))}</option>
                                                        {managers && managers.length > 0 &&
                                                            managers.map((manager, i) => (
                                                                <option key={i} value={manager}>{selectManager(Number(manager))}</option>
                                                            ))}
                                                    </select>
                                                </div>

                                                <button className='editButton' type='submit'>CAMBIAR</button>
                                            </form>
                                        )
                                        : (
                                            <div className='editUser-show' key={i}>
                                                <button className='buttonCollapsed-edit'
                                                    onClick={() => {
                                                        setToEdit({ id_to_edit: parseInt(id), isOpen: !(toEdit.isOpen) })
                                                        setChangeDataUser({
                                                            id: parseInt(id),
                                                            nombre: nombre,
                                                            apellidos: apellidos,
                                                            email: email,
                                                            id_departamento: id_departamento,
                                                            id_edificio_planta: id_ubicacion,
                                                            id_posicion: id_posicion,
                                                            responsable: Number(responsable),
                                                            manager: manager
                                                        })
                                                    }}>
                                                    <span className=''>Editar</span>
                                                </button>
                                                <p>{nombre}</p>
                                                <p>{apellidos}</p>
                                                <p>{email}</p>
                                                <p>{departamento}</p>
                                                <p>{ubicacion}</p>
                                                <p>{posicion}</p>
                                                <p>{getName(Number(responsable))}</p>
                                                <p>{selectManager(Number(manager))}</p>
                                            </div>
                                        )}
                                </div>
                            )
                        })
                        )
                    }

                    {filteredWorkers.length > 10 && <div className='paginacion'>
                        {page > 1 && (
                            <button onClick={handleBack} className='steperButtons'>
                                <img src={back} alt='Atrás' className='navbar__navigate-back-img' />
                                <p>Back</p>
                            </button>
                        )}
                        {    // Limit to show pagination.
                            (totalPaginacion.slice((page >= 5 && (page - 3)), (page + 2))).map(data => (
                                <div onClick={() => setPage(data)} className={data === page ? 'active' : ''} key={data}>{data}</div>
                            ))
                        }
                        {(page < totalPaginacion.length) && (
                            <button onClick={handleNext} className='steperButtons'>
                                <p>Next</p>
                                <img src={forward} alt='Siguiente' className='navbar__navigate-back-img' />
                            </button>
                        )}
                    </div>}

                </div>
            </div>
        </>
    )

}
export default EditUser
