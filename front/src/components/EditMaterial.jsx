import { useEffect, useState, useContext } from "react"
// import { Link, useParams, useNavigate } from 'react-router-dom'
// import { getAllDataMaterials } from '../services/materials_unique'

// Services.
import { editMaterialGroup, getAllMaterialsGroup } from '../services/materials_group'
import { getAllModels } from '../services/models'
import { getAllBrands } from '../services/brands'
import { getAllTypes } from '../services/types'

// Misc.
import { getNameByID } from '../utils/utils'
import { MessagesContext } from '../context/messagesContext'
import back from '../assets/back.png'
import forward from '../assets/forward.png'
import Loader from "../utils/Loader"

function EditMaterial() {
    const [loader, setLoader] = useState(false)
    const [toEdit, setToEdit] = useState({
        id_to_edit: 0,
        isOpen: false
    })
    const { addToast } = useContext(MessagesContext)

    // Group States
    const [materialsGroup, setMaterialsGroup] = useState([])
    const [filteredMaterials, setFilteredMaterials] = useState([])

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

    // Filter states.
    const [brands, setBrands] = useState([])
    const [types, setTypes] = useState([])
    const [models, setModels] = useState([])

    // Filter state.
    const [searchParams, setSearchParams] = useState({
        brand: 0,
        type: 0,
        model: 0
    })

    const [changeDataGroup, setChangeDataGroup] = useState({
        id_group: 0,
        brand: 0,
        type: 0,
        model: 0,
        comment: ''
    })


    useEffect(() => {
        (async function () {
            // Call to material groups service
            const materialGroups = await getAllMaterialsGroup()
            materialGroups.data.length > 0 && setMaterialsGroup(materialGroups.data)
            materialGroups.data.length > 0 && setFilteredMaterials(materialGroups.data)

            // Call to brands service
            const brands = await getAllBrands()
            brands.data.length > 0 && setBrands(brands.data)

            // Call to types service
            const types = await getAllTypes()
            types.data.length > 0 && setTypes(types.data)

            // Call to models service
            const models = await getAllModels()
            models.data.length > 0 && setModels(models.data)
        })()
    }, [])

    useEffect(() => {
        if (filteredMaterials && filteredMaterials.length > 0) {
            //Calcular la paginacion total.
            let auxArr = [];
            for (let i = 0; i < Math.ceil(filteredMaterials.length / 10); i++) {
                auxArr.push(i + 1);
            }
            setTotalPaginacion(auxArr)
            // Número de páginas.
            const variable = page - 1
            setPaginacion({ inicio: 10 * variable, final: 10 * page })
        }
    }, [filteredMaterials, page])


    const onChangeHandlerInput = (idToParseInt, filterType) => {
        const id = parseInt(idToParseInt)
        // Sets new filters based on received idToParseInt.
        const newBrand = filterType === 'brand' ? id : searchParams.brand
        const newType = filterType === 'type' ? id : searchParams.type
        const newModel = filterType === 'model' ? id : searchParams.model

        setSearchParams({
            brand: newBrand,
            type: newType,
            model: newModel,
        })
        // Checks if any filter is empty
        const isBrandEmpty = newBrand === 0 && true
        const isTypeEmpty = newType === 0 && true
        const isModelEmpty = newModel === 0 && true

        const results = (isBrandEmpty && isTypeEmpty && isModelEmpty)
            ? materialsGroup
            : materialsGroup.filter(({ marca, tipo, modelo }) => {
                return (
                    (!isBrandEmpty ? (marca === newBrand) : true)
                    && (!isTypeEmpty ? (tipo === newType) : true)
                    && (!isModelEmpty ? (modelo === newModel) : true)
                )
            })
        setFilteredMaterials(results)
    }

    const sendChanges = async (e) => {
        e.preventDefault()
        setLoader(true)
       
        const { id_group } = changeDataGroup
        const checkIfExists = materialsGroup.filter(({ tipo, marca, modelo }) => (changeDataGroup.type === tipo && changeDataGroup.brand === marca && changeDataGroup.model === modelo))
        if (checkIfExists.length === 0) {
            const materialToEdit = await editMaterialGroup(changeDataGroup, id_group)
            if (materialToEdit.status === 200) {
                addToast('Grupo de materiales', '¡Grupo de materiales editado!', 'success')
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
                setLoader(false)
            } else {
                addToast('¡Error!', '¡Error al editar el grupo de materiales!', 'danger')
                setLoader(false)
            }
        } else {
            addToast('Grupo de materiales', '¡El grupo de materiales ya existe!', 'danger')
        }
        setLoader(false)
    }
    return (
        <>
            <div className="materialsPadre">
                <div className="materialTable">
                    <h1>Edición de material</h1>
                    <div className="searcher-edit">
                        <div>
                            <p>Tipo</p>
                            <select onChange={(e) => onChangeHandlerInput(e.target.value, 'type')}>
                                <option value={0}>Tipo</option>
                                {types && types.length > 0 &&
                                    types.map(({ id, name }, i) => (
                                        <option value={id} key={i}>{name}</option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <p>Marca</p>
                            <select onChange={(e) => onChangeHandlerInput(e.target.value, 'brand')}>
                                <option value={0}>Marca</option>
                                {brands && brands.length > 0 &&
                                    brands.map(({ id, name }, i) => (
                                        <option value={id} key={i} >{name}</option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <p>Modelo</p>
                            <select onChange={(e) => onChangeHandlerInput(e.target.value, 'model')}>
                                <option value={0}>Modelo</option>
                                {models && models.length > 0 &&
                                    models.map(({ id, name }, i) => (
                                        <option value={id} key={i}>{name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className="header-edit">
                        <div></div>
                        <div>Tipo</div>
                        <div>Marca</div>
                        <div>Modelo</div>
                        <div className='commentText-title'>Comentario</div>
                    </div>
                </div>
                <div name="model" id="model">
                    {
                        (filteredMaterials && filteredMaterials.length > 0) &&
                        filteredMaterials.map(({ id, marca, tipo, modelo, comments }, i) => {
                            return (
                                (i >= paginacion.inicio && i < paginacion.final) &&
                                <div key={i} className=''>
                                    {(toEdit.isOpen === true && toEdit.id_to_edit === id)
                                        ? (
                                            <form onSubmit={sendChanges} className='materialsList__material-edit'>
                                                {loader && <Loader />}
                                                <div className='buttonCollapsed-edit'
                                                    onClick={() => {
                                                        setToEdit({ id_to_edit: parseInt(id), isOpen: !(toEdit.isOpen) })
                                                        setChangeDataGroup({
                                                            id_group: 0,
                                                            brand: 0,
                                                            type: 0,
                                                            model: 0,
                                                            comment: ''
                                                        })
                                                    }
                                                    }>
                                                    Cerrar
                                                </div>

                                                <select className='selectToEdit'
                                                    onChange={(e) => setChangeDataGroup({ ...changeDataGroup, type: parseInt(e.target.value) })}>
                                                    <option value={tipo}>{getNameByID(types, tipo)}</option>
                                                    {types && types.length > 0 &&
                                                        types.map(({ id, name }, i) => (
                                                            (id !== tipo) &&
                                                            <option key={i} value={id}>{name}</option>
                                                        ))}
                                                </select>

                                                <select className='selectToEdit'
                                                    onChange={(e) => setChangeDataGroup({ ...changeDataGroup, brand: parseInt(e.target.value) })}>
                                                    <option value={marca}>{getNameByID(brands, marca)}</option>
                                                    {brands && brands.length > 0 &&
                                                        brands.map(({ id, name }, i) => (
                                                            (id !== marca) &&
                                                            <option key={i} value={id}>{name}</option>
                                                        ))}
                                                </select>

                                                <select className='selectToEdit'
                                                    onChange={(e) => setChangeDataGroup({ ...changeDataGroup, model: parseInt(e.target.value) })}>
                                                    {/* <option value={modelo}>{getNameByID(models, modelo)}</option> */}
                                                    {models && models.length > 0 &&
                                                        models.map(({ id, name, id_marca }, i) => (
                                                            (id_marca === changeDataGroup.brand) &&
                                                            <option key={i} value={id}>{name}</option>
                                                        ))}
                                                </select>

                                                <textarea className='commentText-edit'
                                                    onChange={(e) => setChangeDataGroup({ ...changeDataGroup, comment: e.target.value })} defaultValue={comments} />
                                                <button className='editButton' type='submit'>CAMBIAR</button>
                                            </form>
                                        )
                                        : (
                                            <div className='materialsList__material-show' key={i}>
                                                <button className='buttonCollapsed-edit'
                                                    onClick={() => {
                                                        setToEdit({ id_to_edit: parseInt(id), isOpen: !(toEdit.isOpen) })
                                                        setChangeDataGroup({
                                                            id_group: parseInt(id),
                                                            brand: marca,
                                                            type: tipo,
                                                            model: modelo,
                                                            comment: comments
                                                        })
                                                    }}>
                                                    <span className=''>Editar</span>
                                                </button>
                                                <p>{getNameByID(types, tipo)}</p>
                                                <p>{getNameByID(brands, marca)}</p>
                                                <p>{getNameByID(models, modelo)}</p>
                                                <p className='commentText'>{comments}</p>
                                            </div>
                                        )}
                                </div>
                            )
                        })
                    }

                    {filteredMaterials.length > 10 && <div className='paginacion'>
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
export default EditMaterial
