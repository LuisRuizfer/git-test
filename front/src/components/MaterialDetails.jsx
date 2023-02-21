// Imports
import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Barcode from 'react-barcode'

// Components
import Navbar from './Navbar'

// Context
import { InfoUserContext } from '../context/infoUser'
import { MessagesContext } from '../context/messagesContext'

// Services
import { getWorker } from '../services/user'
import { getMaterialUniqueById, createCodeAndSerial, sendToTrashOrStorage } from '../services/materials_unique'
import { getMaterialUniqueLog } from '../services/material_assignment'

// Misc.
import { shortenDate } from '../utils/utils'
import ModalButton from '../utils/ModalButton'
import Invoice from '../utils/Invoice'
import back from '../assets/back.png'
import forward from '../assets/forward.png'
import Loader from '../utils/Loader'

const MaterialDetails = () => {
    const [loader, setLoader] = useState(false)
    const { infoUser } = useContext(InfoUserContext)
    const { addToast } = useContext(MessagesContext)
    const { id } = useParams()

    // Materials State
    const [materialUnique, setMaterialUnique] = useState([])
    const [log, setLog] = useState([])

    // Worker State
    const [worker, setWorker] = useState([])

    const [updatedData, setUpdatedData] = useState({ serial_number: '', id_tipo: 0, imei: '' })
    const [sendTo, setSendTo] = useState({ toStorage: false, toTrash: false, assigner: infoUser.mail, id_trabajador_origen: 0, notas: '' })
    const [displayButton, setDisplayButton] = useState({ trabajador: false, logs: false })

    // Pagination
    const [page, setPage] = useState(1)
    const [paginacion, setPaginacion] = useState({ inicio: 0, final: 5 })
    const [totalPaginacion, setTotalPaginacion] = useState([])

    // Steper pagination.
    const handleNext = () => {
        if (page <= totalPaginacion.length) { setPage(page + 1) }
    }
    const handleBack = () => {
        if (page > 0) { setPage(page - 1) }
    }

    useEffect(() => {
        (async function () {
            // Call to material unique service
            const material = await getMaterialUniqueById(id)
            material.data.length > 0 && setMaterialUnique(material.data)
            material.data.length > 0 && setUpdatedData({ ...updatedData, id_tipo: material.data[0].id_tipo })

            // Call to worker service
            const worker_id = material.data.length > 0 && material.data[0].id_trabajador
            worker_id && setSendTo({ ...sendTo, id_trabajador_origen: worker_id })
            const worker = await getWorker(worker_id)
            worker.data.length > 0 && setWorker(worker.data)

            // Call to log service
            const materialUniqueLog = await getMaterialUniqueLog(id)
            materialUniqueLog.data.length > 0 && setLog(materialUniqueLog.data)
        })()
    }, [])

    useEffect(() => {
        if (log && log.length > 0) {
            //Calcular la paginacion total
            let auxArr = [];
            for (let i = 0; i < Math.ceil(log.length / 5); i++) {
                auxArr.push(i + 1);
            }
            setTotalPaginacion(auxArr)
            // Número de páginas
            const variable = page - 1
            setPaginacion({ inicio: 5 * variable, final: 5 * page })
        }
    }, [log, page])

    useEffect(() => {
        setSendTo({ ...sendTo, assigner: infoUser.mail })
    }, [infoUser])

    const barCodeOptions = {
        width: 2,
        height: 20,
        format: "CODE128",
        displayValue: true,
        fontOptions: "",
        font: "monospace",
        textAlign: "center",
        textPosition: "bottom",
        textMargin: 2,
        fontSize: 20,
        background: "",
        lineColor: "#000000",
        margin: 10,
        marginTop: undefined,
        marginBottom: undefined,
        marginLeft: undefined,
        marginRight: undefined
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        const { serial_number, id_tipo, imei } = updatedData
        const checkSerial = serial_number.length !== 0
        const check = (checkSerial) && ((id_tipo === 18 && imei !== '') || (id_tipo !== 0 && id_tipo !== 18)) && true

        if (check){
            const sendData = await createCodeAndSerial(updatedData, id)
            if (sendData.status === 200) {
                addToast('Nuevo material!', sendData.data.message, 'success')
                setTimeout(() => { window.location.reload() }, 1500)
                setLoader(false)
            }
        } else {
            if (serial_number.length === 0) {
                addToast('¡Error!', 'Introduce un número de serie', 'danger')
                setLoader(false)
            }
            if (id_tipo === 18 && imei.length === 0) {
                addToast('¡Error!', 'Introduce un imei', 'danger')
                setLoader(false)
            }
        }
        setLoader(false)
    }

    const sendMaterialTo = async (e) => {
        e.preventDefault()
        setLoader(true)

        const { toTrash, toStorage, assigner, notas } = sendTo
        infoUser.mail && setSendTo({ ...sendTo, assigner: infoUser.mail })
        const check = ((toTrash || toStorage) && assigner && id && notas) && true

        if (check) {
            const sendData = await sendToTrashOrStorage(sendTo, id)
            if (sendData.status === 200) {
                addToast('Material asignado!', sendData.data.message, 'success')
                setTimeout(() => { window.location.reload() }, 1500)
                setLoader(false)
            }
        } else {
            if (!notas) { 
                addToast('¡Error!', 'Por favor añade un comentario', 'danger')
                setLoader(false)
            }
            else {
                addToast('¡Error!', 'No ha habido cambios', 'danger')
                setLoader(false)
            }
        }
        setLoader(false)
    }

    return (
        <>
            <Navbar />
            <div className='wrapper-user-details'>
                <div className='user'>
                    <div className='user-materials'>
                        <h2>Infomación del Material</h2>
                        {
                            materialUnique && (materialUnique.map(({ tipo, marca, modelo, precio, created_at, created_by, ga_code, serial_number, id_trabajador, invoice, invoice_comments, imei, id_tipo }, i) => (
                                <div key={i}>
                                    <div className='material-details'>
                                        <p>Tipo: <span>{tipo}</span></p>
                                        <p>Marca: <span>{marca}</span> </p>
                                        <p>Modelo: <span>{modelo}</span></p>
                                        <p>Precio: <span>{precio}</span></p>
                                        <p>Fecha de creación: <span>{shortenDate(created_at)}</span></p>
                                        <p>Creado por: <span>{created_by}</span></p>
                                    </div>

                                    <form onSubmit={handleSubmit} className='material-details'>
                                    {loader && <Loader />}
                                        <div className='material-details-code'>
                                            <p>Código GA:</p>
                                            {ga_code
                                                ? <span>{ga_code}</span>
                                                : <input name='ga_code' type="text" placeholder='Code GA AUTO' autoComplete='off' className='add-to-material-input' disabled />}
                                        </div>
                                        <div className='material-details-code'>
                                            <p>Número de serie:</p>
                                            {serial_number
                                                ? <span>{serial_number}</span>
                                                : <input name='serial-number' type="text" placeholder='Número serie' autoComplete='off' className='add-to-material-input'
                                                    onChange={(e) => setUpdatedData({ ...updatedData, serial_number: e.target.value })} />
                                            }
                                        </div>

                                        {(id_tipo === 18 && (imei)) && (<div className='material-details-code'> <p>Imei: </p> <span>{imei}</span></div>)}
                                        {(id_tipo === 18 && (!imei)) && 
                                        <div>
                                            <p>Añadir Imei: </p> <input placeholder='IMEI' autoComplete='off'
                                                onChange={(e) => setUpdatedData({ ...updatedData, imei: e.target.value })} />
                                        </div>}

                                        {(!ga_code || (!imei && id_tipo === 18)) && <button className='action-button-materialDetails'>{id_tipo === 18 ? 'Añadir Code-GA, S/N e IMEI' : 'Añadir Code-GA y S/N'}</button>}

                                        {ga_code && <div className='material-details-code'> <p>Barcode:</p> <span><Barcode {...barCodeOptions} value={ga_code} /></span></div>}

                                        <div className='material-details-code'> <p>Comentarios factura: </p> <span>{invoice_comments}</span></div>

                                        <div className='material-details-code'>
                                            <p>Factura:</p>
                                            <ModalButton props={{ title: 'Factura', body: <Invoice invoice={invoice} /> }} name='Ver' className='sowInvoice' />
                                            {/* 
                                            //TODO: CREAR FORMA DE DESCARGAR ARCHIVO DE FACTURA
                                            <a href={invoice} download>Descargar</a>
                                            */}
                                        </div>
                                    </form>

                                    <div className='material-details-buttonsDelete'>
                                        {(id_trabajador !== 1) && <div className='button-delete' onClick={() => setSendTo({ ...sendTo, toStorage: !sendTo.toStorage, toTrash: false, notas: '' })}><p>Enviar a Almacén</p></div>}
                                        {(id_trabajador !== 3) && <div className='button-delete' onClick={() => setSendTo({ ...sendTo, toStorage: false, toTrash: !sendTo.toTrash, notas: '' })}><p>Enviar a Papelera</p></div>}
                                    </div>
                                    {(sendTo.toStorage || sendTo.toTrash) && (
                                        <form onSubmit={sendMaterialTo} className='material-details-buttonsDelete'>
                                            {loader && <Loader />}
                                            {sendTo.toStorage && (<button className='action-button-materialDetails'>Enviar a Almacén</button>)}
                                            {sendTo.toTrash && (<button className='action-button-materialDetails'>Enviar a Papelera</button>)}
                                            <select name="reason" onChange={(e) => setSendTo({ ...sendTo, notas: e.target.value })}>
                                                <option value=""></option>
                                                <option value="Asignación normal">Asignación normal</option>
                                                <option value="Devolución">Devolución</option>
                                                <option value="Rotura">Rotura</option>
                                                <option value="Extravío">Extravío</option>
                                                <option value="Robo">Robo</option>
                                            </select>
                                        </form>
                                    )}
                                </div>
                            )))
                        }
                    </div>
                </div>
                <div>
                    <button onClick={() => setDisplayButton({ trabajador: !(displayButton.trabajador), logs: false })} className='sowInvoice'>Trabajador</button>
                    <button onClick={() => setDisplayButton({ trabajador: false, logs: !(displayButton.logs) })} className='sowInvoice'>Registros del Material</button>
                </div>
                
                { (displayButton.trabajador || displayButton.logs) && (
                <div className='container'>
                    {
                        displayButton.trabajador && (<div className='user-container'>
                            <div className='user-materials'>
                                <h2>Datos del usuario</h2>
                                {worker && worker.map(({ nombre, apellidos, email, departamento, ubicacion, posicion }, i) => (
                                    <div key={i}>
                                        <div className='user-title-log'>
                                            <p>Nombre</p> <p>Apellidos</p> <p>Email</p>
                                        </div>

                                        <div className='user-info-log' >
                                            <p>{nombre}</p> <p>{apellidos}</p> <p>{email}</p>
                                        </div>

                                        <div className='user-title-log'>
                                            <p>Departamento</p> <p>Ubicación</p> <p>Posición</p>
                                        </div>

                                        <div className='user-info-log' >
                                            <p>{departamento}</p> <p>{ubicacion}</p> <p>{posicion}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>)
                    }
                    {
                        displayButton.logs && (<div className='user-container'>
                            <div className="user-materials">
                                <h2>Registros del Material</h2>
                                {
                                    log.length > 0 && log.map(({ fecha, origen, destino, assigner, notas }, i) => (
                                        (i >= paginacion.inicio && i < paginacion.final) &&
                                        <div key={i} className="material-details-log" >
                                            <div> <p>Fecha:</p> <span>{shortenDate(fecha)}</span> </div>
                                            <div> <p>Origen:</p> <span>{origen}</span> </div>
                                            <div> <p>Destino:</p> <span>{destino}</span> </div>
                                            <div> <p>Asignador:</p> <span>{assigner}</span> </div>
                                            <div></div>
                                            <div> <p>Notas:</p> <span>{notas}</span> </div>
                                        </div>
                                    ))
                                }

                                {log.length > 5 && <div className='paginacion'>
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
                        </div>)
                    }
                </div>
                ) }
            </div>
        </>
    )
}

export default MaterialDetails
