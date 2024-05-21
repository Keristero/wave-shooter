import {
    Types,
    defineComponent,
} from '../../PeerlessEngine/kerenginebitecs.mjs'

//Game bespoke components
export const Gun = defineComponent({
    shot_cooldown:Types.i16
})