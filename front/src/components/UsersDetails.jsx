// Imports
import { useEffect, useState, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useIsAuthenticated } from '@azure/msal-react'

// Components
import Navbar from './Navbar'
import { Login } from './Login'

// Context
import { InfoUserContext } from '../context/infoUser'
import { MessagesContext } from '../context/messagesContext'

// Services
import { getWorker, unsubscribeUser } from '../services/user'
import { getWorkersMaterials } from '../services/materials_unique'
import { getLogByUser } from '../services/material_assignment'
import { createPdf, getDocumentsByUser, sendSignedDocument, sendLog } from '../services/documents';

// Misc.
import { shortenDate } from '../utils/utils'
import back from '../assets/back.png'
import forward from '../assets/forward.png'
import Loader from '../utils/Loader'

const UsersDetails = () => {
    const currentURL = window.location.pathname.split('/')[1]
    const { infoUser } = useContext(InfoUserContext)
    const { addToast } = useContext(MessagesContext)
    const isAuthenticated = useIsAuthenticated()
    const refImage = useRef()
    const [loader, setLoader] = useState(false)

    // User ID
    const { id } = useParams()
    const navigate = useNavigate()

    const [worker, setWorker] = useState([])
    const [workerMaterials, setWorkerMaterials] = useState([])
    const [log, setLog] = useState([])
    const [documents, setDocuments] = useState([])
    const [displayButton, setDisplayButton] = useState({ documents: false, materials: false, logs: false })
    const [selectedFile, setSelectedFile] = useState({ image: null, id_document: 0, old_document: '' })
    const [prices, setPrices] = useState([])

    // Pagination
    const [page, setPage] = useState(1)
    const [paginacion, setPaginacion] = useState({ inicio: 0, final: 10 })
    const [totalPaginacion, setTotalPaginacion] = useState([])

    // Submit Info
    const [submitInfo, setSubmitInfo] = useState({ notas: '', disable: false })

    // Steper pagination.
    const handleNext = () => {
        if (page <= totalPaginacion.length) {
            setPage(page + 1)
        }
    }

    const handleBack = () => {
        if (page > 0) {
            setPage(page - 1)
        }
    }

    useEffect(() => {
        (async function () {
            ((currentURL === 'user-cancel') && (infoUser.role !== 3)) && navigate('/')
            // Call to worker service
            const worker = await getWorker(id)
            if (worker.data.length > 0) {
                worker.data[0].activo === 0 && navigate('/')
                await setWorker({ ...worker.data[0] })
            }
            // Call to material unique service
            const materials = await getWorkersMaterials(id)
            if (materials.data.length > 0) {
                await setWorkerMaterials(materials.data)
                const totalPrices = materials.data.map(({ precio }) => precio).reduce((acc, curVal) => acc + curVal)
                setPrices(totalPrices)
            }
            // Call to user log service
            const log = await getLogByUser(id)
            log.data.length > 0 && setLog(log.data)
            // Call to documents service
            const documents = await getDocumentsByUser(id)
            documents.data.length > 0 && setDocuments(documents.data)
        })()
    }, [id])

    useEffect(() => {
        if (log && log.length > 0) {
            //Calcular la paginacion total
            let auxArr = [];
            for (let i = 0; i < Math.ceil(log.length / 10); i++) {
                auxArr.push(i + 1);
            }
            setTotalPaginacion(auxArr)
            // Número de páginas
            const variable = page - 1
            setPaginacion({ inicio: 10 * variable, final: 10 * page })
        }
    }, [log, page])

    const sendChanges = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        const { notas, disable } = submitInfo
        const check = infoUser.mail !== undefined && notas !== '' && disable && true
        if (check) {
            const data = { ...submitInfo, assigner: infoUser.mail, materials: [...workerMaterials] }
            const disableUser = await unsubscribeUser(parseInt(id), data)
            if (disableUser.status === 200) {
                addToast('Usuario deshabilitado', disableUser.data.message, 'success')
                setTimeout(() => { navigate('/') }, 1500)
                setLoader(false)
            } else { 
                addToast('¡Error!', disableUser.data.message, 'danger')
                setLoader(false)
            }
        } else { 
            addToast('¡Error!', '¡Añade un comentario!', 'danger')
            setLoader(false)
        }
        setLoader(false)
    }

    const createDocument = async () => {
        const { nombre, apellidos, dni, email } = worker;
        const check = (nombre && apellidos && email) && true;
        if (check) {
            const docInfo = { nombre, apellidos, dni, materiales: [...workerMaterials], worker_id: id ? parseInt(id) : 0, email, assigner: infoUser.mail }
            const newPdf = await createPdf(docInfo)
            if (newPdf.status === 200) {
                addToast('¡Email de asignación enviado!', newPdf.data.message, 'success')
                setTimeout(() => { window.location.reload() }, 2000);
            } else { addToast('¡Error!', newPdf.data.message, 'danger') }
        } else { addToast('¡Error!', '¡No se ha enviado el mail!', 'danger') }
    }

    const sendUserLog = async () => {
        if (log.length > 0) {
            const response = await sendLog({ log: log, worker: { ...worker, id: parseInt(id) }, assigner: infoUser.mail });
            if (response.status === 200) {
                addToast('¡Email enviado!', response.data.message, 'success');
                setTimeout(() => { window.location.reload() }, 1500);
            }
        } else { addToast('¡Error!', '¡No existen asignaciones', 'danger') }
    }

    const uploadSignedDocument = async (e) => {
        e.preventDefault();
        const { id_document, image, old_document } = selectedFile
        const check = id_document !== 0 && image !== null && old_document !== '' && true
        if (check) {
            const response = await sendSignedDocument(selectedFile)
            if (response.status === 200) {
                addToast('¡Archivo subido!', response.data.message, 'success')
                setTimeout(() => { window.location.reload() }, 1500);
            } else { addToast('¡Error!', response.data.message, 'danger') }
        } else { addToast('¡Error!', '¡Selecciona un archivo para subir!', 'danger') }
    }

    return (
        <> {((isAuthenticated === false) || (infoUser.role === 0)) && <Login />}
            <>
                <Navbar />
                <div className='wrapper-user-details'>
                    <div className='container'>
                        <div className='body'>
                            {
                                worker && (<div>
                                    <div className='worker-title'>
                                        <p>Nombre:</p>
                                        <p>Apellidos:</p>
                                        <p>Email</p>
                                        <p>Posición:</p>
                                        <p>Departamento:</p>
                                        <p>Ubicación:</p>
                                    </div>
                                    <div className='worker'>
                                        <p>{worker.nombre}</p>
                                        <p>{worker.apellidos}</p>
                                        <p>{worker.email}</p>
                                        <p>{worker.posicion}</p>
                                        <p>{worker.departamento}</p>
                                        <p>{worker.ubicacion}</p>
                                        {
                                            /**
                                               The unsubscribe button is only displayed in the following cases:
                                               accessing the component from 'user-cancel' and having a super-admin role.
                                            **/
                                            (((currentURL === 'user-cancel') && (infoUser.role === 3)) || (infoUser.role === 3)) && (<div className='button-delete'
                                                onClick={() => setSubmitInfo({ ...submitInfo, disable: !submitInfo.disable, notas: '' })}>
                                                <p>DAR DE BAJA</p>
                                            </div>)
                                        }
                                    </div>

                                    {submitInfo.disable && (
                                        <div className='cancel-user'>
                                            <h2>Baja de usuario</h2>
                                            <form onSubmit={sendChanges}>
                                            {loader && <Loader />}
                                                <div className='cancel-user-segment'>
                                                    <p>Añade un comentario:</p>
                                                    <textarea onChange={(e) => setSubmitInfo({ ...submitInfo, notas: e.target.value })} placeholder='Comentario obligatorio'
                                                        rows='5' />
                                                </div>
                                                <div className='cancel-user-segment'>
                                                    <p className='cancel-user-disclaimer'>Al aceptar se va a desactivar el usuario y se reasignarán todos sus materiales a ALMACÉN</p>
                                                    <button className='display-button'>Aceptar</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                                )
                            }
                            <div className='display-buttons'>
                                <button className='display-button' onClick={() => setDisplayButton({ documents: false, materials: !(displayButton.materials), logs: false })}>Materiales</button>
                                <button className='display-button' onClick={() => setDisplayButton({ documents: !(displayButton.documents), materials: false, logs: false })}>Documentos</button>
                                <button className='display-button' onClick={() => setDisplayButton({ documents: false, materials: false, logs: !(displayButton.logs) })}>Logs</button>
                            </div>
                            {displayButton.documents && (
                                <div className='documents-container'>
                                    <h2>Documentos</h2>
                                    <div className='documents-segment'>
                                        <button className='send-mail' onClick={() => createDocument()}>Asignación actual</button>
                                        <button className='send-mail' onClick={() => sendUserLog()}>Histórico de Logs</button>
                                    </div>
                                    {(documents.length > 0)
                                        ? <div className='documents'>
                                            <div className="documents-header">
                                                <p>Fecha de envío</p>
                                                <p>¿Firmado?</p>
                                                <p>Archivo</p>
                                            </div>
                                            {documents.map(({ id_document, file, signed, delivery_date }) => (
                                                <div className='document' key={id_document}>
                                                    <p>{shortenDate(delivery_date)}</p>
                                                    {signed
                                                        ? <p>Sí</p>
                                                        : (
                                                            <form className='upload-document' onSubmit={uploadSignedDocument}>
                                                                <input type='file' className='' accept="image/*, .pdf" ref={refImage}
                                                                    onChange={(e) => setSelectedFile({ image: e.target.files[0], id_document: id_document, old_document: file })} />
                                                                <p className='transfer__buttonSelect' onClick={() => refImage.current.click()}>{selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}</p>

                                                                <button className='send-document' type='submit'>Cargar</button>
                                                            </form>)}
                                                    <a target={'_blank'} href={file} download>Descargar</a>
                                                </div>
                                            ))}
                                        </div>
                                        : <h2>No hay documentos para este usuario</h2>}
                                </div>)
                            }
                            {
                                displayButton.materials && ((workerMaterials.length > 0)
                                    ? <div className='materials-container'>
                                        <h2>Materiales</h2>
                                        <p>Precio total de los materiales asignados: <span>{prices} €</span></p>
                                        <div className='materials-card-container'>
                                            {
                                                workerMaterials.map(({ marca, tipo, modelo, ga_code, serial_number, precio }, i) => (

                                                    <div className='materials-card' key={i}>
                                                        <p>Marca: </p><span>{marca}</span>
                                                        <p>Tipo: </p><span>{tipo}</span>
                                                        <p>Modelo: </p><span>{modelo}</span>
                                                        <p>GA Code: </p><span>{ga_code}</span>
                                                        <p>S/N: </p><span>{serial_number}</span>
                                                        <p>Precio: </p><span>{precio} €</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    : <h2>No hay materiales asignados al usuario</h2>)
                            }
                            {
                                displayButton.logs && ((log.length > 0)
                                    ? (<div className='logs-container'>
                                        <div className='logs'>
                                            <h2>Movimientos de materiales</h2>
                                            <div className='logs-title'>
                                                <div>Fecha</div>
                                                <div>Origen</div>
                                                <div>Destino</div>
                                                <div>Asignador</div>
                                                <div>Notas</div>
                                                <div>Material</div>
                                            </div>
                                            {(log.length > 0) &&
                                                log.map(({ fecha, origen, destino, assigner, notas, marca, modelo, tipo, ga_code }, i) => (
                                                    (i >= paginacion.inicio && i < paginacion.final) &&
                                                    <div className='logs-data' key={i}>
                                                        <p>{shortenDate(fecha)}</p>
                                                        <p>{origen}</p>
                                                        <p>{destino}</p>
                                                        <p>{assigner}</p>
                                                        <p>{notas}</p>
                                                        <div className='logs-material'>
                                                            <p>Marca: </p><span>{marca}</span>
                                                            <p>Tipo: </p><span>{tipo}</span>
                                                            <p>Modelo: </p><span>{modelo}</span>
                                                            <p>GA Code: </p><span>{ga_code}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        {log.length > 10 && (
                                            <div className='paginacion'>
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
                                            </div>)}
                                    </div>)
                                    : <h2>No hay asignaciones creadas al usuario</h2>)}
                        </div>
                    </div>
                </div>
            </>
        </>
    )
}

export default UsersDetails