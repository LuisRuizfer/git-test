// Imports 

import { Brand } from './Brand'
import { Type } from './Type'
import { Model } from './Model'
import { Group } from './Group'
import { Invoice } from './Invoice'
import { MaterialUnique } from './MaterialUnique'

function CreateMaterial() {
   
    return (
        <div>
            <MaterialUnique />
            <Brand />
            <Type />
            <Model />
            <Group />
            <Invoice />
        </div >
    )
}
export default CreateMaterial
