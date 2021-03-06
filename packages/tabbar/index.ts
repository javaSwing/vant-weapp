import { VantComponent } from '../common/component';
import { safeArea } from '../mixins/safe-area';

VantComponent({
  mixins: [safeArea()],

  relation: {
    name: 'tabbar-item',
    type: 'descendant',
    linked(target: Weapp.Component) {
      this.children.push(target);
      target.parent = this;
      target.updateFromParent();
    },
    unlinked(target: Weapp.Component) {
      this.children = this.children.filter(
        (item: Weapp.Component) => item !== target
      );
      this.updateChildren();
    }
  },

  props: {
    active: {
      type: [Number, String],
      observer: 'updateChildren'
    },
    activeColor: {
      type: String,
      observer: 'updateChildren'
    },
    inactiveColor: {
      type: String,
      observer: 'updateChildren'
    },
    fixed: {
      type: Boolean,
      value: true
    },
    border: {
      type: Boolean,
      value: true
    },
    zIndex: {
      type: Number,
      value: 1
    }
  },

  beforeCreate() {
    this.children = [];
  },

  methods: {
    updateChildren() {
      const { children } = this;
      if (!Array.isArray(children) || !children.length) {
        return Promise.resolve();
      }

      return Promise.all(
        children.map((child: Weapp.Component) => child.updateFromParent())
      );
    },

    onChange(child: Weapp.Component) {
      const index = this.children.indexOf(child);
      const active = child.data.name || index;

      if (active !== this.data.active) {
        this.$emit('change', active);
      }
    }
  }
});
