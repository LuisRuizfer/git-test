// Imports 
import { useState, useContext, useRef } from 'react'
import { MessagesContext } from "../context/messagesContext"
import { createInvoice } from '../services/invoices'
import Loader from '../utils/Loader'

export const Invoice = () => {
    const { addToast } = useContext(MessagesContext)
    const [loader, setLoader] = useState(false)

    // Invoice State
    const refImage = useRef()
    const [selectedFile, setSelectedFile] = useState(null)
    const [comments, setComments] = useState('')
    const [date, setDate] = useState('')
    const [totalPrice, setTotalPrice] = useState('')

    const [isCollapsed, setIsCollapsed] = useState()

    //Create Invoice
    const call_to_create_invoice = async (e) => {
        e.preventDefault()
        setLoader(true)
        
        const response = await createInvoice({ image: selectedFile, comments: comments, real_date: date, price: totalPrice })

        if (response.status === 200) {
            addToast('Factura', '¡Nueva factura creada!', 'success')
            setTimeout(() => { window.location.reload() }, 1500)
        } else {
            addToast('¡Error!', '¡Error al subir la factura!', 'danger') }
        setLoader(false)
    }

    return (
        <div>
            {isCollapsed
                ? (
                    <div className='wrapper-brand-form'>
                        <form className='addImage' onSubmit={call_to_create_invoice}>
                        {loader && <Loader />}
                            <div>
                                <label>Imagen de la factura</label>
                                <input type='file' className='addImage__none' accept="image/*, .pdf" ref={refImage} onChange={(e) => setSelectedFile(e.target.files[0])} />
                                <p className='addImage__input' onClick={() => refImage.current.click()}>
                                    {selectedFile ? selectedFile.name : 'No se ha selecionado imagen'}
                                </p>
                            </div>

                            <div>
                                <label>Fecha de la factura</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>

                            <div>
                                <label>Precio total:</label>
                                <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />
                            </div>

                            <div>
                                <label>Comentario</label>
                                <textarea cols="50" rows="6" type="text" value={comments} onChange={(e) => setComments(e.target.value)} />
                            </div>

                            <button className='createButton' type="submit" >Enviar factura</button>
                        </form>
                        <div className="closeButton" onClick={() => setIsCollapsed(!isCollapsed)}>
                            <h2>CERRAR</h2>
                        </div>
                    </div>)
                : (<div className="collapse-button"
                    onClick={() => setIsCollapsed(!isCollapsed)}>
                    <h2 className='buttonCollapsed'>AÑADIR FACTURA</h2>
                </div>)
            }
        </div>
    )
}
