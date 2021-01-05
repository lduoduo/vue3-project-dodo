import { defineComponent, ref, reactive, onMounted, computed } from 'vue';

import './AnnualBill2020.scss';

import RollingNumber from './RollingNumber';

const ImageList = [
  'https://lduoduo.github.io/public/img/bg.png',
  'https://lduoduo.github.io/public/img/icon.png'
];

const loadImage = url => {
  const img = new Image();
  return new Promise((res, reg) => {
    img.onload = res;
    img.src = url;
  });
};

export default defineComponent({
  setup(props) {
    const state = reactive({
      imageLoad: false,
      progressDone: false
    });

    const loadPics = () => {
      const p = ImageList.map(d => loadImage(d));
      Promise.all(p).then(() => {
        state.imageLoad = true;
      });
    };

    const onProgressComplete = () => {
      state.progressDone = true;
    };

    onMounted(() => {
      loadPics();
    });

    const loadDone = computed(() => state.imageLoad && state.progressDone);

    console.log('loadDone', loadDone, loadDone.value);

    return () => (
      <div className="page-h5-annual-bill-2020">
        <div className="page-image">
          {loadDone.value &&
            ImageList.map(d => {
              return <img src={d} className="comp-pic" alt="指示" />;
            })}
        </div>
        <div className="comp-side-bar">
          <div>
            <RollingNumber n={99} t={300} onComplete={onProgressComplete} />
            <span>%</span>
          </div>
        </div>
      </div>
    );
  }
});
