import {
    createWorld,
} from '../../PeerlessEngine/kerenginebitecs.mjs'

import test_square from '../entity_factories/create_test_square.mjs'
import player from '../entity_factories/create_player.mjs'
import { Position } from '../../PeerlessEngine/components/components.mjs'
import out_of_bounds_system from '../systems/logic/out_of_bounds_system.mjs'
import {Scene, debug_text_system,animation_system,mouse_system,controller_system,NetworkManager} from '../../PeerlessEngine/main.mjs'
import draw_system from '../systems/render/draw_system.mjs'
import movement_system from '../systems/logic/movement_system.mjs'
import weapon_system from '../systems/logic/weapon_system.mjs'

class PrimaryScene extends Scene{
    constructor(){
        super()
    }
    init(){
        this.world = createWorld()
        this.world.frame = 0
        //add a test entity
        test_square(this.world)
    }
    scene_activated(activate_parameters){
        console.log('here we are with',activate_parameters)
        //create players
        let room_id = activate_parameters?.lobby?.room_id
        //create own player
        let own_id = NetworkManager.get_own_id(room_id) || "singleplayerid"
        let some_player_id = player(this.world,own_id)
        Position.x[some_player_id] = 100
        Position.y[some_player_id] = 100
        //create other players
        let peers = NetworkManager.get_peers(room_id)
        for(let peer_id in peers){
            //create each peer
            console.log(peer_id,peers[peer_id])
            let other_player_id = player(this.world,peer_id)
            Position.x[other_player_id] = 100
            Position.y[other_player_id] = 100
        }
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