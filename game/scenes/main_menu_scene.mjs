import {
    createWorld,
} from '../../PeerlessEngine/kerenginebitecs.mjs'

import create_rect from '../entity_factories/UI/create_rect.mjs'
import create_button from '../entity_factories/UI/create_button.mjs'
import create_mouse_cursor from '../entity_factories/create_mouse_cursor.mjs'
import { EVENTS, SCENES } from '../constants.mjs'
import {controller_system,mouse_system,debug_text_system,node_system,clickable_system,EventManager,SceneManager} from '../../PeerlessEngine/main.mjs'
import draw_system from '../systems/render/draw_system.mjs'
import { add_parent } from '../../PeerlessEngine/utilities/node_helpers.mjs'

class MainMenuScene {
    constructor() {
        this.world
    }
    init() {
        this.world = createWorld()
        //tools
        let mouse_cursor_eid = create_mouse_cursor(this.world)
        //arrange basic menu
        let menu_pane_eid = create_rect(this.world,
            {
                x: 100,
                y: 100,
                width: 400,
                height: 600
            }
        )
        let singleplayer_button_eid = create_button(this.world,
            {
                rel_x: 10,
                rel_y: 10,
                width: 300,
                height: 50,
                text:"Singleplayer",
                font_size:20
            }
        )
        let singleplayer_button_handler = EventManager.on((event)=>{
            if(event.eid == singleplayer_button_eid && event.type == EVENTS.EID_CLICKED){
                SceneManager.set_scene(SCENES.GAME)
            }
        })
        add_parent(this.world,singleplayer_button_eid,menu_pane_eid)
        let multiplayer_button_eid = create_button(this.world,
            {
                rel_x: 0,
                rel_y: 60,
                width: 300,
                height: 50,
                text:"Multiplayer",
                font_size:20
            }
        )
        add_parent(this.world,multiplayer_button_eid,singleplayer_button_eid)
    }
    update() {
        node_system(this.world)
        mouse_system(this.world)
        clickable_system(this.world)
        controller_system(this.world)
    }
    render() {
        draw_system(this.world)
        debug_text_system(this.world)
    }
}

export default new MainMenuScene()