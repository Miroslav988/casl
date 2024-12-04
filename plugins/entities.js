// import Vue from "vue";

// class Entity {
//   constructor(attrs) {
//     // Используем Vue.set для обеспечения реактивности
//     for (const key in attrs) {
//       Vue.set(this, key, attrs[key]);
//     }
//   }
// }

// export class Text extends Entity {
//   constructor(attrs) {
//     super(attrs);
//     this.texts = attrs.texts || []; // Инициализация массива texts
//   }
// }

// export class Links extends Entity {
//   constructor(attrs) {
//     super(attrs);
//     this.links = attrs.links || []; // Инициализация массива links
//   }
// }
export class Text {
  constructor({ id, text }) {
    this.id = id;
    this.text = text;
  }
}
export class Links {
  constructor({ id, url }) {
    this.id = id;
    this.url = url;
  }
}
