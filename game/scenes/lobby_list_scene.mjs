import {
    createWorld,
    removeEntity,
} from '../../PeerlessEngine/kerenginebitecs.mjs'

import create_rect from '../entity_factories/UI/create_rect.mjs'
import create_button from '../entity_factories/UI/create_button.mjs'
import create_mouse_cursor from '../entity_factories/create_mouse_cursor.mjs'
import {SCENES, NETWORK} from '../constants.mjs'
import {EVENTS} from '../../PeerlessEngine/engine_constants.mjs'
import {Scene, controller_system,mouse_system,debug_text_system,node_system,clickable_system,EventManager,SceneManager,NetworkManager} from '../../PeerlessEngine/main.mjs'
import draw_system from '../systems/render/draw_system.mjs'
import { add_parent } from '../../PeerlessEngine/utilities/node_helpers.mjs'

class LobbyListScene extends Scene{
    constructor() {
        super()
        this.peer_states = {}
        this.local_state = {}
        this.lobby_buttons = []
    }
    create_lobby(lobby_name){
        this.local_state.lobby = {
            name:lobby_name
        }
        NetworkManager.send_state(NETWORK.LOBBY_ROOM_NAME,this.local_state)
    }
    init() {
        this.world = createWorld()
        this.world.frame = 0
        //tools
        let mouse_cursor_eid = create_mouse_cursor(this.world)
        //arrange basic menu
        this.menu_pane_eid = create_rect(this.world,
            {
                x: 100,
                y: 100,
                width: 800,
                height: 70
            }
        )
        this.back_button_eid = create_button(this.world,
            {
                rel_x: 10,
                rel_y: 10,
                width: 300,
                height: 50,
                text:"Back",
                font_size:20
            }
        )
        add_parent(this.world,this.back_button_eid,this.menu_pane_eid)
        this.create_lobby_button_eid = create_button(this.world,
            {
                rel_x: 310,
                rel_y: 0,
                width: 300,
                height: 50,
                text:"Create Lobby",
                font_size:20
            }
        )
        add_parent(this.world,this.create_lobby_button_eid,this.back_button_eid)
        this.lobby_list_pane_eid = create_rect(this.world,
            {
                x: 100,
                y: 180,
                width: 800,
                height: 400
            }
        )
    }
    scene_activated(){
        NetworkManager.join_room(NETWORK.CONFIG,NETWORK.LOBBY_ROOM_NAME)
        //buttons
        this.back_button_listener = EventManager.on((event)=>{
            if(event.eid == this.back_button_eid && event.type == EVENTS.EID_CLICKED){
                SceneManager.set_scene(SCENES.MAIN_MENU)
            }
        })
        this.create_lobby_button_listener = EventManager.on((event)=>{
            if(event.eid == this.create_lobby_button_eid && event.type == EVENTS.EID_CLICKED){
                this.create_lobby(window.prompt('Lobby Name:'))
            }
        })

        //network
        this.peer_joined_listener = EventManager.on((event)=>{
            if(event.type == EVENTS.EID_NETWORK_PEER_JOINED){
                console.log('peer joined!')
                NetworkManager.send_state_to_peer(NETWORK.LOBBY_ROOM_NAME,event.peer_id,this.local_state)
                this.peer_states[event.peer_id] = {}
            }
        })
        this.peer_left_listener = EventManager.on((event)=>{
            if(event.type == EVENTS.EID_NETWORK_PEER_LEFT){
                console.log('peer left!')
                delete this.peer_states[event.peer_id]
                this.refresh_lobby_buttons()
            }
        })
        this.peer_remote_state_listener = EventManager.on((event)=>{
            if(event.type == EVENTS.EID_NETWORK_REMOTE_STATE){
                console.log('peer state!',event.state)
                this.peer_states[event.peer_id] = event.state
                this.refresh_lobby_buttons()
            }
        })
    }
    scene_deactivated(){
        NetworkManager.leave_room(NETWORK.LOBBY_ROOM_NAME)
        EventManager.remove_listener(this.back_button_listener)
        EventManager.remove_listener(this.create_lobby_button_listener)
        EventManager.remove_listener(this.peer_joined_listener)
        EventManager.remove_listener(this.peer_left_listener)
        EventManager.remove_listener(this.peer_remote_state_listener)
    }
    refresh_lobby_buttons(){
        console.log('refreshing buttons')
        for(let eid of this.lobby_buttons){
            removeEntity(this.world,eid)
        }
        this.lobby_buttons = []
        let lobby_list = []
        for(let peer_id in this.peer_states){
            let peer_state = this.peer_states[peer_id]
            if(peer_state.lobby){
                lobby_list.push({
                    peer_id:peer_id,
                    info:peer_state.lobby
                })
            }
        }
        let index = 0
        for(let lobby of lobby_list){
            let lobby_button_eid = create_button(this.world,
                {
                    rel_x: 10,
                    rel_y: 10+index*40,
                    width: 500,
                    height: 30,
                    text:`${lobby.info.name}`,
                    font_size:15
                }
            )
            this.lobby_buttons.push(lobby_button_eid)
            add_parent(this.world,lobby_button_eid,this.lobby_list_pane_eid)
            index++
        }
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