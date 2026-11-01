import { ARTWORK_ITEMS, artworkStyleForTheme, drawArtwork } from './engine/artwork.js';
import { getCanvasPalette } from './themes.js';
export const GIMMICK_FUNCTIONS = {
  pendulum: ['Drag the tip to aim, then release or press Play. The tip hits targets; tap or press Space during flight to use a pulse.', '先端をドラッグして狙い、放すかプレイで開始。先端で的を当て、飛行中のタップやスペースでパルスを使います。'],
  multi: ['More connected links create a faster, more complex swing. Only the terminal bob clears targets.', '関節が増えると動きが複雑になります。的を壊すのは一番先の球です。'],
  clones: ['Multiple pendulums share a pivot. Their tips can collide and exchange momentum.', '複数の振り子が支点を共有します。先端同士が衝突すると運動が変わります。'],
  target: ['Hit the red bullseye with the tip to clear it. Clear the remaining targets before time runs out.', '先端を赤い的に当てて壊します。時間内に残りの的をクリアしましょう。'],
  armored: ['Blue shield segments protect the red core. Each hit removes armor; the number shows hits remaining.', '青い装甲が赤い的を守ります。当てるたびに装甲が減り、数字は残りの耐久力を示します。'],
  bomb: ['Contact detonates the bomb and clears nearby targets. The fuse is decorative; aim at the round casing.', '触れると爆発し、近くの的を壊します。導火線は飾りなので、丸い本体を狙いましょう。'],
  portal: ['Enter an IN portal to warp toward its paired OUT portal. Labels identify the linked entrances and exits.', 'INに入ると対応するOUTへ移動します。表示で入口と出口の組を確認しましょう。'],
  boost: ['Pass through a green ring to add speed to your swing.', '緑のリングを通ると振り子が加速します。'],
  laser: ['Touching a laser costs a shield life. With no lives left, the attempt ends.', 'レーザーに触れるとライフが減ります。残りがなくなると失敗です。'],
  bumper: ['The solid blue circular pad reflects the bob. Its circular face is the contact surface.', '青い丸いパッドに当たると球が跳ね返ります。丸い面が接触する部分です。'],
  spring: ['Gold spring pads add energy to the rebound. The spring underneath is decoration; contact happens at the round pad.', '金色のパッドは強く跳ね返します。下のバネは飾りで、丸い面に当たると反応します。'],
  absorber: ['Gray pads absorb much of the swing speed instead of producing a strong bounce.', '灰色のパッドは強く跳ね返さず、速度の多くを吸収します。'],
  switch: ['Hit the switch to open its linked gate temporarily. A green indicator means active.', 'スイッチに当てると対応するゲートが一時的に開きます。緑の表示は作動中です。'],
  gate: ['Closed amber barriers block the bob. Activate the matching switch and cross before the gate closes again.', '閉じた黄色のゲートは球を止めます。対応するスイッチを押し、閉じる前に通りましょう。'],
  rail: ['The carriage moves the pivot horizontally, changing both the launch position and swing.', '台車が支点を左右に動かし、発射位置と振り子の動きが変わります。'],
  lift: ['The pivot rides up and down. Time your launch with the lift motion.', '支点が上下に動きます。昇降に合わせて開始しましょう。'],
  orbit: ['The pivot follows an orbital path. The moving anchor changes the bob trajectory.', '支点が公転軌道を動き、先端の進路が変わります。'],
  wind: ['Arrows show the wind direction. Steady wind pushes consistently; gusts change over time.', '矢印は風向きです。一定の風もあれば、時間とともに変化する突風もあります。'],
  blackhole: ['Purple inward arrows mark attraction. The outer field pulls the pendulum; the dark core can swallow its tip.', '紫の内向き矢印は引力です。外側の場が引き寄せ、暗い中心に先端が入ると飲み込まれます。'],
  repulsor: ['Cyan outward arrows mark repulsion. The field pushes away; core contact bounces the bob.', '水色の外向き矢印は反発です。近づくと押し返され、中心に触れると跳ね返ります。'],
  gravity: ['Stages can reduce, increase, reverse or periodically flip gravity. Watch the gravity indicator and stage briefing.', '重力が弱い、強い、逆向き、定期反転などのステージがあります。重力表示と説明を確認しましょう。'],
  slime: ['The cyan rectangular area slows motion while the tip is inside it.', '水色の四角い領域に先端が入ると動きが遅くなります。'],
  resin: ['Amber sticky areas strongly damp the swing while the tip is inside. Build speed before entering.', '黄色い粘着領域に先端が入ると動きが減衰します。入る前に速度をつけましょう。'],
  moving: ['A circular guard patrols its marked route. Adjust your launch angle to pass its patrol.', '丸い障害物が表示された進路を巡回します。巡回を避けられる発射角度を探しましょう。'],
};
export function installGimmickGuide({ $, language, pauseDemo, resumeDemo }) {
  function render() {
    const palette = getCanvasPalette(), style = artworkStyleForTheme(palette.theme), ja = language() === 'ja';
    $('gimmickCards').replaceChildren(...ARTWORK_ITEMS.map(([kind, en, jp]) => {
      const card = document.createElement('article'); card.className = 'gimmick-card'; card.dataset.gimmick = kind;
      const image = document.createElement('canvas'); image.width = 160; image.height = 128; image.setAttribute('role', 'img'); image.setAttribute('aria-label', ja ? jp : en); image.style.imageRendering = style === 'pixel' ? 'pixelated' : 'auto';
      const ctx = image.getContext('2d'); ctx.fillStyle = palette.canvas; ctx.fillRect(0, 0, 160, 128); drawArtwork(ctx, kind, 80, 64, 56, { style, palette });
      const title = document.createElement('h3'); title.textContent = ja ? jp : en;
      const description = document.createElement('p'); description.textContent = GIMMICK_FUNCTIONS[kind][ja ? 1 : 0];
      card.append(image, title, description); return card;
    }));
  }
  function select(guide) {
    $('tutorialBasics').setAttribute('aria-pressed', String(!guide)); $('tutorialGimmicks').setAttribute('aria-pressed', String(guide));
    $('gimmickGuide').hidden = !guide; $('tutorialCanvas').hidden = guide;
    document.querySelector('.tutorial-guide').hidden = guide; $('btnTutorialDone').style.display = guide ? 'none' : '';
    if (guide) { pauseDemo(); render(); $('gimmickGuide').scrollTop = 0; }
    else resumeDemo();
  }
  $('tutorialBasics').addEventListener('click', () => select(false));
  $('tutorialGimmicks').addEventListener('click', () => select(true));
  $('gimmickBack').addEventListener('click', () => { select(false); $('tutorialBasics').focus(); });
}
