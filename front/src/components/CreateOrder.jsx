import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBrands } from "../services/brands"
import { getInvoices } from '../services/invoices'
import { getAllTypes } from "../services/types"
import { getAllMaterialsGroup } from "../services/materials_group"
import { MessagesContext } from "../context/messagesContext"
import { InfoUserContext } from '../context/infoUser'
import { shortenDate } from '../utils/utils'
import { getAllModels } from '../services/models'
import { createMaterialsUniqueFromInvoice } from '../services/materials_unique'
import Loader from '../utils/Loader'

function CreateOrder() {
    const { addToast } = useContext(MessagesContext)
    const { infoUser } = useContext(InfoUserContext)
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)

    // Selects - Options
    const [allInvoices, setAllInvoices] = useState([])
    const [brands, setBrands] = useState([])
    const [types, setTypes] = useState([])
    const [models, setModels] = useState([])
    const [groups, setGroups] = useState([])

    // To Submit
    const [toCart, setToCart] = useState({ type: '', brand: '', model: '', quantity: 0, price: 0 })
    const [cart, setCart] = useState({ order: { id_factura: "" }, material_group: [], assigner: infoUser.mail })

    useEffect(() => {
        (async function () {
            // Call to brands service
            const brands = await getAllBrands()
            brands.data.length > 0 && setBrands(brands.data)
            // Call to models service
            const models = await getAllModels()
            models.data.length > 0 && setModels(models.data)
            // Call to types service
            const types = await getAllTypes()
            types.data.length > 0 && setTypes(types.data)
            // Call to invoices service
            const invoices = await getInvoices()
            invoices.data.length > 0 && setAllInvoices(invoices.data)
            // Call to material groups service
            const groups = await getAllMaterialsGroup()
            groups.data.length > 0 && setGroups(groups.data)
        })()
    }, [])

    // If all inputs/selects are filled, it will let it add the product to the cart
    const addToCart = () => {
        const { type, brand, model, quantity, price } = toCart
        const check = type && brand && model && quantity && price && cart.order.id_factura && true
        if (check) {
            const checkIfExist = groups.filter(({ marca, modelo, tipo }) => (marca === brand && modelo === model && tipo === type))
            // If checkIfExists has any data, it means that the material group exists and IT CAN BE added to the cart
            if (checkIfExist.length > 0) {
                // Gets the material_group id
                const material_group_id = checkIfExist[0].id
                const product = {
                    id: material_group_id,
                    type: type,
                    brand: brand,
                    model: model,
                    quantity: quantity,
                    price: price
                }
                setCart({ ...cart, material_group: [...cart.material_group, product] })
                setToCart({ type: '', brand: '', model: '', quantity: 0, price: 0 })
                addToast('Carrito', 'Producto añadido al carrito', 'success')
            } else { addToast('¡Error!', 'Por favor crea el producto primero', 'danger') }
        } else { addToast('¡Error!', 'Por favor añade todos los datos', 'danger') }
    }
    // Takes the index from the cart and filters the cart, removing the product with said index
    const deleteFromCart = (index) => {
        const remainingCart = cart.material_group.filter((product, i) => i !== index)
        setCart({ ...cart, material_group: remainingCart })
    }

    const create_invoice = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        const { order, material_group, assigner } = cart
        // Checks if the cart's keys are filled with data. If it is not, it wont send the data to backend
        const check = order.id_factura && material_group.length > 0 && assigner.length > 0 && true
        if (!check) {
            addToast('¡Error!', 'Por favor añade todos los datos', 'danger')
            setLoader(false)
        } else {
            // Call to material unique service
            const sendData = await createMaterialsUniqueFromInvoice(cart)
            if (sendData.status === 200) {
                addToast('Materiales únicos', '¡Nuevos materiales únicos creado!', 'success')
                setTimeout(() => { navigate('/materials/stock') }, 1500)
                setLoader(false)
            } else {
                addToast('¡Error!', '¡Error al crear los materiales únicos', 'danger')
                setLoader(false)
            }
        }
        setLoader(false)
    }
    return (
        <div>
            <h1>Añadir pedido</h1>
            <form className='addOrder-form' onSubmit={create_invoice}>
            {loader && <Loader />}
                <div className='orderElement'>
                    <label>Imagen de la factura</label>
                    {allInvoices && <select name='invoices' defaultValue={''}
                        onChange={(e) => setCart({ ...cart, order: { id_factura: parseInt(e.target.value) } })}>
                        <option value={0}>Selecciona una factura</option>
                        {allInvoices.map(({ created_at, comments, id }, i) => (
                            <option value={id} key={i}>{shortenDate(created_at)} - {comments}</option>)
                        )}
                    </select>
                    }
                </div>
                <div className='orderElements'>
                    <div>
                        <label>Tipo</label>
                        <select onChange={(e) => setToCart({ ...toCart, type: parseInt(e.target.value) })} value={toCart.type}>
                            <option value={0}>Selecciona un tipo</option>
                            {types && (types.map(({ name, id }, i) => (<option value={id} key={i}>{name}</option>)))}
                        </select>
                    </div>
                    <div>
                        <label>Marca</label>
                        <select onChange={(e) => setToCart({ ...toCart, brand: parseInt(e.target.value) })} value={toCart.brand}>
                            <option value={0}>Selecciona una marca</option>
                            {brands && (brands.map(({ name, id }, i) => (<option value={id} key={i}>{name}</option>)))}
                        </select>
                    </div>
                    <div>
                        <label>Modelo</label>
                        <select onChange={(e) => setToCart({ ...toCart, model: parseInt(e.target.value) })} value={toCart.model}>
                            <option value={0}>Selecciona una marca</option>
                            {models && (models.map(({ name, id, id_marca }, i) => ((toCart.brand && toCart.brand === id_marca) && <option value={id} key={i}>{name}</option>)))}
                        </select>
                    </div>
                    <div>
                        <label>Cantidad</label>
                        <input type='number' placeholder='Cantidad' value={toCart.quantity}
                            onChange={(e) => setToCart({ ...toCart, quantity: (e.target.value === '') ? '' : parseInt(e.target.value) })} />
                    </div>
                    <div>
                        <label>Precio</label>
                        <input type='number' placeholder='Precio' value={toCart.price}
                            onChange={(e) => setToCart({ ...toCart, price: (e.target.value === '') ? '' : parseInt(e.target.value) })} />
                    </div>
                    <span onClick={() => addToCart()} className='createButton'>Añadir</span>
                </div>
                <button className='createButton-send' type="submit">Enviar</button>
            </form>
            {cart.material_group.length > 0 && (
                <div className='cart'>
                    {cart.material_group.map(({ type, brand, model, quantity, price }, i) => (
                        <div className="addOrder-form" key={i}>
                            <div>
                                <label>Tipo:</label>
                                <p>{type && types.filter(t => t.id === parseInt(type)).map(t => t.name)}</p>
                            </div>
                            <div>
                                <label>Marca:</label>
                                <p>{brand && brands.filter(b => b.id === parseInt(brand)).map(b => b.name)}</p>
                            </div>
                            <div>
                                <label>Modelo:</label>
                                <p>{model && models.filter(m => m.id === parseInt(model)).map(m => m.name)}</p>
                            </div>
                            <div>
                                <label>Cantidad:</label><p>{quantity}</p>
                            </div>
                            <div>
                                <label>Precio:</label><p>{price}</p>
                            </div>
                            <div>
                                <div className='createButton-delete' onClick={() => deleteFromCart(i)}>Eliminar</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default CreateOrder
