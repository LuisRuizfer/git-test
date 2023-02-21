import { useEffect, useState, useContext } from 'react'
import { getAllModels } from '../services/models'
import { getAllBrands } from '../services/brands'
import { getAllTypes } from '../services/types'
import { MessagesContext } from '../context/messagesContext'
import { getAllMaterialsGroup } from '../services/materials_group'
import { getInvoices } from '../services/invoices'
import { createNewMaterialUnique } from '../services/materials_unique'

import { InfoUserContext } from '../context/infoUser'
import { getAllWorkers } from '../services/user'
import { getAllDepartments } from '../services/departments'

import { isPC, shortenDate, checkStartsWith, removeAccentsAndNormalize } from '../utils/utils'
import Loader from '../utils/Loader'

export const MaterialUnique = () => {
    const { addToast } = useContext(MessagesContext)
    const { infoUser } = useContext(InfoUserContext)
    const [loader, setLoader] = useState(false)

    const [brands, setBrands] = useState([])
    const [types, setTypes] = useState([])
    const [models, setModels] = useState([])
    const [allInvoices, setAllInvoices] = useState([])

    // Group States
    const [materialsGroup, setMaterialsGroup] = useState([])
    const [newMaterialUnique, setNewMaterialUnique] = useState({ material_group: 0, invoice: 0, id_trabajador: 0, precio: 0, assigner: infoUser.mail, ga_code: '', serial_number: '', notas: '', imei: '', type: 0, brand: 0, model: 0 })

    const [departments, setDepartments] = useState([])
    const [workers, setWorkers] = useState([])
    const [workerText, setWorkerText] = useState('')
    const [suggestedWorkers, setSuggestedWorkers] = useState([])

    const [isCollapsed, setIsCollapsed] = useState()

    useEffect(() => {
        (async function () {
            // Call to brands service
            const brands = await getAllBrands()
            brands.data.length > 0 && setBrands(brands.data)
            // Call to types service
            const types = await getAllTypes()
            types.data.length > 0 && setTypes(types.data)
            // Call to models service
            const models = await getAllModels()
            models.data.length > 0 && setModels(models.data)
            // Call to material groups service
            const materialGroups = await getAllMaterialsGroup()
            materialGroups.data.length > 0 && setMaterialsGroup(materialGroups.data)
            // Call to invoices service
            const invoices = await getInvoices()
            invoices.data.length > 0 && setAllInvoices(invoices.data)
            // Call to workers service
            const workers = await getAllWorkers()
            workers.data.length > 0 && setWorkers(workers.data)
            // Call to departments service
            const departments = await getAllDepartments()
            departments.data.length > 0 && setDepartments(departments.data)
        })()
    }, [])

    useEffect(() => {
        if (newMaterialUnique.type === 0 || newMaterialUnique.brand === 0 || newMaterialUnique.model === 0) {
            setNewMaterialUnique({ ...newMaterialUnique, id_trabajador: 0, precio: 0, ga_code: '', serial_number: '', notas: '', imei: '' })
            setWorkerText('')
        }
    }, [newMaterialUnique.type, newMaterialUnique.brand, newMaterialUnique.model])


    const onChangeHandlerWorker = (text) => {
        let matches = []
        if (text.length > 0) {
            matches = workers.filter(({ nombre, apellidos }) =>
                (checkStartsWith(nombre, text) || checkStartsWith(apellidos, text)))
        }
        matches.length === 0 && setNewMaterialUnique({ ...newMaterialUnique, id_trabajador: 0 })
        // Set the current suggested workers
        setSuggestedWorkers(matches)
        setWorkerText(text)
    }

    const getDepartmentName = (id) => {
        return departments.filter(department => department.id === id).map(({ nombre }) => nombre).join('')
    }

    const handleSubmitNewMaterial = async (e) => {
        e.preventDefault()
        setLoader(true)
       
        const { invoice, id_trabajador, type, brand, model, ga_code, serial_number, imei } = newMaterialUnique
        // Checks if all mandatory values are filled
        const areAllValuesFilled = ((type === 18 && imei !== '') || (type !== 0 && type !== 18)) && brand !== 0 && model !== 0 && invoice !== 0 && ga_code !== '' && serial_number !== '' && id_trabajador !== 0 && true
        // Checks if the material is included as pc type and checks the code's format
        const regex1 = new RegExp(/^GA[0-9]{3}$/)
        const regex2 = new RegExp(/^GAP[0-9]{3}$/)
        const checkIsPC = isPC(type)
        const codeCheck = ((ga_code.match(regex1) !== null && checkIsPC) || (ga_code.match(regex2) !== null && !checkIsPC))

        if (areAllValuesFilled && codeCheck) {
            // Gets the material group id
            const checkMaterialGroup = areAllValuesFilled && materialsGroup
                .filter(({ tipo, marca, modelo }) => (
                    tipo === type && marca === brand && modelo === model))
                    setLoader(false)
            if (checkMaterialGroup.length === 0) {
                addToast('¡Error!', '¡El grupo de materiales no existe!', 'danger')
                setLoader(false)
            } else {
                const materialGroupId = parseInt(checkMaterialGroup.map(({ id }) => id).join(''))
                // Service call to create a new material group
                const materialUnique = await createNewMaterialUnique({ ...newMaterialUnique, material_group: materialGroupId })
                if (materialUnique.status === 200) {
                    addToast('Nuevo material!', materialUnique.data.message, 'success')
                    setTimeout(() => { window.location.reload() }, 1500)
                    setLoader(false)
                } else {
                    addToast('¡Error!', materialUnique.data.message, 'danger')
                    setLoader(false)
                }
            }
        } else {
            !codeCheck
                ?   ( addToast('¡Error!', '¡Formato de código incorrecto!', 'danger') && setLoader(false) )
                :   ( addToast('¡Error!', '¡Rellena los campos obligatiorios!', 'danger') && setLoader(false) )
        }
        setLoader(false)
    }

    return (
        <>
            {isCollapsed
                ? (<div aria-expanded={isCollapsed} >
                    <div className='wrapper-brand-form'>
                        <form onSubmit={handleSubmitNewMaterial}>
                            {loader && <Loader />}
                            <div>
                                <label>Factura:</label>
                                <select name='select' defaultValue={0} onChange={(e) => setNewMaterialUnique({ ...newMaterialUnique, invoice: parseInt(e.target.value) })}>
                                    <option value={0}>Selecciona un tipo</option>
                                    {allInvoices.length > 0 && allInvoices.map(({ created_at, comments, id }, i) => (
                                        <option value={id} key={i}>{shortenDate(created_at)} - {comments.length > 30 ? `${comments.slice(0, 30)}...` : comments} </option>))}
                                </select>
                            </div>
                            {newMaterialUnique.invoice !== 0 && (
                                <>
                                    <div>
                                        <label>Tipo:</label>
                                        <select name='select' defaultValue={0} onChange={(e) => setNewMaterialUnique({ ...newMaterialUnique, type: parseInt(e.target.value) })}>
                                            <option value={0}>Selecciona un tipo</option>
                                            {types.length > 0 && types.map(({ name, id }, i) => (<option value={id} key={i}>{name} </option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Marca:</label>
                                        <select name='select' defaultValue={0} onChange={(e) => setNewMaterialUnique({ ...newMaterialUnique, brand: parseInt(e.target.value), model: 0 })}>
                                            <option value={0}>Selecciona una marca</option>
                                            {brands.length > 0 && brands.map(({ name, id }, i) => (<option value={id} key={i}>{name} </option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Modelo:</label>
                                        <select name='select' defaultValue={0} onChange={(e) => setNewMaterialUnique({ ...newMaterialUnique, model: parseInt(e.target.value) })}>
                                            <option value={0}>Selecciona un modelo</option>
                                            {models.length > 0 && models.map(({ name, id, id_marca }, i) => (
                                                (newMaterialUnique.brand === id_marca) && <option value={id} key={i}>{name} </option>))}
                                        </select>
                                    </div>
                                </>

                            )}
                            {(newMaterialUnique.type !== 0 && newMaterialUnique.brand !== 0 && newMaterialUnique.model !== 0) && (
                                <>
                                    <div>
                                        <label>Precio:</label>
                                        <input type='number' min={0} placeholder='Precio'
                                            onChange={(e) => {
                                                e.target.value !== ''
                                                    ? setNewMaterialUnique({ ...newMaterialUnique, precio: parseInt(e.target.value) })
                                                    : setNewMaterialUnique({ ...newMaterialUnique, precio: 0 })
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label>Asignar a:</label>
                                        <input placeholder='Assign to worker' type='text' name='worker' className='assign-worker' autoComplete='off'
                                            onChange={(e) => onChangeHandlerWorker(e.target.value)}
                                            value={workerText} />
                                        {suggestedWorkers.length > 0 && suggestedWorkers.map(
                                            ({ nombre, apellidos, id, id_departamento }, i) => (
                                                <div className="suggested-workers" key={i}
                                                    onClick={() => {
                                                        const text = nombre + ' ' + apellidos + ' - ' + getDepartmentName(id_departamento)
                                                        setWorkerText(text)
                                                        setNewMaterialUnique({ ...newMaterialUnique, id_trabajador: id })
                                                        setSuggestedWorkers([])
                                                    }}>
                                                    {nombre + ' ' + apellidos + ' - ' + getDepartmentName(id_departamento)}
                                                </div>)
                                        )}
                                    </div>
                                    <div>
                                        <label>GA CODE</label>
                                        <input type='text' placeholder='GA000 / GAP000' onChange={(e) => setNewMaterialUnique({ ...newMaterialUnique, ga_code: removeAccentsAndNormalize(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label>Número de serie</label>
                                        <input type='text' placeholder='XXXXXXX' onChange={(e) => setNewMaterialUnique({ ...newMaterialUnique, serial_number: removeAccentsAndNormalize(e.target.value) })} />
                                    </div>
                                    {newMaterialUnique.type === 18 && (<div>
                                        <label>IMEI</label>
                                        <input type='text' placeholder='IMEI-1 / IMEI-2' onChange={(e) => setNewMaterialUnique({ ...newMaterialUnique, imei: removeAccentsAndNormalize(e.target.value) })} />
                                    </div>)}

                                    <div>
                                        <label>Comentarios</label>
                                        <textarea placeholder='Comentarios' onChange={(e) => setNewMaterialUnique({ ...newMaterialUnique, notas: e.target.value })} />
                                    </div>
                                </>)
                            }
                            {(((newMaterialUnique.type === 18 && newMaterialUnique.imei !== '') || (newMaterialUnique.type !== 0 && newMaterialUnique.type !== 18)) &&
                                newMaterialUnique.brand !== 0 &&
                                newMaterialUnique.model !== 0 &&
                                newMaterialUnique.invoice !== 0 &&
                                newMaterialUnique.ga_code !== '' &&
                                newMaterialUnique.serial_number !== '' &&
                                newMaterialUnique.id_trabajador !== 0)
                                && <button className='createButton'>Crear</button>
                            }
                        </form>

                        <div className='closeButton' onClick={() => {
                            setNewMaterialUnique({ material_group: 0, invoice: 0, id_trabajador: 0, precio: 0, assigner: infoUser.mail, ga_code: '', serial_number: '', notas: '', imei: '', type: 0, brand: 0, model: 0 })
                            setIsCollapsed(!isCollapsed)
                        }}>
                            <h2>CERRAR</h2>
                        </div>
                    </div>
                </div>)
                : (
                    <div className='collapse-button' onClick={() => setIsCollapsed(!isCollapsed)}>
                        <h2 className='buttonCollapsed'>MATERIAL ÚNICO</h2>
                    </div>
                )}
        </>
    )
}

