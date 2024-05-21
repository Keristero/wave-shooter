import {
    addEntity,
    addComponent,
} from '../../../PeerlessEngine/kerenginebitecs.mjs'
import {Position,RGBColor,Rectangle,Node, RelativePosition} from '../../../PeerlessEngine/components/components.mjs'

function create_entity(world,props){
    //add a test entity
    const {x,y,width,height} = props
    const eid = addEntity(world)
    addComponent(world, Position, eid)
    Position.x[eid] = x
    Position.y[eid] = y
    addComponent(world, RelativePosition, eid)

    addComponent(world, RGBColor, eid)
    RGBColor.r[eid] = 20
    RGBColor.g[eid] = 20
    RGBColor.b[eid] = 0
    addComponent(world, Rectangle, eid)
    Rectangle.width[eid] = width
    Rectangle.height[eid] = height
    addComponent(world, Node, eid)
    return eid
}

export default create_entity