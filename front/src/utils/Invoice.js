import { useEffect, useState } from 'react'
import FileViewer from 'react-file-viewer';

function Invoice({ invoice }) {
    const [fileSettings, setFileSettings] = useState({ type: '', file: '' })

    useEffect(() => {
        const typeArr = invoice.split('.')
        const type = typeArr[typeArr.length - 1]
        setFileSettings({ type, file: invoice })
    }, [invoice])

    return (<FileViewer fileType={fileSettings.type} filePath={fileSettings.file} />)
}
export default Invoice