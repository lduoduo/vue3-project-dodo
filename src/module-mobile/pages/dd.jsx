import { defineComponent, ref, reactive, onMounted, computed } from 'vue';

export default defineComponent({
  setup(props) {
    const state = reactive({
      count: 0
    });

    const onClick = () => {
      state.count = state.count + 1;
    };

    return () => (
      <div>
        <p>{state.count}</p>
        <span onClick={onClick}>点击增加</span>
      </div>
    );
  }
});
