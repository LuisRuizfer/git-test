//Imports
require('dotenv').config({ path: './.env' });
const express = require('express');
const figlet = require('figlet')
const cors = require('cors');

const app = express();

//Configuraciones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));

//Routes
app.use(require('./routes/materiales/marcas'));             //! Brand Routes (Checked).
app.use(require('./routes/materiales/materials_group'));    //! Material Routes (Checked).
app.use(require('./routes/materiales/materials_unique'));   // Material Routes
app.use(require('./routes/materiales/models'));             //! Model Routes (Checked).
app.use(require('./routes/materiales/types'));              //! Type Routes (Checked).
app.use(require('./routes/materiales/material_assignment'));//! Material Assignments Routes.
app.use(require('./routes/invoice'));                       //! Invoice Routes
app.use(require('./routes/documents'));                     //! Documents Routes

app.use(require('./routes/users/users'));                   //! User Routes
app.use(require('./routes/users/departments'));             //! Departments Routes.
app.use(require('./routes/users/locations'));               //! Locations Routes.
app.use(require('./routes/users/positions'));               //! Positions Routes.

//File Storage
app.use('/431-1220', express.static(`${__dirname}/storage/facturas`));
app.use('/431-1221', express.static(`${__dirname}/storage/documents`));

//Run Server
app.listen(process.env.PORT, () => {
    figlet('todo OK', (err, res) => {
        console.log(res);
        console.log(`Server work in port: ---> ${process.env.PORT}`);
    })
})