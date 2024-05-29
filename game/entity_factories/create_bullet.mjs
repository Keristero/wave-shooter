import {
    addEntity,
    addComponent,
} from '../../PeerlessEngine/kerenginebitecs.mjs'
import {Position,Velocity,RGBColor, Interpolate,Sprite,Rotation,Animation,Animated, Variety} from '../../PeerlessEngine/components/components.mjs'
import {ResourceManager,VarietyManager} from '../../PeerlessEngine/main.mjs'
import RNG from '../../PeerlessEngine/utilities/RNG.mjs'

const bullet_animation_rid = await ResourceManager.load('../../game/resources/sprites/orb.animation')
const bullet_image_rid = await ResourceManager.load('../../game/resources/sprites/orb.png')

let normal_bullet_vid = VarietyManager.add({
    speed:1
})

let slow_bulled_vid = VarietyManager.add({
    speed:0.5
})

let bullet_varieties = [
    normal_bullet_vid,
    slow_bulled_vid
] 

function create_entity(world){
    //add a test entity
    const eid = addEntity(world)
    addComponent(world, Position, eid)
    addComponent(world, Velocity, eid)
    addComponent(world, Interpolate, eid)
    addComponent(world, Rotation, eid)
    addComponent(world, Sprite, eid)
    addComponent(world, Animation, eid)
    addComponent(world, Animated, eid)
    Sprite.rid[eid] = bullet_image_rid
    Animation.rid[eid] = bullet_animation_rid
    Animation.state[eid] = 0 //first state
    //Animation.frame[eid] = 0 //first frame
    Animated.is_looping[eid] = 0 //animation is looping
    Animated.is_paused[eid] = 0
    Animated.speed[eid] = 1
    Animation.frame[eid] = Math.floor(Math.random()*3)
    Velocity.x[eid] = 0
    Velocity.y[eid] = 0
    addComponent(world, Variety, eid)
    Variety.vid[eid] = RNG.from_array(bullet_varieties)
    return eid
}

export default create_entity