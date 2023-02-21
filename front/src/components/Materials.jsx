import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import { getAllDataMaterials } from '../services/materials_unique'

// Services.
import { getAllDepartments } from '../services/departments'

// Misc.
import { removeAccentsAndNormalize, checkStartsWith, shortenDate } from '../utils/utils'
import back from '../assets/back.png'
import forward from '../assets/forward.png'


function Materials() {
    const [materials, setMaterials] = useState([])
    const [filteredMaterials, setFilteredMaterials] = useState([])

    const navigate = useNavigate()
    const { type } = useParams()

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
    const [departments, setDepartments] = useState([])
    const [brands, setBrands] = useState([])
    const [types, setTypes] = useState([])
    const [models, setModels] = useState([])

    // Filter state.
    const [searchParams, setSearchParams] = useState({ brand: '', type: '', model: '', ga_code: '', name: '', lastname: '', department: '', onlyStorage: false, emptyCode: false })

    useEffect(() => {
        (async function () {
            // Call to materials service.
            const materials = await getAllDataMaterials()
            materials.data.length > 0 && setMaterials(materials.data)
            materials.data.length > 0 && setFilteredMaterials(materials.data)

            // Call to departments service.
            const departments = await getAllDepartments()
            departments.data.length > 0 && setDepartments(departments.data)

            const brandsToFilter = [...new Set(materials.data.map(({ marca }) => marca).sort())]
            setBrands(brandsToFilter)

            const typesToFilter = [...new Set(materials.data.map(({ tipo }) => tipo).sort())]
            setTypes(typesToFilter)

            const modelsToFilter = [...new Set(materials.data.map(({ modelo }) => modelo).sort())]
            setModels(modelsToFilter)
        })()
    }, [])

    useEffect(() => {
        if (filteredMaterials && filteredMaterials.length > 0) {
            //Calcular la paginacion total.
            let auxArr = []
            for (let i = 0; i < Math.ceil(filteredMaterials.length / 10); i++) {
                auxArr.push(i + 1)
            }
            setTotalPaginacion(auxArr)
            // Número de páginas.
            const variable = page - 1
            setPaginacion({ inicio: 10 * variable, final: 10 * page })
        }
    }, [filteredMaterials, page])

    useEffect(() => {
        // Navigating to type from Home.
        (type === 'almacen')
            ? onChangeHandlerInput(type, 'name')
            : (type === 'stock')
                ? onChangeHandlerInput('', 'type')
                : onChangeHandlerInput(type, 'type')
    }, [materials])

    const onChangeHandlerInput = (text, filterType) => {
        const modText = removeAccentsAndNormalize(text)
        // Sets new filters based on received 'text'
        const newBrand = filterType === 'brand' ? modText : searchParams.brand
        const newType = filterType === 'type' ? modText : searchParams.type
        const newModel = filterType === 'model' ? modText : searchParams.model
        const newGACode = filterType === 'ga_code' ? modText : searchParams.ga_code
        const newName = filterType === 'name' ? modText : searchParams.name
        const newLastname = filterType === 'lastname' ? modText : searchParams.lastname
        const newDepartment = filterType === 'department' ? modText : searchParams.department
        const onlyStorageCheck = filterType === 'only_storage' ? !searchParams.onlyStorage : searchParams.onlyStorage
        const emptyCodeCheck = filterType === 'empty_code' ? !searchParams.emptyCode : searchParams.emptyCode

        setSearchParams({
            brand: newBrand,
            type: newType,
            model: newModel,
            ga_code: newGACode,
            name: newName,
            lastname: newLastname,
            department: newDepartment,
            onlyStorage: onlyStorageCheck,
            emptyCode: emptyCodeCheck
        })
        // Checks if any filter is empty
        const isBrandEmpty = newBrand === '' && true
        const isTypeEmpty = newType === '' && true
        const isModelEmpty = newModel === '' && true
        const isGACodeEmpty = newGACode === '' && true
        const isNameEmpty = newName === '' && true
        const isLastnameEmpty = newLastname === '' && true
        const isDepartmentEmpty = newDepartment === '' && true
        const isOnlyStorageEmpty = onlyStorageCheck === false && true
        const isEmptyCodeEmpty = emptyCodeCheck === false && true

        const results = (isBrandEmpty && isTypeEmpty && isModelEmpty && isGACodeEmpty && isNameEmpty && isLastnameEmpty && isDepartmentEmpty && isOnlyStorageEmpty && isEmptyCodeEmpty)
            ? materials
            : materials.filter(({ marca, tipo, modelo, ga_code, nombre, apellidos, departamento, id_trabajador }) => {
                return (
                    (!isBrandEmpty ? checkStartsWith(marca, newBrand) : true)
                    && (!isTypeEmpty ? checkStartsWith(tipo, newType) : true)
                    && (!isModelEmpty ? checkStartsWith(modelo, newModel) : true)
                    && (!isGACodeEmpty ? checkStartsWith(ga_code, newGACode) : true)
                    && (!isNameEmpty ? checkStartsWith(nombre, newName) : true)
                    && (!isLastnameEmpty ? checkStartsWith(apellidos, newLastname) : true)
                    && (!isDepartmentEmpty ? (departamento === newDepartment) : true)
                    && (!isOnlyStorageEmpty ? id_trabajador === 1 : true)
                    && (!isEmptyCodeEmpty ? ga_code === null : true)
                )
            })
        setFilteredMaterials(results)
    }

    return (
        <div className="materialsPadre">
            <div className="materialTable">
                <h1>Material</h1>
                <div className="searcher">
                    <div>
                        <p>Marca</p>
                        <select onChange={(e) => onChangeHandlerInput(e.target.value, 'brand')}>
                            <option value={''}>Marca</option>
                            {brands && brands.length > 0 && brands.map((marca) => (
                                <option key={marca} value={marca}>{marca}</option>))}
                        </select>
                    </div>
                    <div>
                        <p>Tipo</p>
                        <select onChange={(e) => onChangeHandlerInput(e.target.value, 'type')}>
                            <option value={''}>Tipo</option>
                            {types && types.length > 0 && types.map((tipo) => (
                                <option key={tipo} value={tipo}>{tipo}</option>))}
                        </select>
                    </div>
                    <div>
                        <p>Modelo</p>
                        <select onChange={(e) => onChangeHandlerInput(e.target.value, 'model')}>
                            <option value={''}>Modelo</option>
                            {models && models.length > 0 && models.map((modelo) => (
                                <option key={modelo} className="department" value={modelo}>{modelo}</option>))}
                        </select>
                    </div>
                    <div>
                        <p>GA Code</p>
                        <input name='ga_code' type="text" placeholder='GA Code' autoComplete='off' value={searchParams.ga_code}
                            onChange={(e) => onChangeHandlerInput(e.target.value, 'ga_code')} />
                    </div>
                    <div>
                        <p>Departamento:</p>
                        <select onChange={(e) => onChangeHandlerInput(e.target.value, 'department')}>
                            <option value={''}>Departamento</option>
                            {departments && departments.length > 0 && departments.map(({ nombre, id }, i) => (
                                <option key={i} className="department" value={nombre}>{nombre}</option>))}
                        </select>
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
                    <div>
                        <p>Sin código GA:</p>
                        <input type="checkbox" value={searchParams.emptyCode} onChange={(e) => onChangeHandlerInput(e.target.value, 'empty_code')} />
                    </div>
                    <div>
                        <p>Solo almacén:</p>
                        <input type="checkbox" value={searchParams.onlyStorage} onChange={(e) => onChangeHandlerInput(e.target.value, 'only_storage')} />
                    </div>
                </div>

                <div className="header">
                    <div>Marca</div>
                    <div>Tipo</div>
                    <div>Modelo</div>
                    <div>precio</div>
                    <div>GA Code</div>
                    <div>Fecha creación</div>
                    <div>Nombre - Apellidos</div>
                    <div>Departamento</div>
                </div>
            </div>

            <div name="model" id="model">
                {
                    (filteredMaterials.length > 0) && (filteredMaterials.map(({ material_id, marca, tipo, modelo, precio, ga_code, creationDate, nombre, apellidos, id, departamento }, i) => {
                        return ((i >= paginacion.inicio && i < paginacion.final) && <div key={i} className=''>
                            <div className='materialsList' key={id} onClick={() => navigate(`/material-unique/${material_id}`)}>
                                <div className='materialsList__material'>
                                    <p >{marca}</p>
                                    <p >{tipo}</p>
                                    <p >{modelo}</p>
                                    <p >{precio}</p>
                                    <p >{ga_code}</p>
                                    <p >{shortenDate(creationDate)}</p>
                                    <p >{nombre} - {apellidos}</p>
                                    <p >{departamento}</p>
                                </div>
                            </div>
                        </div>)
                    }))
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
    )
}
export default Materials
