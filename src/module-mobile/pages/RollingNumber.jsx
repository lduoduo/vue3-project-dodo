import {
  defineComponent,
  ref,
  toRefs,
  onMounted,
  onUpdated,
  watchEffect
} from 'vue';

const getList = n => {
  const arr = [0];
  let t = Math.ceil(n / 10);
  while (t < n) {
    arr.push(t);
    t = Math.ceil(t * 1.1618);
  }
  arr.push(n);
  return arr;
};

export default defineComponent({
  props: {
    n: {
      type: Number,
      required: true,
      default: 0
    },
    nd: {
      type: Number,
      required: true,
      default: 0
    },
    t: {
      type: Number,
      default: 150
    },
    onComplete: {
      type: Function,
      default: _ => _
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { n: originN, t, onComplete } = props;
    const { nd, visible } = toRefs(props);

    const num = originN || nd.value;

    const list = getList(num);
    const index = ref(0);

    const step = () => {
      if (!visible.value) return;

      if (index.value >= list.length - 1) return onComplete && onComplete();

      index.value += 1;

      // window.requestAnimationFrame(step);
      setTimeout(step, t);
    };

    onMounted(() => {
      // window.requestAnimationFrame(step);
      setTimeout(step, t);
    });

    watchEffect(() => {
      if (!visible.value) return;

      index.value = 0;
      // window.requestAnimationFrame(step);
      setTimeout(step, t);
    });

    return () => {
      // console.log('render', index.value, list, list[index.value])
      return list[index.value];
    }
  }
});
