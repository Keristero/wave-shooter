import {
    createWorld,
    removeEntity,
    addComponent,
    removeComponent
} from '../../PeerlessEngine/kerenginebitecs.mjs'

import {Hidden} from '../../PeerlessEngine/components/components.mjs'
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
        this.lobby_details = {}
        this.joined_lobby_details = {}
    }
    create_lobby(lobby_name){
        this.local_state.lobby = {
            name:lobby_name,
            room_id:this.generate_lobby_id(12),
            started:false,
            players:1
        }
        NetworkManager.send_state(NETWORK.LOBBY_ROOM_NAME,this.local_state)
        this.join_lobby(this.local_state.lobby)
    }
    i_am_host(){
        return this.local_state?.lobby?.room_id == this?.joined_lobby_details?.room_id
    }
    generate_lobby_id(digits){
        // Calculate the minimum and maximum values for x digits
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        // Generate a random number within the calculated range
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        // Convert the random number to a string to ensure it has x digits
        return randomNumber.toString();
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
        //buttons
        this.back_button_eid = create_button(this.world,
            {
                rel_x: 10,
                rel_y: 10,
                width: 250,
                height: 50,
                text:"Back",
                font_size:20
            }
        )
        add_parent(this.world,this.back_button_eid,this.menu_pane_eid)
        this.create_lobby_button_eid = create_button(this.world,
            {
                rel_x: 260,
                rel_y: 0,
                width: 250,
                height: 50,
                text:"Create Lobby",
                font_size:20
            }
        )
        add_parent(this.world,this.create_lobby_button_eid,this.back_button_eid)
        this.start_game_button_eid = create_button(this.world,
            {
                rel_x: 260,
                rel_y: 0,
                width: 250,
                height: 50,
                text:"Start Lobby",
                font_size:20,
                hidden:true
            }
        )
        add_parent(this.world,this.start_game_button_eid,this.create_lobby_button_eid)
        //lobbies
        this.lobby_list_pane_eid = create_rect(this.world,
            {
                x: 100,
                y: 180,
                width: 800,
                height: 400
            }
        )
    }
    leave_lobby(lobby_details){
        addComponent(this.world,Hidden,this.start_game_button_eid)
        NetworkManager.leave_room(lobby_details.room_id)
    }
    close_lobby(){
        this.local_state = {}
        NetworkManager.send_state(NETWORK.LOBBY_ROOM_NAME,this.local_state)
    }
    join_lobby(lobby_details){
        if(this.local_state?.lobby?.room_id != lobby_details.room_id){
            //if we join a different lobby while hosting one, close ours
            this.close_lobby()
        }
        if(this.joined_lobby_details?.room_id){
            //if we join a different lobby, leave the old one
            this.leave_lobby(this.joined_lobby_details)
        }
        console.log(`attempting to join lobby`,lobby_details)
        NetworkManager.join_room(NETWORK.CONFIG,lobby_details.room_id)
        this.joined_lobby_details = lobby_details
        if(this.i_am_host()){
            console.log('i am host supreme')
            //reveal start game button for the host
            removeComponent(this.world,Hidden,this.start_game_button_eid)
        }
    }
    send_start_signal(){
        this.local_state.lobby.started=true
        NetworkManager.send_state(NETWORK.LOBBY_ROOM_NAME,this.local_state)
        NetworkManager.send_state(this.local_state.lobby.room_id,"start")
        this.start_game()
    }
    start_game(){
        let parameters = {
            is_host:this.i_am_host(),
            lobby:this.joined_lobby_details
        }
        SceneManager.set_scene(SCENES.GAME,parameters)
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
        this.join_lobby_button_listener = EventManager.on((event)=>{
            if(event.type == EVENTS.EID_CLICKED && this.lobby_buttons.includes(event.eid)){
                this.join_lobby(this.lobby_details[event.eid])
            }
        })
        this.start_game_button_handler = EventManager.on((event)=>{
            if(event.type == EVENTS.EID_CLICKED && event.eid == this.start_game_button_eid){
                this.send_start_signal()
            }
        })

        //network
        this.peer_joined_listener = EventManager.on((event)=>{
            if(event.type == EVENTS.EID_NETWORK_PEER_JOINED){
                if(event.room_name == NETWORK.LOBBY_ROOM_NAME){
                    console.log('peer joined lobby list')
                    NetworkManager.send_state_to_peer(NETWORK.LOBBY_ROOM_NAME,event.peer_id,this.local_state)
                    this.peer_states[event.peer_id] = {}
                }
                if(event.room_name == this.local_state?.lobby?.room_id){
                    console.log('peer joined our lobby')
                    this.local_state.lobby.players++
                    NetworkManager.send_state(NETWORK.LOBBY_ROOM_NAME,this.local_state)
                }
            }
        })
        this.peer_left_listener = EventManager.on((event)=>{
            if(event.type == EVENTS.EID_NETWORK_PEER_LEFT){
                if(event.room_name == NETWORK.LOBBY_ROOM_NAME){
                    console.log('peer left lobby list')
                    delete this.peer_states[event.peer_id]
                    this.refresh_lobby_buttons()
                }
                if(event.room_name == this.local_state?.lobby?.room_id){
                    console.log('peer left our lobby')
                    this.local_state.lobby.players--
                    NetworkManager.send_state(NETWORK.LOBBY_ROOM_NAME,this.local_state)
                }
            }
        })
        this.peer_remote_state_listener = EventManager.on((event)=>{
            if(event.type == EVENTS.EID_NETWORK_REMOTE_STATE){
                console.log(event)
                if(event.room_name == NETWORK.LOBBY_ROOM_NAME){
                    console.log('peer state!',event.state)
                    this.peer_states[event.peer_id] = event.state
                    this.refresh_lobby_buttons()
                }else if(event.room_name == this.joined_lobby_details?.room_id){
                    this.start_game()
                }
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
        EventManager.remove_listener(this.join_lobby_button_listener)
    }
    refresh_lobby_buttons(){
        console.log('refreshing buttons')
        for(let eid of this.lobby_buttons){
            removeEntity(this.world,eid)
        }
        this.lobby_buttons = []
        this.lobby_details = {}
        let lobby_list = []
        for(let peer_id in this.peer_states){
            let peer_state = this.peer_states[peer_id]
            if(peer_state.lobby && !peer_state.lobby.started){
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
                    text:`lobby:${lobby.info.name} players:${lobby.info.players}`,
                    font_size:15
                }
            )
            this.lobby_buttons.push(lobby_button_eid)
            this.lobby_details[lobby_button_eid] = lobby.info
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