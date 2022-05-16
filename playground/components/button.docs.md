```vue
<template>test</template>
```

### vue preview

```vue
<template>
  <div>
    <button>button test</button>
    <button type="primary">primary button</button>
  </div>
</template>
```

### vue script import preview

```vue
<template>
  <div>tests</div>
</template>
<script>
export default {};
</script>
```

### prism

code highlight

> demo need vue code wrapped

```typescript
import { App, defineComponent } from 'vue';
import { getBlockCls, getCompName } from '@/config';

const blockCls = getBlockCls('Main');

const Main = defineComponent({
  name: getCompName('Main'),
  setup(_, { slots }) {
    return () => <main class={blockCls}>{slots.default?.()}</main>;
  }
});

Main.install = (app: App): void => {
  app.component(Main.name, Main);
};

export default Main;
```

### Icon `Button`

description

> demo need vue code wrapped

```vue
<template>
  <div>num: {{ num }}</div>
  <div>
    <button type="primary" icon="el-icon-edit" @click="testclick">add</button>
    text: {{ text }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 0,
      text: 'test'
    };
  },
  methods: {
    testclick() {
      this.num++;
    }
  }
};
</script>
```

### Attributes

## table

| First Header | Second Header |
| ------------ | ------------- |
| Content Cell | Content Cell  |
| Content Cell | Content Cell  |
