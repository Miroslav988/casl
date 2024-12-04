class Entity {
  constructor(attrs) {
    Object.assign(this, attrs);
  }
}

export class Text extends Entity {}
export class Links extends Entity {}
