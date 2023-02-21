import { useEffect, useState, useContext } from 'react'
import { createNewBrand, getAllBrands } from '../services/brands'
import { MessagesContext } from '../context/messagesContext'
import { prepareToDatabase, removeAccentsAndNormalize } from '../utils/utils'
import Loader from '../utils/Loader'

export const Brand = () => {
    const { addToast } = useContext(MessagesContext)
    const [loader, setLoader] = useState(false)

    // Brands States
    const [brands, setBrands] = useState([])
    const [suggestedBrands, setSuggestedBrands] = useState([])
    const [brandText, setBrandText] = useState('')

    const [isCollapsed, setIsCollapsed] = useState()

    useEffect(() => {
        (async function () {
            // Call to brands service
            const brands = await getAllBrands()
            brands.data.length > 0 && setBrands(brands.data)
        })()
    }, [])

    const onChangeHandlerBrand = (brand) => {
        // Uppercases the brand typed
        let modText = removeAccentsAndNormalize(brand)
        let matches = []
        if (brand.length > 0) {
            matches = brands.filter((brand) => {
                // Uppercases the brand from the database to compare and filter
                const upperCasedBrand = removeAccentsAndNormalize(brand.name)
                const regex = new RegExp(`^${modText}`)
                return upperCasedBrand.match(regex)
            })
        }
        // Set the current suggested brands
        setSuggestedBrands(matches)
        setBrandText(prepareToDatabase(brand))
    }

    const handleSubmitBrand = async (e) => {
        e.preventDefault()
        setLoader(true)

        if (brandText.length > 0) {
            const checkIfExist = brands.map(brand => brand.name).filter(brand => removeAccentsAndNormalize(brand) === removeAccentsAndNormalize(brandText))
            if (checkIfExist.length > 0) {
                addToast('¡Error!', '¡La marca ya existe!', 'danger')
                setLoader(false)
            } else {
                // Service call to create the brand
                const newBrand = await createNewBrand({ name: prepareToDatabase(brandText) })
                if (newBrand.status === 200) {
                    addToast('Nueva marca', '¡Nueva marca creada!', 'success')
                    setTimeout(() => { window.location.reload() }, 1500)
                    setLoader(false)
                } else {
                    addToast('¡Error!', '¡Error al crear la marca!', 'danger')
                    setLoader(false)
                }
            }
        } else { addToast('¡Error!', '¡Introduce una marca!', 'danger') }
        setLoader(false)
    }


    return (
        <>
            {isCollapsed
                ? (
                    <div aria-expanded={isCollapsed} >
                        <div className='wrapper-brand-form'>
                            <form onSubmit={handleSubmitBrand}>
                            {loader && <Loader />}
                                <label> Añade una marca:</label>
                                <input id='brand' type='text' placeholder='Marca' onChange={(e) => onChangeHandlerBrand(e.target.value)} value={brandText} autoComplete='off' />
                                <button className='createButton'>Crear</button>
                            </form>
                            {
                                suggestedBrands.length > 0 && (<div className='suggestedText'>
                                    <p>MARCA EXISTENTE</p>
                                    {suggestedBrands.map(({ name }, i) => (
                                        <div key={i} ><p>{name}</p></div>
                                    ))}
                                </div>)
                            }
                            <div className="closeButton" onClick={() => setIsCollapsed(!isCollapsed)}> <h2>CERRAR</h2> </div>
                        </div>
                    </div>)
                : (
                    <div className="collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                        <h2 className='buttonCollapsed'>MARCA</h2>
                    </div>
                )}
        </>
    )
}

