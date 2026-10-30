export function getMechanicHints(state, japanese = false) {
  const hints = [];
  const add = (condition, en, ja) => { if (condition) hints.push(japanese ? ja : en); };
  add(state.wind, 'Wind pushes the pendulum sideways. Adjust your starting angle to compensate.', '風は振り子を横に押します。開始角度を調整しましょう。');
  add(state.portals.length, 'Enter a portal to warp to its paired exit. Watch for hazards near the exit.', 'ポータルに入ると出口へ移動します。出口付近の障害物に注意しましょう。');
  add(state.lasers.length, 'Lasers cost a life on contact. Time your swing to avoid the beams.', 'レーザーに触れるとライフが減ります。タイミングを合わせて避けましょう。');
  add(state.rings.length, 'Boost rings add speed. Aim through a ring to extend your swing.', 'ブーストリングは速度を上げます。リングを通るように狙いましょう。');
  add(state.rail, 'The pivot moves along a rail. Its motion changes the path of your swing.', '支点がレールに沿って動き、振り子の軌道が変わります。');
  add(state.gravity < 0, 'Gravity pulls upward here. Plan your launch around the inverted pull.', 'ここでは重力が上向きです。逆向きの重力に合わせて狙いましょう。');
  add(state.inversion, 'Gravity changes direction periodically. Watch the timing before launching.', '重力の向きが定期的に変わります。タイミングを見て開始しましょう。');
  add(state.pulses === 0, 'Pulses are locked for this stage. Use your starting angle and timing.', 'このステージではパルスを使えません。開始角度とタイミングを工夫しましょう。');
  return hints;
}
