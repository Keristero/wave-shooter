import {
    createWorld,
} from '../../PeerlessEngine/kerenginebitecs.mjs'

import test_square from '../entity_factories/create_test_square.mjs'
import player from '../entity_factories/create_player.mjs'
import { Position } from '../../PeerlessEngine/components/components.mjs'
import out_of_bounds_system from '../systems/logic/out_of_bounds_system.mjs'
import {debug_text_system,animation_system,mouse_system,controller_system} from '../../PeerlessEngine/main.mjs'
import draw_system from '../systems/render/draw_system.mjs'
import movement_system from '../systems/logic/movement_system.mjs'
import weapon_system from '../systems/logic/weapon_system.mjs'

class PrimaryScene{
    constructor(){
    }
    init(){
        this.world = createWorld()
        this.world.frame = 0
        //add a test entity
        test_square(this.world)
        let some_player_id = player(this.world)
        Position.x[some_player_id] = Math.random()*500
        Position.y[some_player_id] = Math.random()*500
    }
    update(){
        mouse_system(this.world)
        controller_system(this.world)
        weapon_system(this.world)
        movement_system(this.world)
        out_of_bounds_system(this.world)
        animation_system(this.world)
        this.world.frame++
    }
    render(){
        draw_system(this.world)
        debug_text_system(this.world)
    }
}

export default new PrimaryScene()