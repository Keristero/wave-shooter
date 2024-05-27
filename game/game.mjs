import {Game,SceneManager,CanvasManager} from '../PeerlessEngine/main.mjs'

import main_menu_scene from './scenes/main_menu_scene.mjs'
import primary_scene from './scenes/primary_scene.mjs'
import {canvas_alias_game,game_width,game_height,SCENES,game_tic_length_ms} from './constants.mjs'
import lobby_list_scene from './scenes/lobby_list_scene.mjs'

CanvasManager.add_canvas(canvas_alias_game, game_width, game_height)
SceneManager.add(SCENES.MAIN_MENU,main_menu_scene)
SceneManager.add(SCENES.GAME,primary_scene)
SceneManager.add(SCENES.LOBBY_LIST,lobby_list_scene)
SceneManager.set_scene(SCENES.MAIN_MENU)

const game = new Game({
    game_tic_length_ms:game_tic_length_ms
})
await game.start()