// --- Stage Configurations & Metadata ---
export const TOTAL_STAGES = 50;
export const SUBSTAGES_PER_STAGE = 5;

// Completely streamlined progression without mechanical back-and-forth jumps
export const STAGE_ORDER = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50
];

export const STAGE_CONFIGS = {
  1: {
    name: "FIRST SWING",
    desc: "Pull back, aim your shot, and smash all red targets before the clock runs out!",
    tip: "💡 Tip: Drag the tip bob backward or tune the Angle slider, then hit PLAY to launch.",
    element: "Target Practice",
    ja: {
      name: "初撃必中",
      desc: "ひっぱって狙いを定めて、時間内に赤い的をぜんぶ壊そう！",
      tip: "💡 コツ: 先の玉を後ろに引っぱるか、角度を合わせてスタートを押そう。",
      element: "的当練習"
    }
  },
  2: {
    name: "FREE FALL",
    desc: "Speed boost and Pulse shockwaves are locked offline! Rely purely on release height to build momentum.",
    tip: "💡 Tip: The bob never swings higher than your drop height. Pull back far for big swings!",
    element: "Height & Drop",
    lockedParams: { pulses: 0 },
    ja: {
      name: "自由落下",
      desc: "初速も衝撃波も使えない！ どれだけ高い場所から落とせるかが勝負。",
      tip: "💡 コツ: 手をはなした高さより上には届きません。一番上まで引いて落とそう。",
      element: "落差利用"
    }
  },
  3: {
    name: "BOMB CARNIVAL",
    desc: "Hit the glowing Orange Bombs to trigger massive chain explosions and clear crowded target clusters!",
    tip: "💡 Tip: Detonating the bomb first is the secret to a quick high score.",
    element: "Chain Explosion",
    ja: {
      name: "爆破連鎖",
      desc: "オレンジ色の爆弾を狙おう！ 爆風が広がってまわりの的を一気に吹き飛ばせます。",
      tip: "💡 コツ: 爆弾を真っ先に爆発させると、近くの的もまとめて倒せて簡単です。",
      element: "連鎖爆破"
    }
  },
  4: {
    name: "BANK SHOT",
    desc: "Blue bumpers block your path! Bank off walls and ricochet into blind corners.",
    tip: "💡 Tip: Glancing hits off the side bounce much faster than hitting barriers straight on.",
    element: "Wall Ricochet",
    ja: {
      name: "壁面反射",
      desc: "青いカベが邪魔をしているぞ！ カベの跳ね返りを使って奥の的を狙おう。",
      tip: "💡 コツ: 正面からぶつかるより、斜めにかすめるように当てるとスピードが落ちません。",
      element: "跳弾反射"
    }
  },
  5: {
    name: "BEAT THE PATROL",
    desc: "Moving barrier guards patrol the arena! Learn their rhythm and slip through the opening.",
    tip: "💡 Tip: Wait for the guard block to start retreating before you launch.",
    element: "Moving Patrol",
    ja: {
      name: "巡回防壁",
      desc: "動くカベが左右を行ったり来たり！ 動きのリズムを見て、あいた隙間を通そう。",
      tip: "💡 コツ: あわてずに、カベが端まで行って戻り始めたときに発射しよう。",
      element: "動体回避"
    }
  },
  6: {
    name: "BLACK HOLE",
    desc: "A spinning singularity pulls your bob toward the core! Slingshot around its pull radius without getting swallowed.",
    tip: "💡 Tip: You have 5 pulses! Orbit around the gravity well, and pulse outward if pulled too close to the core.",
    element: "Vortex Pull",
    lockedParams: { pulses: 5 },
    ja: {
      name: "暗黒渦孔",
      desc: "ぐるぐる吸い寄せる真っ暗な渦！ 真ん中に飲み込まれないよう、外側をうまく回ろう。",
      tip: "💡 コツ: 衝撃波は５回使えます！ 吸い込まれそうになったら外へ向けて衝撃波で逃げよう。",
      element: "引力渦巻"
    }
  },
  7: {
    name: "FULL THROTTLE",
    desc: "Angle is locked flat at 90° with no Pulse assists. Crank your launch spin speed just right to loop the targets!",
    tip: "💡 Tip: Too slow and you stall out; too fast and you overshoot the entire arc.",
    element: "Launch Speed",
    lockedParams: { pulses: 0 },
    ja: {
      name: "初速極意",
      desc: "発射角度は真横で固定！ スピードの数字をうまく合わせて的を回ろう。",
      tip: "💡 コツ: 遅いと途中で止まり、速すぎると飛び越えます。ちょうどいい速さを探そう。",
      element: "速度加減"
    }
  },
  8: {
    name: "ROLLER TRACK",
    desc: "Your anchor cart slides on an overhead rail! The cart's sliding momentum adds huge whip speed to your swings.",
    tip: "💡 Tip: Release when the cart is sliding in the same direction as your targets.",
    element: "Sliding Anchor",
    ja: {
      name: "滑走台車",
      desc: "頭の上の台車が左右に走るぞ！ 台車のスピードがそのまま振り子の勢いになります。",
      tip: "💡 コツ: 台車が的の方向へ走っている瞬間に手をはなすと、一番勢いが乗ります。",
      element: "水平移動"
    }
  },
  9: {
    name: "TWIN LAUNCH",
    desc: "Two clone pendulums drop side-by-side with 0 pulses! Clip an early obstacle to split them across left and right lanes.",
    tip: "💡 Tip: Clip the center divider to branch both pendulums outward in opposite directions.",
    element: "Twin Clones",
    lockedParams: { pulses: 0 },
    ja: {
      name: "双球分岐",
      desc: "２つの玉が同時に落ちる！ 真ん中のブロックにかすらせて、左右にパカッと分けよう。",
      tip: "💡 コツ: 真ん中の出っ張りに少しだけ当てると、きれいに左右二手に分かれます。",
      element: "二連射出"
    }
  },
  10: {
    name: "ABYSS RUNNER",
    desc: "An overhead track slides directly above a hungry black hole! Time your launch so you don't get sucked down.",
    tip: "💡 Tip: Release when the carriage slides away from the black hole to maintain escape speed.",
    element: "Cart & Vortex",
    lockedParams: { pulses: 5 },
    ja: {
      name: "深淵滑走",
      desc: "吸い寄せる暗黒の渦の真上を台車が走る！ 落ちないようにタイミングをはかって放とう。",
      tip: "💡 コツ: 台車が渦から離れる向きに走っているときに放すと、吸い込まれにくいです。",
      element: "台車引力"
    }
  },
  11: {
    name: "GALE VALLEY",
    desc: "A constant side wind sweeps the arena! Headwinds stall your swing, while tailwinds give you super speed.",
    tip: "💡 Tip: Check the wind streaks and aim slightly upstream to cancel the drift.",
    element: "Crosswind",
    ja: {
      name: "強風峡谷",
      desc: "ずっと強い横風が吹いているぞ！ 向かい風だと戻され、追い風だと一気に加速します。",
      tip: "💡 コツ: 風で流される分を考えて、少し風上をねらって撃ち出そう。",
      element: "風向影響"
    }
  },
  12: {
    name: "WIND SURFER",
    desc: "The wind shifts back and forth on a steady beat! Ride the tailwind wave straight into the target zone.",
    tip: "💡 Tip: Hit PLAY just as the wind arrows switch towards your target side.",
    element: "Shifting Gusts",
    ja: {
      name: "変幻風波",
      desc: "風向きが左右にコロコロ変わる！ 的のほうへ追い風が吹く瞬間を見逃すな！",
      tip: "💡 コツ: 画面の風の矢印が、的の方向を向く『すぐ前』にスタートしよう。",
      element: "周期突風"
    }
  },
  13: {
    name: "MOON BOUNCE",
    desc: "Low-gravity mode engaged! Swings feel floaty and effortlessly soar into massive overhead orbits.",
    tip: "💡 Tip: Hangtime is much longer, letting you coast cleanly over tall ground blocks.",
    element: "Low-G",
    ja: {
      name: "月面浮遊",
      desc: "重力がすごく弱くなった！ ふわっと高く浮き上がって、頭の上の的も簡単に狙えます。",
      tip: "💡 コツ: ゆっくり落ちて長く浮くので、大きな山なりの軌道を描いて越えよう。",
      element: "微小重力"
    }
  },
  14: {
    name: "METEOR DIVE",
    desc: "Crushing super-gravity pulls you straight down! Swings snap toward the bottom at terrifying speeds.",
    tip: "💡 Tip: Low drops stall instantly. Start your launch from maximum height to build escape speed.",
    element: "Heavy Gravity",
    ja: {
      name: "超重急降",
      desc: "ものすごい力で下に引っぱられる！ 下に叩きつけられる猛スピードをコントロールしよう。",
      tip: "💡 コツ: 低いところから落とすと届きません。一番高いところから勢いをつけて落とそう。",
      element: "超高重力"
    }
  },
  15: {
    name: "TRIPLE WHIP",
    desc: "A 3-joint pendulum arm unlocked! With three chain links, the tip snaps with wild sensitivity and blazing whip speed.",
    tip: "💡 Tip: Micro-adjust launch angle by 0.5° at a time—small tweaks create completely different whip paths.",
    element: "3-Joint Whip",
    lockedParams: { pulses: 0 },
    ja: {
      name: "三重連鎖",
      desc: "３つつながった長い振り子！ ムチのようにしなって、先の玉が思いがけない動きをするぞ。",
      tip: "💡 コツ: 角度をほんの少し（0.5度）変えるだけで飛び方がガラッと変わります。",
      element: "三段連鎖"
    }
  },
  16: {
    name: "TWIN VORTEX",
    desc: "Two spinning black holes flank the arena floor! Thread the narrow zero-pull corridor right down the middle.",
    tip: "💡 Tip: You get 5 pulses! Slingshot straight down the center line where both pulls cancel each other out.",
    element: "Double Vortex",
    lockedParams: { pulses: 5 },
    ja: {
      name: "双対暗渦",
      desc: "左右にならぶ２つの暗黒の渦！ ちょうど真ん中の安全なすき間をまっすぐ通り抜けよう。",
      tip: "💡 コツ: 両方の吸い寄せる力が打ち消し合う『ど真ん中』をねらうと安定します。",
      element: "連星引力"
    }
  },
  17: {
    name: "FORCE FIELD",
    desc: "A glowing force dome repels your pendulum! Dive right toward its aura to slingshot away at high speed.",
    tip: "💡 Tip: Skim the edge of the blue aura to whip around tight corners into hidden pockets.",
    element: "Repulsor Dome",
    ja: {
      name: "反発力場",
      desc: "近づくと弾き飛ばす青いドーム！ ドームの力を使って、角をくるっと曲がって加速しよう。",
      tip: "💡 コツ: ドームの端っこをかすめるように通ると、外側へ猛スピードで跳ね飛ばされます。",
      element: "斥力結界"
    }
  },
  18: {
    name: "STORM RUNNER",
    desc: "Your sliding track carriage moves inside a powerful gale! Combine cart speed with wind push to curve around barriers.",
    tip: "💡 Tip: Release when the carriage moves in sync with the wind for explosive whip speed.",
    element: "Cart & Wind",
    ja: {
      name: "暴風滑走",
      desc: "強い風の中を台車が走る！ 台車のスピードと追い風をあわせて、すごい勢いで振り回そう。",
      tip: "💡 コツ: 台車の進む向きと風の向きがぴったり重なったときに手をはなそう！",
      element: "台車追風"
    }
  },
  19: {
    name: "TWIN STORM",
    desc: "Twin clones drop into shifting winds and moving barriers with zero pulses! Use the breeze to steer both clones.",
    tip: "💡 Tip: Let the tailwind push one twin outward while banking the other off the center post.",
    element: "Wind & Clones",
    lockedParams: { pulses: 0 },
    ja: {
      name: "風雨双球",
      desc: "変わる風と動くブロックの中へ２つの玉を放つ！ 風をうまく使って両側を倒そう。",
      tip: "💡 コツ: 片方は風に乗せて奥へ流し、もう片方はカベに当てて手前を壊そう。",
      element: "風力双球"
    }
  },
  20: {
    name: "THE GAUNTLET",
    desc: "A true mastery test: 3-Link chain, sliding cart, twin black holes, center push shield, and shifting wind!",
    tip: "💡 Tip: You get 5 pulses! Use the center blue push shield to bounce away from the black holes while riding the wind.",
    element: "World 1 Climax",
    lockedParams: { pulses: 5 },
    ja: {
      name: "前半関門",
      desc: "前半ステージの総まとめ！ ３連振り子、走る台車、２つの渦、弾くドーム、強い風が全部来る！",
      tip: "💡 コツ: 衝撃波は５回。真ん中の青いドームで渦をよけながら、風に乗って突き進もう！",
      element: "複合試練"
    }
  },
  21: {
    name: "WARP GATES",
    desc: "Cosmic wormholes connect the arena! Enter the blue IN gate to pop out of the purple OUT gate at full speed.",
    tip: "💡 Tip: Dive straight into the IN gate to skip solid barrier walls entirely.",
    element: "Warp Portals",
    ja: {
      name: "空間転移",
      desc: "つながっている抜け道！ 青い穴に入ると、同じスピードのまま紫の穴から飛び出します。",
      tip: "💡 コツ: 厚いカベがあっても関係なし。青い穴に入れば、的の目の前まですぐワープできます。",
      element: "転移門扉"
    }
  },
  22: {
    name: "ARMORED TARGETS",
    desc: "Red targets are protected by crystal shields! Land repeat hits (HP: 2-3) or trigger an Orange Bomb to crack them.",
    tip: "💡 Tip: Keep steady looping swings going for back-to-back hits, or blow them up with a bomb.",
    element: "Shielded Core",
    ja: {
      name: "重装甲的",
      desc: "硬いシールドをまとった的が登場！ 何回もぶつける（２〜３回）か、爆弾でまとめて壊そう。",
      tip: "💡 コツ: ぐるぐる何回も当て続けるか、近くの爆弾を使って一発で割ってしまおう。",
      element: "多層装甲"
    }
  },
  23: {
    name: "SLIME SLOUGH",
    desc: "Green slime zones act like quicksand! Your swing quickly loses speed while trudging through the goop.",
    tip: "💡 Tip: Plunge in with maximum entry speed to slice out the other side without getting stuck.",
    element: "Sticky Slime",
    ja: {
      name: "粘液沼地",
      desc: "緑のネバネバ地帯に入ると、スピードがみるみる吸い取られて止まってしまうぞ。",
      tip: "💡 コツ: 引っかからないように、手前から高い勢いをつけて一気に通り抜けよう。",
      element: "粘性減速"
    }
  },
  24: {
    name: "SUPER BOUNCER",
    desc: "Gold bumpers pack explosive bounce power! Slam into them to slingshot straight into ceiling targets.",
    tip: "💡 Tip: Graze gold pads at an angle for a super-speed loop across the ceiling.",
    element: "Spring Bumper",
    ja: {
      name: "黄金跳板",
      desc: "金色の板に当たるとものすごく弾む！ 天井の的まで思いっきり跳ね上がろう。",
      tip: "💡 コツ: 正面から当たるより、斜めからかすめるように当てると勢いよく天井を回れます。",
      element: "超高反発"
    }
  },
  25: {
    name: "SKY LIFT",
    desc: "Your anchor carriage rides an elevator up and down! Rapid upward lifts whip the pendulum skyward.",
    tip: "💡 Tip: Launch right as the lift begins ascending to vault cleanly over tall barriers.",
    element: "Elevator Lift",
    ja: {
      name: "昇降支点",
      desc: "振り子の根元が上下に動くぞ！ 上にグンと持ち上がるときの力で、高く飛び上がろう。",
      tip: "💡 コツ: 台が下から上へ動き始めた瞬間に手をはなすと、高いカベも簡単に越えられます。",
      element: "垂直昇降"
    }
  },
  26: {
    name: "QUAD CHAOS",
    desc: "Four linked chain arms with zero pulses! The fourth joint whips with blistering speed through narrow gaps.",
    tip: "💡 Tip: The 4-joint chain whips violently at its tip; micro-adjust by 0.5° to sweep different sectors.",
    element: "4-Joint Chain",
    lockedParams: { pulses: 0 },
    ja: {
      name: "四重連鎖",
      desc: "４つつながった超長い振り子！ 先が激しくうねって、せまい隙間を鋭く切り裂きます。",
      tip: "💡 コツ: 先のしなりがとても激しいです。角度を少しずつ変えて狙い通りの道を探そう。",
      element: "四段連鎖"
    }
  },
  27: {
    name: "DASH RINGS",
    desc: "Green speed rings launch your pendulum forward! Line up your arc to blast through wide loops.",
    tip: "💡 Tip: Pass straight through the arrow center for maximum nitro boost.",
    element: "Speed Booster",
    lockedParams: { pulses: 3 },
    ja: {
      name: "加速環門",
      desc: "緑の輪っかをくぐると一気にスピードアップ！ 矢印の向きへロケットのように加速します。",
      tip: "💡 コツ: 輪っかの向きと玉の飛ぶ向きをまっすぐ合わせると、一番速く加速します。",
      element: "環門加速"
    }
  },
  28: {
    name: "SECURITY KEY",
    desc: "Security gates seal the target vault! Hit the green pressure switch to drop the barrier before time runs out.",
    tip: "💡 Tip: Strike the switch first, then whip through the opened doorway before it slams shut.",
    element: "Switch & Door",
    lockedParams: { pulses: 3 },
    ja: {
      name: "時限関門",
      desc: "とびらが閉まっているぞ！ 緑のスイッチを押してあけて、閉まる前に飛び込もう！",
      tip: "💡 コツ: まず緑のスイッチを踏み、とびらが閉まるまでの数秒間に振り子を滑り込ませよう。",
      element: "連動開閉"
    }
  },
  29: {
    name: "LASER TRIPWIRE",
    desc: "High-voltage laser tripwires crisscross the room! Grazing a beam burns a shield heart. Thread safe gaps cleanly.",
    tip: "💡 Tip: Watch your heart gauge! Use your Pulse shockwaves to dodge dangerous beams.",
    element: "Laser Hazard",
    lockedParams: { pulses: 4 },
    ja: {
      name: "迎撃光線",
      desc: "赤い光線にさわるとライフが減ってしまう！ あいている隙間をそうっと通ろう。",
      tip: "💡 コツ: ライフがなくなると失敗です。衝撃波ボタンを使って危ない光線をよけよう。",
      element: "光線障害"
    }
  },
  30: {
    name: "CYBER HORIZON",
    desc: "High-tech fortress test: 3-Link chain, 2D orbital track, laser tripwires, boost rings, and armored fortress targets!",
    tip: "💡 Tip: You receive 5 pulses! Slingshot through the boost ring to rocket past the lasers and crack the armored citadel.",
    element: "Fortress Raid",
    lockedParams: { pulses: 5 },
    ja: {
      name: "要塞突破",
      desc: "ハイテク要塞の大勝負！ ３連振り子、回る支点、光線、加速の輪っか、硬い装甲の的を突破しよう。",
      tip: "💡 コツ: 加速の輪っかで光線を一気に飛び越え、真ん中の硬い的を連打で壊そう！",
      element: "要塞攻略"
    }
  },
  31: {
    name: "GRAVITY METRONOME",
    desc: "Gravity flips upside-down on a rhythmic metronome beat! Time your high and low arcs to match the flipping gravity.",
    tip: "💡 Tip: Listen for the metronome chime and use inverted flight to strike ceiling and floor targets.",
    element: "Gravity Flip",
    lockedParams: { pulses: 4 },
    ja: {
      name: "周期反転",
      desc: "カチッカチッと決まったリズムで重力が上下反転！ 天井と床が入れ替わる瞬間を使いこなそう。",
      tip: "💡 コツ: 合図の音をよく聞こう。天井へ落ちる時と、床へ落ちる時をねらって撃ち分けよう。",
      element: "天地交代"
    }
  },
  32: {
    name: "WARP ESCAPE",
    desc: "Two black holes guard the floor, but a central speed ring offers supersonic escape! Rocket through the vortex.",
    tip: "💡 Tip: Dive straight through the green ring to build escape speed and slingshot out of the vortex pull.",
    element: "Booster Escape",
    lockedParams: { pulses: 4 },
    ja: {
      name: "渦中突破",
      desc: "２つの渦の真ん中にある加速の輪っか！ 猛烈なダッシュで吸い寄せる力を振り切ろう。",
      tip: "💡 コツ: 真ん中の輪っかにしっかり玉を通せば、渦の力に負けずに飛び出せます。",
      element: "加速脱出"
    }
  },
  33: {
    name: "THE VAULT HEIST",
    desc: "The ultimate heist: hit switches to drop doors, weave through laser beams, and crack the armored targets inside!",
    tip: "💡 Tip: Bank off the wall into the switch, then slingshot straight through the laser gap into the vault.",
    element: "Heist Mission",
    lockedParams: { pulses: 4 },
    ja: {
      name: "要塞潜入",
      desc: "スイッチを押してとびらをあけ、光線をよけて、奥の硬い的をこわそう！",
      tip: "💡 コツ: カベ当てでスイッチを押し、あいた瞬間をねらって隙間へ飛び込もう。",
      element: "複合潜入"
    }
  },
  34: {
    name: "FIVE-LINK FRENZY",
    desc: "The ultimate 5-link pendulum chain is unleashed! Extreme degrees of freedom produce wildly energetic whip snaps.",
    tip: "💡 Tip: Micro-adjust starting launch angle by 0.2° to control the tip's whip snap trajectory.",
    element: "5-Joint Whip",
    lockedParams: { pulses: 0 },
    ja: {
      name: "五重狂乱",
      desc: "最も長くて最も難しい５連振り子！ 予測がつかないムチの動きを手なずけよう。",
      tip: "💡 コツ: ほんの少し角度を変えるだけで結果が激変します。的へ吸い込まれる角度を探そう。",
      element: "五段連鎖"
    }
  },
  35: {
    name: "WARP METRONOME",
    desc: "The ultimate spatial trial: time your swings through flipping gravity while navigating warp portals, speed rings, and lasers!",
    tip: "💡 Tip: You receive 5 pulses! Master the rhythm of the gravity inversion metronome to dive cleanly into wormholes.",
    element: "Flip & Portals",
    lockedParams: { pulses: 5 },
    ja: {
      name: "反転跳躍",
      desc: "重力反転、ワープ穴、光線、加速の輪っかが合体！ 天地が入れ替わるリズムを味方にしよう。",
      tip: "💡 コツ: 重力が反転して天井へフワッと浮き上がった勢いを使って、そのまま穴へ入ろう！",
      element: "時空反転"
    }
  },
  36: {
    name: "BRAKE & BOOST",
    desc: "Sticky slime drains wild wobbles right before a booster ring. Steady your line in the goop, then hit the turbo!",
    tip: "💡 Tip: Let the slime tame your chaotic swings so you shoot cleanly into the speed ring.",
    element: "Brake & Nitro",
    lockedParams: { pulses: 4 },
    ja: {
      name: "制動加速",
      desc: "暴れる玉をネバネバで落ち着かせ、その先の輪っかで一気に飛び出そう！",
      tip: "💡 コツ: ネバネバでふらつきを止めてから、まっすぐ加速の輪っかへ滑り込ませよう。",
      element: "緩急複合"
    }
  },
  37: {
    name: "PUSH & PULL",
    desc: "A blue repulsor dome and a black hole sit side by side, bending your trajectory into wild S-curves!",
    tip: "💡 Tip: Graze the blue shield to fling yourself safely away from the black hole's lethal event horizon.",
    element: "Push & Pull",
    lockedParams: { pulses: 4 },
    ja: {
      name: "引力斥力",
      desc: "弾くドームと吸い寄せる渦が並んでいる！ 大きく曲がりくねるカーブを描いて的を突こう。",
      tip: "💡 コツ: 青いドームにわざと当てると、暗黒の渦から安全に外へ弾き出してくれます。",
      element: "吸引反発"
    }
  },
  38: {
    name: "PRISM BOUNCE",
    desc: "Angled reflector prisms ricochet your tip across the arena like light beams! Master the trick shots.",
    tip: "💡 Tip: Glancing hits off the prism face will send you flying across the arena diagonally.",
    element: "Reflector Prism",
    lockedParams: { pulses: 3 },
    ja: {
      name: "多面跳弾",
      desc: "ナナメの板に当たると、光のように鋭く跳ね返る！ 部屋の四隅の的を順番に狙おう。",
      tip: "💡 コツ: ナナメの面に当てれば、反対側の角まで一気にまっすぐ飛んでいきます。",
      element: "斜面反射"
    }
  },
  39: {
    name: "CAROUSEL",
    desc: "Your anchor cart revolves in a full 2D circular orbit overhead! Time your release to harness centrifugal whip energy.",
    tip: "💡 Tip: Launch when the anchor carriage reaches the top apex of its circular orbit for maximum drop power.",
    element: "Orbiting Anchor",
    lockedParams: { pulses: 4 },
    ja: {
      name: "円周公転",
      desc: "頭上の支点が円を描いてぐるぐる回る！ 振り回される力を使ってすごいスピードを出そう。",
      tip: "💡 コツ: 支点が円の一番てっぺんに来た瞬間に手をはなすと、一番勢いよく落ちます。",
      element: "公転支点"
    }
  },
  40: {
    name: "SOLAR STORM",
    desc: "Deadly laser tripwires with fierce crosswinds pushing you right into the beams! Fight the drift to stay safe.",
    tip: "💡 Tip: Launch slightly into the wind so the breeze drifts your pendulum safely between the laser gaps.",
    element: "Wind & Lasers",
    lockedParams: { pulses: 4 },
    ja: {
      name: "光線風塵",
      desc: "光線のわなの中を強い風が吹く！ 風に流されて光線にぶつからないように気をつけて。",
      tip: "💡 コツ: 風下に流されることを見越して、少し風上へ向けて撃ち出そう。",
      element: "風線複合"
    }
  },
  41: {
    name: "CEILING RUSH",
    desc: "A 4-joint hyper chain with zero pulses in upside-down gravity! The chaotic whip dynamic snaps violently toward floor targets.",
    tip: "💡 Tip: Release at shallow angles so the upper links carry kinetic whip momentum downward against the ceiling pull.",
    element: "Inverted 4-Link",
    lockedParams: { pulses: 0 },
    ja: {
      name: "天地逆転",
      desc: "天井へ引っぱられる逆重力の中で４連の振り子を操る！ 天井の力に負けず下へ振ろう。",
      tip: "💡 コツ: 上へ吸い上げられる前に、浅い角度から鋭く振り下ろして下の的を狙おう。",
      element: "逆力連鎖"
    }
  },
  42: {
    name: "WARP HYPERCUBE",
    desc: "Two dual-wormhole pairs crisscross the arena! Chain portal jumps across all four quadrants in a single run.",
    tip: "💡 Tip: Dive straight into the first portal to carry exit momentum across into the secondary portal loop.",
    element: "Portal Loop",
    lockedParams: { pulses: 4 },
    ja: {
      name: "四方跳躍",
      desc: "２組のワープ穴が交差する！ 穴から穴へと飛び移りながら、四隅の的をぐるっと回ろう。",
      tip: "💡 コツ: 最初の出口から出た勢いが、そのまま次の穴に入るような角度を見つけよう。",
      element: "多重転移"
    }
  },
  43: {
    name: "CYCLONE ELEVATOR",
    desc: "Vertical elevator carriage movement combined with alternating wind gusts creates extreme compound momentum!",
    tip: "💡 Tip: Wait for the elevator carriage to ascend before launching into down-wind targets.",
    element: "Lift & Gale",
    lockedParams: { pulses: 4 },
    ja: {
      name: "昇降突風",
      desc: "上下に動く台と吹き荒れる風！ 上昇する力と追い風をあわせて、部屋じゅうをなぎ倒そう。",
      tip: "💡 コツ: 台が一番上まで持ち上がった瞬間に放ち、追い風に乗せて遠くへ飛ばそう。",
      element: "昇降風力"
    }
  },
  44: {
    name: "SECURITY MAZE",
    desc: "Multiple timed blast doors bar the way! Hit switches in sequence to unlock path after path through the maze.",
    tip: "💡 Tip: Bank off the first switch directly toward the next gate before the timer resets.",
    element: "Switch Sequence",
    lockedParams: { pulses: 4 },
    ja: {
      name: "連動扉迷",
      desc: "いくつものとびらが道をふさぐ迷路！ スイッチを順番に押して、道をひらこう。",
      tip: "💡 コツ: 最初のスイッチを押した跳ね返りで、とびらが閉まる前に次の部屋へ入ろう。",
      element: "順序開閉"
    }
  },
  45: {
    name: "PINBALL MANIA",
    desc: "An explosive pinball table loaded with spring bumpers and turbo rings! Keep chaining speed from pad to pad.",
    tip: "💡 Tip: Line up your initial bounce so it rebounds directly through the first green ring.",
    element: "Pinball Arena",
    lockedParams: { pulses: 4 },
    ja: {
      name: "弾球盤面",
      desc: "跳ねる板と加速の輪っかがいっぱいの盤面！ 止まらずにポンポン跳ねまわろう！",
      tip: "💡 コツ: 最初の板で跳ねた先が、そのまま次の緑の輪っかに入る角度を見つけよう。",
      element: "連続跳躍"
    }
  },
  46: {
    name: "MIRROR SHADOWS",
    desc: "Twin clones drop together into tight hazard lanes with no pulse assists! Line up one launch angle to sweep both corridors.",
    tip: "💡 Tip: Balance your release angle so both twins hit their lane bumpers at identical times.",
    element: "Twin Precision",
    lockedParams: { pulses: 0 },
    ja: {
      name: "左右対称",
      desc: "お助けの衝撃波なしで２つの玉を落とす！ 左右の細い道を同時に片付けよう。",
      tip: "💡 コツ: 左右の板に２つの玉が同じタイミングで当たるよう、ど真ん中の角度を狙おう。",
      element: "双球精密"
    }
  },
  47: {
    name: "ZERO GRAVITY",
    desc: "Deep space weightlessness! Gravity is completely off. Momentum lasts forever; steer using wall bounces and pulses.",
    tip: "💡 Tip: Use small pulse shockwaves to alter your vector since gravity won't pull you back down.",
    element: "Zero-G Space",
    lockedParams: { pulses: 5 },
    ja: {
      name: "無重力界",
      desc: "重力がゼロの宇宙空間！ 玉が落ちてこないので、カベの跳ね返りと衝撃波で向きを変えよう。",
      tip: "💡 コツ: 勝手に落ちてこないため、衝撃波をブレーキや曲がるハンドルとして使おう。",
      element: "完全無重力"
    }
  },
  48: {
    name: "LASER PORTAL",
    desc: "Warp portals sit nestled directly behind laser nets! A fraction of a degree off trips the laser.",
    tip: "💡 Tip: Aim dead-center into the portal mouth to warp without grazing the surrounding beams.",
    element: "Portal Trap",
    lockedParams: { pulses: 4 },
    ja: {
      name: "光線門扉",
      desc: "光線のすぐ後ろにあるワープ穴！ ほんの少し角度がズレるだけで光線に当たってしまうぞ。",
      tip: "💡 コツ: 穴のど真ん中をねらってまっすぐ撃てば、まわりの光線に触れずに通り抜けられます。",
      element: "精密転移"
    }
  },
  49: {
    name: "5-LINK INVERSION",
    desc: "The ultimate chaotic multi-body trial: a wild 5-link chain with zero pulses under periodic gravity inversions!",
    tip: "💡 Tip: Tiny 0.1° launch angle tweaks produce radically different snap trajectories under flipping gravity.",
    element: "5-Link Flip",
    lockedParams: { pulses: 0 },
    ja: {
      name: "五連反転",
      desc: "お助けなしの５連振り子×上下入れ替わる重力！ 大暴れする玉の動きを見切ろう。",
      tip: "💡 コツ: ほんのわずかな角度調整がすべて。重力がひっくり返った瞬間の軌道を見つけよう。",
      element: "極限連鎖"
    }
  },
  50: {
    name: "COSMIC APEX",
    desc: "Every challenge converged: 3-Link chain, 2D orbital carriage, gravity flip metronome, portals, lasers, and armored fortress!",
    tip: "💡 Tip: Stay calm, predict the metronome cadence, and fire your 5 pulse jets when entering wormholes.",
    element: "Grand Finale",
    lockedParams: { pulses: 5 },
    ja: {
      name: "最終試練",
      desc: "すべての仕掛けが集まった最後の戦い！ 回る台、重力反転、ワープ、光線、硬い装甲を攻略しよう！",
      tip: "💡 コツ: 音をよく聞いて反転のタイミングを合わせ、穴に入るときに衝撃波を使おう！",
      element: "全仕掛集結"
    }
  }
};

export function indexToStageSub(idx) {
  if (idx === 'sandbox') return { stage: 'sandbox', sub: 0, label: 'FREE PLAY', displayStage: 'sandbox' };
  const num = typeof idx === 'string' ? parseInt(idx, 10) : idx;
  const displayStage = Math.floor((num - 1) / SUBSTAGES_PER_STAGE) + 1;
  const sub = ((num - 1) % SUBSTAGES_PER_STAGE) + 1;
  const actualStage = STAGE_ORDER[displayStage - 1] || displayStage;

  return { 
    stage: actualStage, 
    sub: sub, 
    displayStage: displayStage, 
    label: `STAGE ${displayStage}-${sub}` 
  };
}

export function stageSubToIndex(s, sub) {
  return (s - 1) * SUBSTAGES_PER_STAGE + sub;
}

export function stageSubToKey(stage, sub) {
  if (stage === 'sandbox') return 'sandbox';
  return `stage_${stage}_sub_${sub}`;
}