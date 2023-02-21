
function Loader({ type }){
    return(
        <div className={`loaderPadre ${type}`}>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> Cargando...
        </div>
    )
}
export default Loader
