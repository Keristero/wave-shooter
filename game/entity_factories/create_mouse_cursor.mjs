import {
    addEntity,
    addComponent,
} from '../../PeerlessEngine/kerenginebitecs.mjs'
import {Position,InputMouseCursor} from '../../PeerlessEngine/components/components.mjs'

function create_entity(world){
    //add a test entity
    const eid = addEntity(world)
    addComponent(world, Position, eid)
    addComponent(world, InputMouseCursor,eid)
    return eid
}

export default create_entity