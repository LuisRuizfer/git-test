import { useEffect, useState, useContext } from 'react'
import { getAllModels } from '../services/models'
import { getAllBrands } from '../services/brands'
import { getAllTypes } from '../services/types'
import { MessagesContext } from '../context/messagesContext'
import { createMaterialGroup, getAllMaterialsGroup } from '../services/materials_group'
import Loader from '../utils/Loader'


export const Group = () => {
    const { addToast } = useContext(MessagesContext)
    const [loader, setLoader] = useState(false)
    // Brands States
    const [brands, setBrands] = useState([])

    // Types States
    const [types, setTypes] = useState([])

    // Models States
    const [models, setModels] = useState([])

    // Group States
    const [materialsGroup, setMaterialsGroup] = useState([])
    const [groupType, setGroupType] = useState('')
    const [groupBrand, setGroupBrand] = useState('')
    const [groupModel, setGroupModel] = useState('')
    const [groupComments, setGroupComments] = useState('')

    const [newMaterialGroup, setNewMaterialGroup] = useState({ type: '', brand: '', model: '', comments: '' })

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
        })()
    }, [])

    const handleSubmitGroup = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        if (newMaterialGroup && newMaterialGroup.brand && newMaterialGroup.model && newMaterialGroup.type) {
            const { brand, model, type } = newMaterialGroup
            const checkIfExist = [...materialsGroup].filter(({ marca, modelo, tipo }) => (marca === brand && modelo === model && tipo === type))
            if (checkIfExist.length > 0) {
                addToast('¡Error!', '¡El grupo ya existe!', 'danger')
            } else {
                // Service call to create a new material group
                const materialGroup = await createMaterialGroup(newMaterialGroup)
                if (materialGroup.status === 200) {
                    addToast('Grupo de materiales', '¡Nuevo grupo de materiales creado!', 'success')
                    setTimeout(() => { window.location.reload() }, 1500)
                } else {
                    addToast('¡Error!', '¡Error al crear el grupo de materiales!', 'danger')
                    setLoader(false)
            }
            }
        } else { addToast('¡Error!', '¡Selecciona un tipo, marca y modelo!', 'danger') }
        setLoader(false)
    }

    return (
        <>
            {isCollapsed
                ? (
                    <div aria-expanded={isCollapsed} >
                        <div className='wrapper-brand-form'>
                            <form onSubmit={handleSubmitGroup}>
                            {loader && <Loader />}
                                <div>
                                    <label> Selecciona un tipo:</label>
                                    <select name="types" defaultValue={""}
                                        onChange={(e) => {
                                            if (e.target.value === '') {
                                                setGroupType(e.target.value)
                                                setGroupBrand('')
                                                setGroupModel('')
                                                setGroupComments('')
                                                setNewMaterialGroup({ brand: '', model: '', comments: '', type: e.target.value })
                                            } else {
                                                setGroupType(parseInt(e.target.value))
                                                setNewMaterialGroup({ ...newMaterialGroup, type: parseInt(e.target.value) })
                                            }
                                        }}>
                                        <option value={""}>Selecciona un tipo</option>
                                        {types && types.map(({ name, id }, i) => (<option key={i} value={id}>{name}</option>))}
                                    </select>
                                </div>

                                {groupType && (
                                    <div>
                                        <label> Selecciona una marca:</label>
                                        <select name="brands" defaultValue={""}
                                            onChange={(e) => {
                                                if (e.target.value === '') {
                                                    setGroupBrand(e.target.value)
                                                    setGroupModel('')
                                                    setGroupComments('')
                                                    setNewMaterialGroup({ ...newMaterialGroup, model: '', comments: '', brand: e.target.value })
                                                } else {
                                                    setGroupBrand(parseInt(e.target.value))
                                                    setNewMaterialGroup({ ...newMaterialGroup, brand: parseInt(e.target.value) })
                                                }
                                            }
                                            }>
                                            <option value={""}>Selecciona marca</option>
                                            {
                                                brands && brands.map(({ name, id }, i) => (
                                                    <option key={i} value={id}>{name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                )}

                                {(groupType && groupBrand) && (
                                    <>
                                        <div>
                                            <label> Selecciona modelo:</label>
                                            <select name="models" defaultValue={""}
                                                onChange={(e) => {
                                                    if (e.target.value === '') {
                                                        setGroupModel(e.target.value)
                                                        setNewMaterialGroup({ ...newMaterialGroup, model: e.target.value })
                                                    } else {
                                                        setGroupModel(parseInt(e.target.value))
                                                        setNewMaterialGroup({ ...newMaterialGroup, model: parseInt(e.target.value) })
                                                    }
                                                }}
                                            >
                                                <option value={""}>Selecciona modelo</option>
                                                {models && models.map(({ name, id, id_marca }, i) => (
                                                    (groupBrand !== "" && groupBrand === id_marca) &&
                                                    <option key={i} value={id}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <textarea cols="50" rows="6" placeholder='Añade un comentario para este grupo' value={groupComments}
                                            onChange={(e) => {
                                                setGroupComments(e.target.value)
                                                setNewMaterialGroup({ ...newMaterialGroup, comments: e.target.value })
                                            }} />
                                    </>
                                )}
                                <button className='createButton'>Crear</button>
                            </form>
                            <div className="closeButton" onClick={() => setIsCollapsed(!isCollapsed)}> <h2>CERRAR</h2></div>
                        </div>
                    </div>)
                : (
                    <div className="collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                        <h2 className='buttonCollapsed'>GRUPO</h2>
                    </div>
                )}
        </>
    )
}