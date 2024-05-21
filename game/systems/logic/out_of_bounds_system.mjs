import {
    defineQuery,
    removeEntity
} from '../../../PeerlessEngine/kerenginebitecs.mjs'
import { Position, Velocity } from '../../../PeerlessEngine/components/components.mjs'
import { game_width, game_height } from '../../constants.mjs';

const movementQuery = defineQuery([Position, Velocity])

const bounds_min_x = -100
const bounds_min_y = -100
const bounds_max_x = 100+game_width
const bounds_max_y = 100+game_height

const system = world => {
    //movement
    const ents = movementQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        if(Position.x[eid] > bounds_max_x || Position.x[eid] < bounds_min_x || Position.y[eid] > bounds_max_y || Position.y[eid] < bounds_min_y){
            removeEntity(world,eid);
        }
    }
    return world
}

export default system