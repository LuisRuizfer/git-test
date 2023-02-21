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
    <form>
      <select className="select_material" name="Tipo" defaultValue='Tipo' >
        {/* {onChange={e => handleChange(e)}
                    valores.responsables.map(({name}) => {
                        <option name={name}>{name}</option>
                    })
                } */}
                <option disabled name='Tipo'>Tipo</option>
      </select>

      <select className="select_material" name="Marca" defaultValue='Marca'>
        <option disabled name='Marca'>Marca</option>
      </select>
      <select className="select_material" name="Modelo" defaultValue='Modelo'>
        <option disabled>Modelo</option>
      </select>
      <input className="select_material" type='number'/>
      <button type="submit">Enviar</button>
    </form>
  );
}
export default FormCreate;
