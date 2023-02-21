// Imports.
import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useIsAuthenticated } from '@azure/msal-react'

// Components.
import Navbar from './Navbar'
import { Login } from './Login'

// Context.
import { InfoUserContext } from '../context/infoUser'
import { MessagesContext } from '../context/messagesContext'

// Services.
import { getWorker } from '../services/user'
import { getAllDataMaterials } from '../services/materials_unique'
import { createManyAssignments } from '../services/material_assignment'

// Misc.
import { removeAccentsAndNormalize, checkStartsWith } from '../utils/utils'
import back from '../assets/back.png'
import forward from '../assets/forward.png'
import Loader from '../utils/Loader'

const MaterialAssignment = () => {
    const { infoUser } = useContext(InfoUserContext)
    const { addToast } = useContext(MessagesContext)
    const navigate = useNavigate()
    const isAuthentificated = useIsAuthenticated()
    const [loader, setLoader] = useState(false)

    // Pagination
    const [page, setPage] = useState(1)
    const [paginacion, setPaginacion] = useState({ inicio: 0, final: 10 })
    const [totalPaginacion, setTotalPaginacion] = useState([])
    const [pageMaterials, setPageMaterials] = useState(1)
    const [paginacionMaterials, setPaginacionMaterials] = useState({ inicio: 0, final: 5 })
    const [totalPaginacionMaterials, setTotalPaginacionMaterials] = useState([])

    // Steper pagination.
    const handleNext = () => {
        if (page <= totalPaginacion.length) { setPage(page + 1) }
    }
    const handleBack = () => {
        if (page > 0) { setPage(page - 1) }
    }

    // Steper pagination Materials.
    const handleNextMaterials = () => {
        if (pageMaterials <= totalPaginacionMaterials.length) { setPageMaterials(page + 1) }
    }
    const handleBackMaterials = () => {
        if (pageMaterials > 0) { setPageMaterials(pageMaterials - 1) }
    }


    // Materials State
    const [workerMaterials, setWorkerMaterials] = useState([])
    const [filteredMaterials, setFilteredMaterials] = useState([])
    const [materialsWithoutWorker, setMaterialsWithoutWorker] = useState([])
    const [types, setTypes] = useState([])
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])

    // Worker State
    const [worker, setWorker] = useState([])

    // User ID
    const { id } = useParams()

    // Filter state
    const [searchParams, setSearchParams] = useState({ type: 0, brand: 0, model: 0, ga_code: '', name: '', lastname: '', onlyStorage: false })

    // Submit info
    const [submitMaterials, setSubmitMaterials] = useState({ to_storage: [], to_worker: [], assigner: infoUser.mail, worker: parseInt(id) })

    useEffect(() => {
        (async function () {
            // Call to worker service
            const worker = await getWorker(id);
            worker.data.length > 0 && setWorker(worker.data);
            worker.data[0].activo === 0 && navigate('/');
            // Call to material unique service
            const allMaterials = await getAllDataMaterials();
            const materialsMinusWorker = allMaterials.data.length > 0 && allMaterials.data.filter(mat => mat.id_trabajador !== parseInt(id))
            materialsMinusWorker.length > 0 && setFilteredMaterials(materialsMinusWorker)
            materialsMinusWorker.length > 0 && setMaterialsWithoutWorker(materialsMinusWorker)

            const matWork = allMaterials.data.filter((material) => (material.id_trabajador === parseInt(id)))
            setWorkerMaterials(matWork)

            const types = materialsMinusWorker
                .map(({ tipo, id_tipo }) => ({ tipo: tipo, id_tipo: id_tipo }))
                .filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.tipo === value.tipo && t.id_tipo === value.id_tipo)))
            types.length > 0 && setTypes(types)

            const brands = materialsMinusWorker
                .map(({ marca, id_marca }) => ({ marca: marca, id_marca: id_marca }))
                .filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.marca === value.marca && t.id_marca === value.id_marca)))
            brands.length > 0 && setBrands(brands)

            const models = materialsMinusWorker
                .map(({ modelo, id_modelo }) => ({ modelo: modelo, id_modelo: id_modelo }))
                .filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.modelo === value.modelo && t.id_modelo === value.id_modelo)))
            models.length > 0 && setModels(models)
        })()
    }, [id])

    useEffect(() => {
        if (filteredMaterials && filteredMaterials.length > 0) {
            //Calcular la paginacion total
            let auxArr = [];
            for (let i = 0; i < Math.ceil(filteredMaterials.length / 5); i++) {
                auxArr.push(i + 1);
            }
            setTotalPaginacion(auxArr)
            // Número de páginas
            const variable = page - 1
            setPaginacion({ inicio: 5 * variable, final: 5 * page })
        }
    }, [filteredMaterials, page])

    useEffect(() => {
        if (workerMaterials && workerMaterials.length > 0) {
            //Calcular la paginacion total
            let auxArr = []
            for (let i = 0; i < Math.ceil(workerMaterials.length / 5); i++) {
                auxArr.push(i + 1)
            }
            setTotalPaginacionMaterials(auxArr)
            // Número de páginas
            const variable = pageMaterials - 1
            setPaginacionMaterials({ inicio: 5 * variable, final: 5 * pageMaterials })
        }
    }, [workerMaterials, pageMaterials])

    useEffect(() => {
        setSubmitMaterials({ ...submitMaterials, assigner: infoUser.mail })
    }, [])

    const onChangeHandlerInput = (text, filterType) => {
        // Sets new filters based on received 'text'
        const newType = filterType === 'type' ? parseInt(text) : searchParams.type
        const newBrand = filterType === 'brand' ? parseInt(text) : searchParams.brand
        const newModel = filterType === 'model' ? parseInt(text) : searchParams.model
        const newGACode = filterType === 'ga_code' ? removeAccentsAndNormalize(text) : searchParams.ga_code
        const newName = filterType === 'name' ? removeAccentsAndNormalize(text) : searchParams.name
        const newLastname = filterType === 'lastname' ? removeAccentsAndNormalize(text) : searchParams.lastname
        const onlyStorageCheck = filterType === 'only_storage' ? !searchParams.onlyStorage : searchParams.onlyStorage
        setSearchParams({
            type: newType,
            brand: newBrand,
            model: newModel,
            ga_code: newGACode,
            name: newName,
            lastname: newLastname,
            onlyStorage: onlyStorageCheck
        })
        // Checks if any filter is empty
        const isTypeEmpty = newType === 0 && true
        const isBrandEmpty = newBrand === 0 && true
        const isModelEmpty = newModel === 0 && true
        const isGACodeEmpty = newGACode === '' && true
        const isNameEmpty = newName === '' && true
        const isLastnameEmpty = newLastname === '' && true
        const isOnlyStorageEmpty = onlyStorageCheck === false && true
        const results = (isTypeEmpty && isBrandEmpty && isModelEmpty && isGACodeEmpty && isNameEmpty && isLastnameEmpty && isOnlyStorageEmpty)
            ? materialsWithoutWorker
            : materialsWithoutWorker.filter(mat => mat.id_trabajador !== parseInt(id)).filter(({ ga_code, apellidos, id_trabajador, id_tipo, id_marca, id_modelo, nombre }) => {
                return (
                    (!isTypeEmpty ? newType === id_tipo : true)
                    && (!isBrandEmpty ? newBrand === id_marca : true)
                    && (!isModelEmpty ? newModel === id_modelo : true)
                    && (!isGACodeEmpty ? checkStartsWith(ga_code, newGACode) : true)
                    && (!isNameEmpty ? checkStartsWith(nombre, newName) : true)
                    && (!isLastnameEmpty ? checkStartsWith(apellidos, newLastname) : true)
                    && (!isOnlyStorageEmpty ? id_trabajador === 1 : true)
                )
            })
        setFilteredMaterials(results)
    }

    const onAssignmentHandler = (material) => {
        const materialsToAssign = submitMaterials.to_worker.length > 0 && submitMaterials.to_worker.filter(material => material.toAssign === true).map(material => material.material_id)
        materialsToAssign
            ? !materialsToAssign.includes(material.material_id) && setSubmitMaterials({ ...submitMaterials, to_worker: [...submitMaterials.to_worker, material] })
            : setSubmitMaterials({ ...submitMaterials, to_worker: [...submitMaterials.to_worker, material] })
    }

    const deleteFromSubmit = (deleted) => {
        if (deleted.toAssign) {
            const filteredSubmitInfo = submitMaterials.to_worker.filter(mat => !(mat.material_id === deleted.material_id))
            setSubmitMaterials({ ...submitMaterials, to_worker: filteredSubmitInfo })
        } else if (deleted.toStorage) {
            const filteredSubmitInfo = submitMaterials.to_storage.filter(mat => !(mat.material_id === deleted.material_id))
            setSubmitMaterials({ ...submitMaterials, to_storage: filteredSubmitInfo })
            setWorkerMaterials([...workerMaterials, deleted])
        }
    }

    const deleteFromAssigned = (material) => {
        const filteredWorkerMaterials = workerMaterials.filter(mat => !(mat.material_id === material.material_id))
        setWorkerMaterials(filteredWorkerMaterials)
        setSubmitMaterials({ ...submitMaterials, to_storage: [...submitMaterials.to_storage, material] })
    }

    const setMaterialInfo = (value, index, type, arr) => {
        if (type === 'serial') {
            const updatedMaterials = [...submitMaterials.to_worker].map((material, i) => (i === index) ? ({ ...material, serial_number: value ? value : null }) : material)
            return setSubmitMaterials({ ...submitMaterials, to_worker: [...updatedMaterials] })
        } else if (type === 'imei') {
            const updatedMaterials = [...submitMaterials.to_worker].map((material, i) => (i === index) ? ({ ...material, imei: value ? value : null }) : material)
            return setSubmitMaterials({ ...submitMaterials, to_worker: [...updatedMaterials] })
        } else if (type === 'comment') {
            const updatedArray = (arr === 'to_worker') ? [...submitMaterials.to_worker] : [...submitMaterials.to_storage]
            const updatedMaterials = updatedArray.map((material, i) => (i === index) ? ({ ...material, comment: value ? value : null }) : material)
            if (arr === 'to_worker') { return setSubmitMaterials({ ...submitMaterials, to_worker: [...updatedMaterials] }) }
            else { return setSubmitMaterials({ ...submitMaterials, to_storage: [...updatedMaterials] }) }
        }
    }

    const sendChanges = async (e) => {
        e.preventDefault()
        setLoader(true)

        const { to_storage, to_worker } = submitMaterials
        const check = (to_storage.length > 0 || to_worker.length > 0) && true
        const checkSerial = [...to_storage, ...to_worker].filter(mat => (mat.serial_number === undefined) || (mat.serial_number === null) || (mat.serial_number.length < 5))
        const checkImei = [...to_storage, ...to_worker].filter(mat => (mat.id_tipo === 18 && ((mat.imei === undefined) || (mat.imei === null) || (mat.imei.length < 5))))
        const checkComments = [...to_storage, ...to_worker].filter(mat => ((mat.comment === undefined || mat.comment === null || mat.comment === '')))
        if (checkSerial.length > 0) {
            addToast('¡Error!', 'Introduce los números de serie', 'danger')
            setLoader(false)
            return
        }
        if (checkImei.length > 0) {
            addToast('¡Error!', 'Introduce los imei de los móviles', 'danger')
            setLoader(false)
            return
        }
        if (checkComments.length > 0) {
            return addToast('¡Error!', 'Selecciona los motivos de asignación', 'danger')
        }
        if (!check) {
            addToast('¡Error!', 'Algo ha ido mal', 'danger')
            setLoader(false)
            return
        } else {
            // Call to material unique service
            const sendData = await createManyAssignments(submitMaterials)
            if (sendData.status === 200) {
                addToast('Asignación', '¡Asignaciones creadas!', 'success')
                setTimeout(() => { window.location.reload() }, 1500)
            } else {
                addToast('¡Error!', 'No se han hecho las asignaciones', 'danger')
                setLoader(false)
            }
        }
        setLoader(false)
    }

    return (
        <>
            { /**
            The component is only displayed in the following cases: having admin or super-admin role.
            If you are not logged in or do not have access permissions: redirection to Login.
            If you are only a reader: redirection to Home.
            **/}
            {((isAuthentificated === false) || (infoUser.role === 0)) && <Login />}
            {(infoUser.role === 1) ? navigate(`/`) : (
                <>
                    <Navbar />
                    <div className='wrapper-user-details'>
                        <div className='user'>
                            <h2>Datos del usuario</h2>
                            {worker && worker.map(({ nombre, apellidos, email, departamento, ubicacion, posicion }, i) => (
                                <div key={i}>
                                    <div className='user-title'>
                                        <p>Nombre</p>
                                        <p>Apellidos</p>
                                        <p>Email</p>
                                        <p>Departamento</p>
                                        <p>Ubicación</p>
                                        <p>Posición</p>
                                    </div>
                                    <div className='user-info' >
                                        <p>{nombre}</p>
                                        <p>{apellidos}</p>
                                        <p>{email}</p>
                                        <p>{departamento}</p>
                                        <p>{ubicacion}</p>
                                        <p>{posicion}</p>
                                    </div> </div>
                            ))}
                        </div>

                        <div className='container'>
                            <div className='user-container'>
                                <div className='user-materials'>
                                    <h2>Materiales actuales</h2>
                                    {workerMaterials && workerMaterials.length > 0 && workerMaterials.map((material, i) => (
                                        (i >= paginacionMaterials.inicio && i < paginacionMaterials.final) &&
                                        <div className="material" key={i}>
                                            <div><p>Marca:</p><span>{material.marca}</span></div>
                                            <div><p>Modelo:</p><span>{material.modelo}</span></div>
                                            <div><p>Tipo:</p><span>{material.tipo}</span></div>
                                            <div><p>GA Code:</p><span>{material.ga_code ? material.ga_code : '-'}</span></div>
                                            <div><p>S/N:</p><span>{material.serial_number ? material.serial_number : '-'}</span> </div>
                                            <div><p>IMEI:</p><span>{material.imei ? material.imei : (material.tipo === 18) ? '-' : 'N/A'}</span></div>
                                            <span className='action-button' onClick={() => deleteFromAssigned({ ...material, toStorage: true })}>Quitar</span>
                                        </div>
                                    ))}
                                    {workerMaterials.length > 5 && <div className='paginacion'>
                                        {pageMaterials > 1 && (
                                            <button onClick={handleBackMaterials} className='steperButtons'>
                                                <img src={back} alt='Atrás' className='navbar__navigate-back-img' />
                                                <p>Back</p>
                                            </button>
                                        )}
                                        {    // Limit to show pagination.
                                            (totalPaginacionMaterials.slice((pageMaterials >= 5 && (pageMaterials - 3)), (pageMaterials + 2))).map(data => (
                                                <div onClick={() => setPageMaterials(data)} className={data === pageMaterials ? 'active' : ''} key={data}>{data}</div>
                                            ))
                                        }
                                        {(pageMaterials < totalPaginacionMaterials.length) && (
                                            <button onClick={handleNextMaterials} className='steperButtons'>
                                                <p>Next</p>
                                                <img src={forward} alt='Siguiente' className='navbar__navigate-back-img' />
                                            </button>
                                        )}
                                    </div>}
                                    {(submitMaterials.to_storage.length > 0 || submitMaterials.to_worker.length > 0) &&
                                        <div className="cart">
                                            <form onSubmit={sendChanges}>
                                                {loader && <Loader />}
                                                <div className="user-materials">
                                                    <h2>A añadir:</h2>
                                                    {submitMaterials.to_worker.map((material, i) => (
                                                        material.toAssign &&
                                                        <div className="material" key={i}>
                                                            {/* <div className='material-info'> */}
                                                            <div><p>Marca / Modelo:</p><span>{material.marca} / {material.modelo}</span></div>
                                                            <div><p>Nombre:</p><span>{material.nombre}</span></div>
                                                            <div><p>Apellidos:</p><span>{material.apellidos}</span></div>
                                                            {material.ga_code
                                                                ? <>
                                                                    <div><p>GA Code:</p><span>{material.ga_code ? material.ga_code : '-'}</span></div>
                                                                    <div><p>S/N:</p><span>{material.serial_number ? material.serial_number : '-'}</span></div>
                                                                    {material.id_tipo === 18 ? <div><p>IMEI:</p> <span>{material.imei ? material.imei : '-'}</span></div> : <div></div>}
                                                                </>
                                                                : <>
                                                                    <input name='ga_code' type="text" placeholder='Code GA AUTO' autoComplete='off' className='input-gaCode' disabled />
                                                                    <input name='serial-number' type="text" placeholder='Número serie' autoComplete='off' className='input-serialNumber'
                                                                        onChange={(e) => setMaterialInfo(e.target.value, i, 'serial')} />
                                                                    {material.id_tipo === 18 ? <input name='imei' type="text" placeholder='IMEI / IMEI' autoComplete='off' className='input-imei'
                                                                        onChange={(e) => setMaterialInfo(e.target.value, i, 'imei')} /> : <div></div>}
                                                                </>
                                                            }
                                                            <select name="reason"
                                                                onChange={(e) => setMaterialInfo(e.target.value, i, 'comment', 'to_worker')}>
                                                                <option value=""></option>
                                                                <option value="Primera Asignación">Primera Asignación</option>
                                                                <option value="Asignación normal">Asignación normal</option>
                                                                <option value="Sustitución por avería">Sustitución por avería</option>
                                                                <option value="Sustitución por desgaste">Sustitución por desgaste</option>
                                                            </select>
                                                            <div className='action-button' onClick={() => deleteFromSubmit(material)}>Quitar</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className='user-materials'>
                                                    <h2>A quitar:</h2>
                                                    {submitMaterials.to_storage.map((material, i) => (
                                                        material.toStorage &&
                                                        <div className="material" key={i}>
                                                            <div><p>Marca:</p><span>{material.marca}</span></div>
                                                            <div><p>Modelo:</p><span>{material.modelo}</span></div>
                                                            <div><p>Tipo:</p><span>{material.tipo}</span></div>
                                                            <div><p>GA Code:</p><span>{material.ga_code ? material.ga_code : '-'}</span></div>
                                                            <div><p>S/N:</p><span>{material.serial_number ? material.serial_number : '-'}</span></div>
                                                            <select name="reason"
                                                                onChange={(e) => setMaterialInfo(e.target.value, i, 'comment', 'to_storage')}>
                                                                <option value=""></option>
                                                                <option value="Devolución">Devolución</option>
                                                                <option value="Rotura">Rotura</option>
                                                                <option value="Extravío">Extravío</option>
                                                                <option value="Robo">Robo</option>
                                                            </select>
                                                            <div className='action-button' onClick={() => deleteFromSubmit(material)} >Quitar</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button type='submit' className='action-button'>Enviar cambios</button>
                                            </form>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="assignment">
                                <div className="dashboard">
                                    <div className='dashboard-header'>
                                        <h2>Escoge el material a asignar:</h2>
                                        <div className='dashboard-store'>
                                            <p>Solo almacén:</p>
                                            <input type="checkbox" value={searchParams.onlyStorage} onChange={(e) => onChangeHandlerInput(e.target.value, 'only_storage')} />
                                        </div>
                                    </div>
                                    <div className="filters">
                                        <div>
                                            <p>Tipo:</p>
                                            <select className="filters-select" onChange={(e) => onChangeHandlerInput(e.target.value, 'type')}>
                                                <option value={0}>Tipo</option>
                                                {types && types.length > 0 &&
                                                    types.map(({ tipo, id_tipo }, i) => (
                                                        <option key={i} value={id_tipo}>{tipo}</option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <p>Marca:</p>
                                            <select className="filters-select" onChange={(e) => onChangeHandlerInput(e.target.value, 'brand')}>
                                                <option value={0}>Marca</option>
                                                {brands && brands.length > 0 &&
                                                    brands.map(({ marca, id_marca }, i) => (
                                                        <option key={i} value={id_marca}>{marca}</option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <p>Modelo:</p>
                                            <select className="filters-select" onChange={(e) => onChangeHandlerInput(e.target.value, 'model')}>
                                                <option value={0}>Modelo</option>
                                                {models && models.length > 0 &&
                                                    models.map(({ modelo, id_modelo }, i) => (
                                                        <option key={i} value={id_modelo}>{modelo}</option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <p>GA Code:</p>
                                            <input name='ga_code' type="text" placeholder='GA Code' autoComplete='off' value={searchParams.ga_code}
                                                onChange={(e) => onChangeHandlerInput(e.target.value, 'ga_code')} />
                                        </div>
                                        <div>
                                            <p>Nombre:</p>
                                            <input name='name' type="text" placeholder='Nombre' autoComplete='off' value={searchParams.name}
                                                onChange={(e) => onChangeHandlerInput(e.target.value, 'name')} />
                                        </div>
                                        <div>
                                            <p>Apellidos:</p>
                                            <input name='lastname' type="text" placeholder='Apellidos' autoComplete='off' value={searchParams.lastname}
                                                onChange={(e) => onChangeHandlerInput(e.target.value, 'lastname')} />
                                        </div>

                                    </div>
                                    <div className="materials">
                                        <div className='materialToAssign'>
                                            <p>Tipo</p>
                                            <p>Marca</p>
                                            <p>Modelo</p>
                                            <p>Asignado</p>
                                            <p>GA Code</p>
                                            <p>N/S</p>
                                            <p>IMEI</p>
                                        </div>
                                        <div className="body">
                                            {(filteredMaterials && filteredMaterials.length > 0)
                                                ? filteredMaterials.map((material, i) => {
                                                    return (
                                                        (i >= paginacion.inicio && i < paginacion.final) &&
                                                        <div className="material" key={i}>
                                                            <div>{material.tipo}</div>
                                                            <div>{material.marca}</div>
                                                            <div>{material.modelo}</div>
                                                            <div><p>{material.nombre}</p> <p>{material.apellidos}</p></div>
                                                            <div>{material.ga_code ? material.ga_code : '-'}</div>
                                                            <div>{material.serial_number ? material.serial_number : '-'}</div>
                                                            <div className='action-button' onClick={() => onAssignmentHandler({ ...material, toAssign: true })} >Asignar</div>
                                                        </div>)
                                                })
                                                : <div> No existen resultados para esta búsqueda </div>
                                            }
                                        </div>

                                        {filteredMaterials.length > 5 && <div className='paginacion'>
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
                            </div>

                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default MaterialAssignment
