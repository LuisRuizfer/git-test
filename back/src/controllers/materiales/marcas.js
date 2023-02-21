//Imports
const { getAllBrands, createBrand, editBrand, getBrandById } = require('../../models/materiales/marcas')

//! Gets all brands from database (Checked)
const getAllMarcas = async (req, res) => {
    try {
        const brands = await getAllBrands()
        if (brands.length > 0) {
            return res.status(200).json(brands);
        } else {
            return res.status(500).json({ message: 'No existen marcas' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al traer las marcas' });
    }
}

//! Creates a new brand (Checked)
const createMarca = async (req, res) => {
    try {
        const { name } = req.body;
        const brand = await createBrand(name)
        if (brand.affectedRows !== 0) {
            return res.status(200).json({ brand, message: 'Marca creada correctamente' });
        } else {
            return res.status(500).json({ message: 'Error al crear marca' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear marca' });
    }
}

//! Edits an existing brand (Checked)
const editMarca = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body;
        const updatedBrand = await editBrand(id, name)
        if (updatedBrand.affectedRows !== 0) {
            return res.status(200).json({ message: 'marca editada correctamente' });
        } else {
            return res.status(500).json({ message: 'error al editar marca' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al editar marca' });
    }
}

//! Gets a brand by it's ID (Checked)
const getMarcaById = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await getBrandById(parseInt(id))
        if (brand.length > 0) {
            return res.status(200).json(brand);
        } else {
            return res.status(500).json({ message: 'No existe marca' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer una marca por id' })
    }
}

module.exports = { createMarca, editMarca, getAllMarcas, getMarcaById };