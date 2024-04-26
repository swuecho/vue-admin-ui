<template>
  <CommonPage show-footer>
    <template #action>
      {{ router.currentRoute.value.query.upc }}
      <n-button type="primary" @click="addSpecModalVisible=true">
        <i class="i-material-symbols:add mr-4 text-18" />
        新增配置
      </n-button>
     
    </template>
    <NDataTable :columns="columns" :data="data" :loading="loading" />
    <NModal v-model:show="dialogVisible" title="error" preset="dialog">
      {{  errMessage }}
    </NModal>
    <NModal v-model:show="addSpecModalVisible" title="addSpecModalVisible=true" preset="dialog">
      <AddAsin @new-row-added="newRowAdded" />
      </NModal>
  </CommonPage>
</template>

<script setup lang="ts">
import { request } from '@/utils';
import { DataTableColumns, NButton, NInput } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import  AddAsin from './addAsinForm.vue'
const router = useRouter();

const errMessage = ref('缺少upc, 请从库存页面进入')
const data = ref<any[]>([])

const loading = ref(true)
const dialogVisible = ref(false)
const addSpecModalVisible = ref(false)

function format_disk(size: number) {
  if (size < 1024)  {
    return `${size/2}GB`
  } else {
    return `${size/1024}T`
  }
}

const columns: DataTableColumns = [
  { title: '内存', key: 'memory' },
  { title: '硬盘', key: 'disk', render(row, index) {
    return format_disk(row.disk)
  } },
  { title: '系统', key: 'operatingSystem' },
  //@ts-ignore
  {
    title: 'ASIN', key: 'asin', render(row: any, index: number) {
      return h(NInput, {
        value: row.asin,
        width: 50,
        async onUpdateValue(v: string) {
          data.value[index].asin = v
          await UpdateRow(data.value[index])
        },
      })
    },
  },
  { title: '备注', key: 'comment', render(row: any, index: number) {
      return h(NInput, {
        value: row.comment,
        width: 50,
        async onUpdateValue(v: string) {
          data.value[index].comment = v
          await UpdateRow(data.value[index])
        },
      })
    }, },
  {
    title: "操作",
    key: 'actions',
    width: 400,
    render(row: any) {
      return [h(
        NButton,
        {
          size: 'small',
          onClick: () => addRow(row),
        },
          { default: () => '+' }
      ),
      h(
        NButton,
        {
          size: 'small',
          onClick: () => deleteRow(row),
        },
        { default: () => '-' }
      )
      ]
    },
  },
]

async function addRow(row) {
  const response = await request.post(`/asins/`, {
    upc: row.upc, memory: row.memory, disk: row.disk,
    operatingSystem: row.operatingSystem
  });
  loading.value = true
  let asin = await getUpcAsins(row.upc)
  data.value = asin
  loading.value = false
}

async function deleteRow(row) {
  const response = await request.delete(`/asins/${row.id}`, );
  loading.value = true
  let asin = await getUpcAsins(row.upc)
  data.value = asin
  loading.value = false
}

async function updateAsin(name: string, params: any) {
  const response = await request.put(`/asins/${name}/`, params);
}

async function UpdateRow(row: any) {
  if (row.id)
    await updateAsin(row.id, {
      ...row,
    })
}

async function getUpcAsins(upc: string) {
  try {
    const response = await request.get('/asins/', { params: { upc: upc } });
    // @ts-ignore
    const inventory_data = response.results;
    return inventory_data
  } catch (error) {
    console.error('Error fetching data', error);
  }


}

async function refreshData() {
  // Retrieve UPC from route query and pre-fill the form field
  let upc = router.currentRoute.value.query.upc as string
  if (upc) {
    let asin = await getUpcAsins(upc)
    if (asin.length > 0) {
    data.value = asin
    loading.value = false
  } else {
    errMessage.value = "请检查硬件信息是否已经录入"
    dialogVisible.value = true
    loading.value = false 
  }
  } else {
    dialogVisible.value = true
    loading.value = false
  }

}

onMounted(async() => {
 await refreshData()
})

async function newRowAdded() {
  await refreshData()
  addSpecModalVisible.value = false
}

</script>./addAsinForm.vue
