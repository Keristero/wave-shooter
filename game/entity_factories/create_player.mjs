import {
    addEntity,
    addComponent,
} from '../../PeerlessEngine/kerenginebitecs.mjs'
import {Position,Velocity,RGBColor,InputAnalog, InputMouseCursor,Interpolate, Rectangle} from '../../../PeerlessEngine/components/components.mjs'
import {Gun} from '../components/components.mjs'

function create_entity(world){
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