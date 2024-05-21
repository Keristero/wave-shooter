import {
    defineQuery
} from '../../../PeerlessEngine/kerenginebitecs.mjs'
import { InputAnalog, Position, Velocity } from '../../../PeerlessEngine/components/components.mjs'
import {game_tic_length_ms} from '../../constants.mjs'

const movementQuery = defineQuery([Position, Velocity])

const controllableQuery = defineQuery([InputAnalog, Velocity])

const system = world => {
    //acceleration
    const controllables = controllableQuery(world)
    const player_acceleration = 0.2
    for (let i = 0; i < controllables.length; i++) {
        const eid = controllables[i]
        Velocity.x[eid] = InputAnalog.x[eid] * player_acceleration
        Velocity.y[eid] = InputAnalog.y[eid] * player_acceleration
    }
    //movement
    const ents = movementQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        Position.x[eid] += Velocity.x[eid] * game_tic_length_ms
        Position.y[eid] += Velocity.y[eid] * game_tic_length_ms
    }
    return world
}

export default system