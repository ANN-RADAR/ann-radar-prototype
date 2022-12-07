<template>
  <div class="potential-mobility-wrapper">
    <potential-inspector-table :category="category" />
    <mobility-reachability-table />
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import MobilityReachabilityTable from './mobility-reachability-table.vue';

import PotentialInspectorTable from './potential-inspector-table.vue';

export default Vue.extend({
  components: {
    PotentialInspectorTable,
    MobilityReachabilityTable
  },
  props: {
    category: {
      type: String as PropType<'solar' | 'energyEfficiency' | 'mobility'>,
      required: true
    }
  }
});
</script>

<style scoped>
.potential-mobility-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
