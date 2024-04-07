<template>
  <CommonPage show-footer>
    <n-data-table striped :columns="columns" :data="data" :loading="loading" :cascade="false" allow-checking-not-loaded
      @load="onLoad" />

    <n-drawer v-model:show="showDrawer" :default-width="502" resizable >
    <n-drawer-content :title="upc" closable>
      <h4>{{  product }}</h4>
      <br/>
    </n-drawer-content>
    </n-drawer>
  </CommonPage>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from 'vue'
import { DataTableColumns, NButton } from 'naive-ui'
import { request } from '@/utils';
import { useRouter } from 'vue-router';
const router = useRouter();

const columns: DataTableColumns = [
  { key: 'upc', title: 'UPC', width: 200 },
  { key: 'product', title: 'Product', width: 500 },
  { key: 'qty', title: 'Qty', width: 50 },
  { key: 'wh_id', title: 'WH ID' },
  {
    title: 'Action',
    key: 'actions',
    render(row) {
      if (row.isLeaf == false) {
        return [h(
          NButton,
          {
            size: 'small',
            onClick: () => {
              // @ts-ignore
              router.push({ path: '/base/inventory-edit', query: { upc: row.upc } });
            }
          },
          { default: () => 'EDIT' }
        ),
        h(
          NButton,
          {
            size: 'small',
            onClick: () => {
              // @ts-ignore
              router.push({ path: '/base/inventory-asin', query: { upc: row.upc } });
            }
          },
          { default: () => 'ASIN' }
        ),
        h(
          NButton,
          {
            size: 'small',
            onClick: () => {
              // @ts-ignore
              showDrawer.value = true
              upc.value = row.upc
              product.value = row.product
              
            }
          },
          { default: () => 'SHOW' }
        )
      ]
      } else {
        return h(
          NButton,
          {
            size: 'small',
            onClick: () => {
              // @ts-ignore
              router.push({ path: '/base/inventory-edit', query: { upc: row.upc } });
            }
          },
          { default: () => 'more' }
        )
      }
    }
  }
]
const data = ref([]);
const loading = ref(true)
const showDrawer=ref(false)
const upc = ref('')
const product = ref('')

onMounted(async () => {
  try {
    const response = await request.get('/inventory_group/');
    // @ts-ignore
    const inventory_data = response.results;
    for (let inv of inventory_data) {
      inv.isLeaf = false
      inv.key = inv.upc
      inv.qty = inv.total_qty
    }

    data.value = inventory_data;
    loading.value = false
  } catch (error) {
    console.error('Error fetching data', error);
  }
});


async function onLoad(row: Record<string, unknown>) {

  try {
    const response = await request.get('/inventorys/', { params: { upc: row.upc } });
    // @ts-ignore
    const inventory_data = response.results;
    for (let inv of inventory_data) {
      inv.upc = inv.upc_full
      inv.key = inv.upc_full
    }
    row.children = inventory_data;
    return
  } catch (error) {
    console.error('Error fetching data', error);
  }


}
</script>