import {
    addEntity,
    addComponent,
} from '../../PeerlessEngine/kerenginebitecs.mjs'
import {Position,Velocity,RGBColor,InputAnalog, InputMouseCursor,Interpolate, Rectangle, PeerId} from '../../PeerlessEngine/components/components.mjs'
import {ReferenceTypeManager} from '../../PeerlessEngine/main.mjs'
import {Gun} from '../components/components.mjs'

function create_entity(world,peer_id){
    //add a test entity
    const eid = addEntity(world)
    addComponent(world, Position, eid)
    addComponent(world, Velocity, eid)
    addComponent(world, Rectangle, eid)
    addComponent(world, RGBColor, eid)
    addComponent(world, Interpolate, eid)
    addComponent(world, InputAnalog,eid)
    addComponent(world, InputMouseCursor,eid)
    addComponent(world, Gun,eid)
    addComponent(world, PeerId,eid)
    PeerId.ctid[eid] = ReferenceTypeManager.add(peer_id)
    RGBColor.r[eid] = 0
    RGBColor.g[eid] = 0
    RGBColor.b[eid] = 255
    Velocity.x[eid] = 0
    Velocity.y[eid] = 0
    Rectangle.width[eid] = 10
    Rectangle.height[eid] = 20
    return eid
}

export default create_entity