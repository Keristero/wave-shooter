import {
    addEntity,
    addComponent,
} from '../../PeerlessEngine/kerenginebitecs.mjs'
import {Position,Velocity,RGBColor} from '../../../PeerlessEngine/components/components.mjs'

function create_entity(world){
    //add a test entity
    const eid = addEntity(world)
    addComponent(world, Position, eid)
    addComponent(world, Velocity, eid)
    addComponent(world, RGBColor, eid)
    RGBColor.r[eid] = 255
    RGBColor.g[eid] = 255
    RGBColor.b[eid] = 0
    Velocity.x[eid] = 1.23
    Velocity.y[eid] = 1.23
}

export default create_entity