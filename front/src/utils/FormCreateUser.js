//Imports
import { useState } from "react";
import dataForm from "./FormCreateMaterial";

function FormCreate() {
  // const [values, setValues] = useState(dataForm[props].values);
  //   const handleChange = e => {
  //       const { name, value } = e.target;
  //       setValues({ ...values, [name]: value });
  //   }

  // const handleSubmit = async e => {
  //     e.preventDefault();

  //     const service = dataForm[props].services.create;
  //     const response = await service(values);
  //     if( response ){
  //         console.log(response)
  //     }
  //  }

  return (
    <form className="select">
      <input  name="Nombre" type="text" placeholder="Nombre" />
      <input  name="Apellidos" type="text" placeholder="Apellidos" />
      <input  name="Posición" type="text" placeholder="Posición" />
      <select  name="Departamento" defaultValue='Departamento' >
        {/* {onChange={e => handleChange(e)}
                    valores.responsables.map(({name}) => {
                        <option name={name}>{name}</option>
                    })
                } */}
                <option disabled name='Departamento'>Departamento</option>
      </select>

      <select  name="Ubicación" defaultValue='Ubicación'>
        <option disabled name='Ubicación'>Ubicación</option>
        <option  name='vdfvg'>Ubicación</option>
        <option  name='Ubicdcsdación'>Ubicación</option>
      </select>
      <select  name="Responsable" defaultValue='Responsable'>
        <option disabled>Responsable</option>
      </select>
      <select  name="Activo" defaultValue='Activo'>
        <option disabled>Activo</option>
      </select>
      <select  name="Es reponsable" defaultValue='Es responsable'>
        <option disabled>Es responsable</option>
      </select>

      <button type="submit">Enviar</button>
    </form>
  );
}
export default FormCreate;
