import {
    defineQuery
} from '../../../PeerlessEngine/kerenginebitecs.mjs'
import {InputMouseCursor, Position, Rotation, Velocity, Variety} from '../../../PeerlessEngine/components/components.mjs'
import { Gun } from '../../components/components.mjs'
import {radians_between_vector2ds} from '../../../PeerlessEngine/engine_math.mjs'

import bullet from '../../entity_factories/create_bullet.mjs'
import VarietyManager from '../../../PeerlessEngine/managers/VarietyManager.mjs';
const shootableQuery = defineQuery([InputMouseCursor, Position, Gun])

const bullets_per_tic = 1
const system = world => {
    //gun shooting
    const shootables = shootableQuery(world)
    for (let i = 0; i < shootables.length; i++) {
        const eid = shootables[i]
        if(InputMouseCursor.left_click[eid]){
            for(let i = 0; i < bullets_per_tic; i++){
                let bullet_eid = bullet(world)
                let {speed} = VarietyManager.get(Variety.vid[bullet_eid])
                let radians = radians_between_vector2ds(Position.x[eid],Position.y[eid],InputMouseCursor.x[eid],InputMouseCursor.y[eid])
                //random spread
                radians = radians 
                Rotation.radians[bullet_eid] = radians
                Position.x[bullet_eid] = Position.x[eid]
                Position.y[bullet_eid] = Position.y[eid]
                Velocity.x[bullet_eid] = Math.cos(radians)*0.5
                Velocity.y[bullet_eid] = Math.sin(radians)*0.5
            }
        }
    }
}

export default system