import createApp from './createApp';

export default async context => {
  try {
    const { app, router, store } = createApp();

    router.push(context.url);

    await router.isReady();

    const matchedComponents = router.currentRoute.value.matched
      .map(record => Object.values(record.components))
      .flat();

    if (!matchedComponents.length) {
      throw { code: 404 };
    }

    // console.log('matchedComponents', matchedComponents);
    return app;
  } catch (err) {
    throw err;
  }
};
