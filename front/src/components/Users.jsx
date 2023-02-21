// Imports
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Components
import Navbar from './Navbar'

// Services
import { getAllWorkers } from '../services/user'
// Misc.
import { removeAccentsAndNormalize, checkStartsWith } from '../utils/utils'
import back from '../assets/back.png'
import forward from '../assets/forward.png'


const Users = () => {
    let currentURL = window.location.pathname
    const navigate = useNavigate()
    const { department } = useParams()
    // Users State
    const [workers, setWorkers] = useState([])
    const [filteredWorkers, setFilteredWorkers] = useState([])
    // Departments state
    const [departments, setDepartments] = useState([])
    const [responsables, setResponsables] = useState([])
    const [locations, setLocations] = useState([])
    const [positions, setPositions] = useState([])
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
        department: 0,
        location: '',
        position: '',
        responsable: 0
    })

    const getDepartmentID = (dep) => {
        return Number(departments.filter(department => department.departamento === dep).map(({ id_departamento }) => id_departamento))
    }
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

                const responsables = [...new Set(workers.data.map(({ responsable }) => parseInt(responsable)))]
                responsables.length > 0 && setResponsables(responsables)

                const locations = [...new Set(workers.data.map(({ ubicacion }) => ubicacion))]
                setLocations(locations)

                const positions = [...new Set(workers.data.map(({ posicion }) => posicion))]
                setPositions(positions)
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

    useEffect(() => {
        // Navigating to type from Home.
        const departmentNew = String(getDepartmentID(department))
        /*
            Do not remove the ternary (departmentNew &&). When it is removed, it enters the next ternary before and there is no time 
            for the variable to do the process of extracting the ID and converting it to string.
        */
        departmentNew && (
            (department === 'list') ? onChangeHandlerInput('0', 'department') : onChangeHandlerInput((departmentNew), 'department')
        )
    }, [departments])

    const onChangeHandlerInput = (text, filterType) => {
        const modText = removeAccentsAndNormalize(text)
        // Sets new filters based on received 'text'
        const newName = filterType === 'name' ? modText : searchParams.name
        const newLastname = filterType === 'lastname' ? modText : searchParams.lastname
        const newDepartment = filterType === 'department' ? parseInt(text) : searchParams.department
        const newLocation = filterType === 'location' ? text : searchParams.location
        const newPosition = filterType === 'position' ? text : searchParams.position
        const newResponsable = filterType === 'responsable' ? parseInt(text) : searchParams.responsable
        setSearchParams({
            name: newName,
            lastname: newLastname,
            department: newDepartment,
            location: newLocation,
            position: newPosition,
            responsable: newResponsable
        })
        // Checks if any filter is empty
        const isNameEmpty = newName === '' && true
        const isLastnameEmpty = newLastname === '' && true
        const isDepartmentEmpty = newDepartment === 0 && true
        const isLocationEmpty = newLocation === '' && true
        const isPositionEmpty = newPosition === '' && true
        const isResponsableEmpty = newResponsable === 0 && true
        const results = (isNameEmpty && isLastnameEmpty && isDepartmentEmpty && isLocationEmpty && isPositionEmpty && isResponsableEmpty)
            ? workers
            : workers.filter(({ nombre, apellidos, id, id_departamento, ubicacion, posicion, responsable }) => {
                return (
                    (!isNameEmpty ? checkStartsWith(nombre, newName) : true)
                    && (!isLastnameEmpty ? checkStartsWith(apellidos, newLastname) : true)
                    && (!isDepartmentEmpty ? (id_departamento === newDepartment) : true)
                    && (!isLocationEmpty ? (ubicacion === newLocation) : true)
                    && (!isPositionEmpty ? (posicion === newPosition) : true)
                    && (!isResponsableEmpty ? (parseInt(responsable) === newResponsable) : true)
                )
            })
        setFilteredWorkers(results)
    }
    return (
        <>
            <Navbar />
            <div className="wrapper-assignment">
                <div className="container">
                    <div className="searcher">
                        <div>
                            <p>Nombre:</p>
                            <input name='name' type="text" placeholder='Nombre' autoComplete='off' value={searchParams.name} onChange={(e) => onChangeHandlerInput(e.target.value, 'name')} />
                        </div>
                        <div>
                            <p>Apellidos:</p>
                            <input name='lastname' type="text" placeholder='Apellidos' autoComplete='off' value={searchParams.lastname} onChange={(e) => onChangeHandlerInput(e.target.value, 'lastname')} />
                        </div>
                        <div>
                            <p>Departamento:</p>
                            <select onChange={(e) => onChangeHandlerInput(e.target.value, 'department')}>
                                <option value={0}>Departamento</option>
                                {departments && departments.length > 0 && departments.map(({ departamento, id_departamento }, i) => (
                                    <option key={i} className="department" value={id_departamento}>{departamento}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>Ubicación:</p>
                            <select onChange={(e) => onChangeHandlerInput(e.target.value, 'location')}>
                                <option value={''}>Ubicación</option>
                                {locations && locations.length > 0 && locations.map((ubicacion, i) => (
                                    <option key={i} className="department" value={ubicacion}>{ubicacion}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>Posición:</p>
                            <select onChange={(e) => onChangeHandlerInput(e.target.value, 'position')}>
                                <option value={''}>Posición</option>
                                {positions && positions.length > 0 && positions.map((posicion, i) => (
                                    <option key={i} className="department" value={posicion}>{posicion}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p>Responsable:</p>
                            <select onChange={(e) => onChangeHandlerInput(e.target.value, 'responsable')}>
                                <option value={0}>Responsable</option>
                                {responsables && responsables.length > 0 && responsables.map((responsable, i) => (
                                    <option key={i} className="responsable" value={responsable}>{getName(responsable)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="body">
                        <div className="worker-title">
                            <p>Nombre</p>
                            <p>Apellidos</p>
                            <p>Email</p>
                            <p>Departamento</p>
                            <p>Ubicación</p>
                            <p>Posición</p>
                            <p>Responsable</p>
                        </div>
                        {(filteredWorkers && filteredWorkers.length > 0)
                            ? filteredWorkers.map(({ nombre, apellidos, id, departamento, email, ubicacion, posicion, responsable }, i) => {
                                return (
                                    (i >= paginacion.inicio && i < paginacion.final) &&
                                    <div className="worker" key={i}
                                        onClick={() =>
                                            (currentURL === '/user-assignment')
                                                ? navigate(`/user-assignment/${id}`)
                                                : (currentURL === `/user-cancel`)
                                                    ? navigate(`/user-cancel/${id}`)
                                                    : navigate(`/user/${id}`)
                                        }>
                                        <p>{nombre}</p>
                                        <p>{apellidos}</p>
                                        <p className="worker-textLarge">{email}</p>
                                        <p>{departamento}</p>
                                        <p>{ubicacion}</p>
                                        <p>{posicion}</p>
                                        <p>{getName(parseInt(responsable))}</p>
                                    </div>
                                )
                            })
                            : <div> No existen resultados para esta búsqueda </div>
                        }
                    </div>

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
export default Users
