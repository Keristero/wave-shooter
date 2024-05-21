import SceneManager from '../PeerlessEngine/managers/SceneManager.mjs'
import CanvasManager from '../PeerlessEngine/managers/CanvasManager.mjs'
import {Game} from '../PeerlessEngine/main.mjs'

import main_menu_scene from './scenes/main_menu_scene.mjs'
import primary_scene from './scenes/primary_scene.mjs'
import {canvas_alias_game,game_width,game_height,SCENES,game_tic_length_ms} from './constants.mjs'

CanvasManager.add_canvas(canvas_alias_game, game_width, game_height)
SceneManager.add(SCENES.MAIN_MENU,main_menu_scene)
SceneManager.add(SCENES.GAME,primary_scene)
SceneManager.set_scene(SCENES.MAIN_MENU)

const game = new Game({
    game_tic_length_ms:game_tic_length_ms
})
await game.start()