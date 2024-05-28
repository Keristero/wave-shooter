import {
    addEntity,
    addComponent,
} from '../../../PeerlessEngine/kerenginebitecs.mjs'
import {Position,RGBColor,Rectangle,Node,RelativePosition,Text,Clickable,Hidden} from '../../../PeerlessEngine/components/components.mjs'
import {ReferenceTypeManager} from '../../../PeerlessEngine/main.mjs'

function create_entity(world,props){
    //add a test entity
    const {rel_x,rel_y,width,height,text,font_size} = props
    const eid = addEntity(world)
    addComponent(world, Position, eid)
    addComponent(world, RelativePosition, eid)
    RelativePosition.x[eid] = rel_x
    RelativePosition.y[eid] = rel_y
    addComponent(world, RGBColor, eid)
    RGBColor.r[eid] = 40
    RGBColor.g[eid] = 40
    RGBColor.b[eid] = 0
    addComponent(world, Rectangle, eid)
    Rectangle.width[eid] = width
    Rectangle.height[eid] = height
    addComponent(world, Node, eid)
    addComponent(world, Text,eid)
    Text.ctid[eid] = ReferenceTypeManager.add(text)
    Text.font_size[eid] = font_size
    addComponent(world, Clickable, eid)
    if(props.hidden){
        addComponent(world, Hidden, eid)
    }
    return eid
}

export default create_entity