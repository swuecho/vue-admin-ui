<template>
  <CommonPage show-footer>
    <n-data-table striped :columns="columns" :data="data" :loading="loading" :cascade="false" allow-checking-not-loaded
      @load="onLoad" />

    <n-drawer v-model:show="showDrawer" :default-width="1024" resizable>
      <n-drawer-content :title="upc" closable>
        <n-data-table striped :columns="summary_columns" :data="summary_data"></n-data-table>
      </n-drawer-content>
    </n-drawer>
  </CommonPage>
</template>

<script setup lang="ts">
import { ref, h, onMounted, Ref } from 'vue'
import { DataTableColumns, NBadge, NButton } from 'naive-ui'
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
            type: row.asin_count ? "success" : "error",
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
            class: "mx-2",
            type: row.asin_count ? "success" : "error",
            onClick: () => {
              // @ts-ignore
              router.push({ path: '/base/inventory-asin', query: { upc: row.upc } });
            }
          },
          () => h(NBadge,
            {
              value: row.asin_count
            },
            { default: () => 'ASIN' }
          )
        ),
        h(
          NButton,
          {
            size: 'small',
            type: "info",
            disabled: !row.asin_count,
            onClick: async () => {
              // @ts-ignore
              showDrawer.value = true
              upc.value = row.upc
              product.value = row.product
              let resp = await getInventorySummary(row.upc)
              //@ts-ignore
              summary_data.value = resp
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
          { default: () => 'TODO' }
        )
      }
    }
  }
]


const summary_columns: DataTableColumns = [
  {
    key: "asin",
    title: "ASIN",
  },
  {
    key: "operatingSystem",
    title: "Spec",
    render(row, index) {
      return `${row.memory}-${row.disk}-${row.operatingSystem}`
    }
  },

  {
    key: "price_latest",
    title: "Latest Price(max,min,mean)",
    render(row, index) {
      return `${row.price_latest}(${row.price_max},${row.price_min},${row.price_mean})`
    }
  },
  {
    key: "rank_latest",
    title: "Latest Rank(max,min,mean)",
    render(row, index) {
      return `${row.rank_latest}(${row.rank_max},${row.rank_min},${row.rank_mean})`
    }
  },
  {
    key: "comment",
    title: "备注",
  },
];


const data = ref([]);
const summary_data = ref([]);
const loading = ref(true)
const showDrawer = ref(false)
const upc = ref('')
const product = ref('')

onMounted(async () => {
  try {
    const response = await request.get('/inventory_group/');
    // @ts-ignore
    const inventory_data = response.results;
    let resp_count = await getUpcAsinStat()
    for (let inv of inventory_data) {
      inv.isLeaf = false
      inv.key = inv.upc
      inv.qty = inv.total_qty
      if (inv.upc in resp_count) {
        inv.asin_count = resp_count[inv.upc]
      } else {
        inv.asin_count = 0
      }
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

async function getInventorySummary(upc: string) {
  const response = await request.get('/inventory_summary/', { params: { upc } });
  console.log(response)
  return response
}

async function getUpcAsinStat() {
  const upc_response = await request.get('/upc_asin_count/');
  // @ts-ignore
  return upc_response.results
}
</script>