module.exports = ({ nombre, apellidos, dni, materiales }) => {
    const materialsHtml = materiales.length > 0 && materiales.map(({ tipo, marca, modelo, ga_code, serial_number, id_tipo, imei }) =>
        `<li>${tipo} ${marca} ${modelo} con código GA: ${ga_code}${id_tipo === 18 ? `, número de serie: ${serial_number} y código IMEI: ${imei}.` : ` y número de serie: ${serial_number}.`}</li>`).join('')
    const emptyMaterials = !materialsHtml && `no tengo asignado ningún material que pertenezca a la empresa.`
    const today = new Date();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 1.2rem;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%
        }

        table {
            border-collapse: separate;
            mso-table-lspace: 0;
            mso-table-rspace: 0;
            width: 100%
        }

        table td {
            font-family: sans-serif;
            vertical-align: top
        }

        .head {
            text-align: center;
        }

        .body {
            width: 100%
        }

        .container {
            display: block;
            margin: 0 auto !important;
            padding: 10px;
            width: 80%
        }

        .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            padding: 10px;
            width: 100%;
        }

        .main {
            background: #fff;
            border-radius: 3px;
            width: 100%
        }

        .wrapper {
            box-sizing: border-box;
            padding: 20px
        }

        .content-block {
            padding-bottom: 10px;
            padding-top: 10px
        }

        .footer {
            clear: both;
            margin-top: 10px;
            text-align: center;
            width: 100%
        }

        .footer a,
        .footer p,
        .footer span,
        .footer td {
            color: #999;
            text-align: center
        }

        h1,
        h2,
        h3,
        h4 {
            color: #000;
            font-family: sans-serif;
            font-weight: 400;
            line-height: 1.4;
            margin: 0;
            margin-bottom: 30px
        }

        h1 {
            font-weight: 300;
            text-align: center;
            text-transform: capitalize
        }

        ol,
        p,
        ul {
            font-family: sans-serif;
            font-weight: 400;
            margin: 0;
            margin-bottom: 15px
        }

        ol li,
        p li,
        ul li {
            list-style-position: inside;
            margin-left: 5px
        }

        a {
            color: #3498db;
            text-decoration: underline
        }

        .orion-email {
            text-align: center;
        }

        @media only screen and (max-width:620px) {
            table.body h1 {
                margin-bottom: 10px !important
            }

            table.body .article,
            table.body .wrapper {
                padding: 10px !important
            }

            table.body .content {
                padding: 0 !important
            }

            table.body .container {
                padding: 0 !important;
                width: 100% !important
            }

            table.body .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important
            }

            table.body .btn table {
                width: 100% !important
            }

            table.body .btn a {
                width: 100% !important
            }

            table.body .img-responsive {
                height: 100% !important;
                max-width: 100% !important;
                width: auto !important
            }
        }
    </style>
</head>

<body>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
            <td>&nbsp;</td>
            <td class="container">
                <div class="content">
                    <table role="presentation" class="main">
                        <tr>
                            <td class="wrapper">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr class="head">
                                        <td>
                                            <h2>GLOBAL ALUMNI EDUCATION</h2>
                                        </td>
                                    </tr>
                                    <tr class="head">
                                        <td>
                                            <h3>ASIGNACIÓN DE MATERIAL</h3>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>Yo, ${nombre} ${apellidos} con NIF/NIE:</p>
                                            <p>Por la presente certifico que, a fecha de hoy ${dayNames[today.getDay()]}
                                                ${today.getDate()} de
                                                ${monthNames[today.getMonth()]} de ${today.getFullYear()} ${emptyMaterials ? emptyMaterials : 'me es asignado el siguiente material:'}</p>
                                                ${materialsHtml
            ? `<ul>
                                                        ${materialsHtml}
                                                    </ul>`
            : ''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h3>Clausulas y condiciones:</h3>
                                            <ul>
                                                <li>El equipo se presta debido a la necesidad del trabajador de
                                                    teletrabajar indefinidamente.</li>
                                                <li>El equipo se cederá hasta finalización del contrato o por
                                                    requerimientos de la empresa y
                                                    entrará en vigor desde la firma del presente documento.</li>
                                                <li>Durante el periodo de cesión se responsabiliza de custodiar y
                                                    devolver en las mismas
                                                    condiciones que le ha sido prestado.</li>
                                                <li>En el caso de que se determine deficiencia o desperfecto a causa del
                                                    mal uso y/o negligencia,
                                                    estaré obligado a asumir el costo de mantenimiento/ reparación o
                                                    reposición del equipo.</li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>Fdo:</p>

                                            <p>En Madrid, ${today.getDate()} de ${monthNames[today.getMonth()]} de
                                                ${today.getFullYear()}.</p>
                                        </td>
                                    </tr>
                                    <!-- LOGO -->
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr class="head">
                                        <td>
                                            <img src="https://professionalprogramsmit.com/gateway/api/215-998/globalimagelogo.png"
                                                alt="Logo-Global-Alumni" width="50%">
                                        </td>
                                    </tr>
                                    <!-- LOGO -->
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
            <td>&nbsp;</td>
        </tr>
    </table>

</body>

</html>
`;
};