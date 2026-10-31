export const CHAPTERS = [
  {
    "id": 1,
    "start": 1,
    "end": 8,
    "name": "Basics & Collisions",
    "ja": "基本と反射",
    "icon": "◎"
  },
  {
    "id": 2,
    "start": 9,
    "end": 16,
    "name": "Forces",
    "ja": "力と重力",
    "icon": "↝"
  },
  {
    "id": 3,
    "start": 17,
    "end": 22,
    "name": "Moving Anchors",
    "ja": "動く支点",
    "icon": "↔"
  },
  {
    "id": 4,
    "start": 23,
    "end": 33,
    "name": "Portals & Gates",
    "ja": "転移と関門",
    "icon": "◇"
  },
  {
    "id": 5,
    "start": 34,
    "end": 42,
    "name": "Advanced Dynamics",
    "ja": "多連振り子",
    "icon": "⛓"
  },
  {
    "id": 6,
    "start": 43,
    "end": 50,
    "name": "Mastery",
    "ja": "総合チャレンジ",
    "icon": "★"
  }
];
export const DIFFICULTIES = { introductory: ["Introductory", "入門"], standard: ["Standard", "標準"], advanced: ["Advanced", "上級"], mastery: ["Mastery", "総合"] };
export const chapterForStage = stage => CHAPTERS.find(chapter => stage >= chapter.start && stage <= chapter.end);
