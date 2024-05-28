import {
    defineQuery,Not
} from '../../../PeerlessEngine/kerenginebitecs.mjs'
import { Position,RGBColor, Velocity ,Interpolate,Sprite, Animation, Rectangle,Text,Hidden} from '../../../PeerlessEngine/components/components.mjs'
import {CanvasManager,ResourceManager,PerformanceManager,ReferenceTypeManager} from '../../../PeerlessEngine/main.mjs'
import {canvas_alias_game} from '../../constants.mjs'
//const drawQuery = defineQuery([Position])

const draw_query = defineQuery([Not(Interpolate),Not(Hidden),Position,RGBColor,Rectangle])
const interpolated_draw_query = defineQuery([Not(Hidden),Interpolate,Position,Velocity,RGBColor,Rectangle])
const interpolated_draw_query_sprites = defineQuery([Not(Hidden),Interpolate,Position,Velocity,Sprite,Animation])

const text_query = defineQuery([Not(Hidden),Position,Text,Rectangle])

const system = world => {
    let canvas = CanvasManager.get_by_alias(canvas_alias_game)
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = `rgba(0,0,0,1)`
    ctx.fillRect(0,0,canvas.width,canvas.height)
    //interpolated draw
    const game_time = PerformanceManager.game_time
    const render_time = PerformanceManager.render_time
    var update_tics_ahead = 0
    var ms_ahead = render_time.then-game_time.then
    update_tics_ahead = ms_ahead/game_time.delta
    let ents = interpolated_draw_query(world)
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i]
      let x = Position.x[eid]+(Velocity.x[eid]*game_time.delta*update_tics_ahead)
      let y = Position.y[eid]+(Velocity.y[eid]*game_time.delta*update_tics_ahead)
      ctx.fillStyle = `rgb(${RGBColor.r[eid]},${RGBColor.g[eid]},${RGBColor.b[eid]})`
      ctx.fillRect(x,y,Rectangle.width[eid],Rectangle.height[eid])
    }
    ents = interpolated_draw_query_sprites(world)
    ctx.globalCompositeOperation = "lighter"
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i]
      let image = ResourceManager.get(Sprite.rid[eid])
      let animation = ResourceManager.get(Animation.rid[eid])
      let x = Position.x[eid]+(Velocity.x[eid]*game_time.delta*update_tics_ahead)
      let y = Position.y[eid]+(Velocity.y[eid]*game_time.delta*update_tics_ahead)
      let state_data = animation.animation_states[Animation.state[eid]]
      let frame_data = state_data.frames[Animation.frame[eid]]
      let {width,height} = frame_data
      let draw_x = x-(frame_data.anchor_pos.x-frame_data.source_bounds.minX)
      let draw_y = y-(frame_data.anchor_pos.y-frame_data.source_bounds.minY)
      ctx.drawImage(image, frame_data.source_bounds.minX, frame_data.source_bounds.minY, width, height, draw_x, draw_y, width, height)
    }
    ctx.globalCompositeOperation = "source-over"
    //standard draw
    ents = draw_query(world)
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i]
      let x = Position.x[eid]
      let y = Position.y[eid]
      let width = Rectangle.width[eid]
      let height = Rectangle.height[eid]

      ctx.fillStyle = `rgb(${RGBColor.r[eid]},${RGBColor.g[eid]},${RGBColor.b[eid]})`
      ctx.fillRect(x,y,width,height)
    }

    //text draw
    ents = text_query(world)
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i]
      let x = Position.x[eid]
      let y = Position.y[eid]
      let width = Rectangle.width[eid]
      let height = Rectangle.height[eid]
      let text_string = ReferenceTypeManager.get(Text.ctid[eid])
      let text_height = Text.font_size[eid]
      ctx.font = `${text_height}px Arial`
      let text_width = ctx.measureText(text_string).width
      let vertical_centering_magic_number = 1.2
      //Draw text centered within rectangle
      const center_x = x + (width - text_width) / 2;
      const center_y = y + text_height/vertical_centering_magic_number + (height - text_height) / 2;
      ctx.fillStyle = `rgb(255,255,255)`
      ctx.fillText(text_string, center_x, center_y);
    }
    return world
}

export default system