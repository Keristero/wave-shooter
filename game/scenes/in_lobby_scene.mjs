import {
    createWorld,
} from '../../PeerlessEngine/kerenginebitecs.mjs'

import create_rect from '../entity_factories/UI/create_rect.mjs'
import create_button from '../entity_factories/UI/create_button.mjs'
import create_mouse_cursor from '../entity_factories/create_mouse_cursor.mjs'
import { EVENTS, SCENES, NETWORK} from '../constants.mjs'
import {Scene,controller_system,mouse_system,debug_text_system,node_system,clickable_system,EventManager,SceneManager,NetworkManager} from '../../PeerlessEngine/main.mjs'
import draw_system from '../systems/render/draw_system.mjs'
import { add_parent } from '../../PeerlessEngine/utilities/node_helpers.mjs'

class InLobbyScene extends Scene {
    constructor() {
        super()
    }
    init() {
        this.world = createWorld()
        this.world.frame = 0
        //tools
        let mouse_cursor_eid = create_mouse_cursor(this.world)
        //arrange basic menu
        let menu_pane_eid = create_rect(this.world,
            {
                x: 100,
                y: 100,
                width: 800,
                height: 70
            }
        )
        let back_button_eid = create_button(this.world,
            {
                rel_x: 10,
                rel_y: 10,
                width: 300,
                height: 50,
                text:"Back",
                font_size:20
            }
        )
        EventManager.on((event)=>{
            if(event.eid == back_button_eid && event.type == EVENTS.EID_CLICKED){
                SceneManager.set_scene(SCENES.MAIN_MENU)
            }
        })
    }
    update() {
        node_system(this.world)
        mouse_system(this.world)
        clickable_system(this.world)
        controller_system(this.world)
        this.world.frame++
    }
    render() {
        draw_system(this.world)
        debug_text_system(this.world)
    }
}

export default new LobbyListScene()