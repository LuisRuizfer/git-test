import { useEffect, useState, useContext } from 'react'
import { getAllBrands } from '../services/brands'
import { createNewModel, getAllModels } from '../services/models'
import { MessagesContext } from '../context/messagesContext'
import { removeAccentsAndNormalize, prepareToDatabase } from '../utils/utils'
import Loader from '../utils/Loader'


export const Model = () => {
    const { addToast } = useContext(MessagesContext)
    const [loader, setLoader] = useState(false)
    // Models States
    const [models, setModels] = useState([])
    const [suggestedModels, setSuggestedModels] = useState([])
    const [modelText, setModelText] = useState('')
    // Brands States
    const [brands, setBrands] = useState([])
    const [selectedBrand, setSelectedBrand] = useState('')

    const [isCollapsed, setIsCollapsed] = useState()

    useEffect(() => {
        (async function () {
            // Call to models service
            const models = await getAllModels()
            models.data.length > 0 && setModels(models.data)
            // Call to brands service
            const brands = await getAllBrands()
            brands.data.length > 0 && setBrands(brands.data)
        })()
    }, [])

    const onChangeHandlerModel = (model) => {
        // Uppercases the brand typed
        let modText = removeAccentsAndNormalize(model)
        let matches = []
        if (model.length > 0) {
            matches = models.filter((model) => {
                // Uppercases the brand from the database to compare and filter
                const upperCasedBrand = removeAccentsAndNormalize(model.name)
                const regex = new RegExp(`^${modText}`)
                return upperCasedBrand.match(regex)
            })
        }
        // Set the current suggested brands
        setSuggestedModels(matches)
        setModelText(prepareToDatabase(model))
    }

    const handleSubmitModel = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        if (modelText.length > 0 && selectedBrand.length > 0) {
            const checkIfExist = models.map(model => model.name).filter(model => removeAccentsAndNormalize(model) === removeAccentsAndNormalize(modelText))
            if (checkIfExist.length > 0) {
                addToast('¡Error!', '¡El modelo ya existe!', 'danger')
            } else {
                // Service call to create a new model
                const newModel = await createNewModel({ name: prepareToDatabase(modelText), id_marca: parseInt(selectedBrand) })
                if (newModel.status === 200) {
                    addToast('Nuevo modelo', '¡Nuevo modelo creado!', 'success')
                    setTimeout(() => { window.location.reload() }, 1500)
                    setLoader(false)
                } else {
                    addToast('¡Error!', '¡Error al crear el modelo!', 'danger')
                    setLoader(false)
                }
            }
        } else { addToast('¡Error!', '¡Selecciona una marca e introduce un modelo!', 'danger') }
        setLoader(false)
    }

    return (
        <>
            {isCollapsed
                ? (
                    <div aria-expanded={isCollapsed} >
                        <div className='wrapper-brand-form'>
                            <form onSubmit={handleSubmitModel}>
                            {loader && <Loader />}
                                <label> Selecciona una marca:</label>
                                <select name="brands" defaultValue={""} onChange={(e) => setSelectedBrand(e.target.value)} >
                                    <option value={""}>Selecciona una marca</option>
                                    {brands && brands.map(({ name, id }, i) => (<option key={i} value={id}>{name}</option>))}
                                </select>

                                <input type='text' placeholder='Modelo' value={modelText} onChange={(e) => onChangeHandlerModel(e.target.value)} autoComplete='off' />
                                <button className='createButton'>Crear</button>
                            </form>
                            {
                                suggestedModels.length > 0 && (<div className='suggestedText'>
                                    <p>MODELO EXISTENTE</p>
                                    {suggestedModels.map(({ name }, i) => (<div key={i} ><p>* {name}</p></div>))}
                                </div>)
                            }
                            <div className="closeButton" onClick={() => setIsCollapsed(!isCollapsed)}>
                                <h2>CERRAR</h2>
                            </div>
                        </div>
                    </div>)
                : (
                    <div className="collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                        <h2 className='buttonCollapsed'>MODELO</h2>
                    </div>
                )}
        </>
    )
}