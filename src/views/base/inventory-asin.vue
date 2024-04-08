<template>
  <CommonPage show-footer>
    <template #action>
      {{ router.currentRoute.value.query.upc }}
    </template>
    <NDataTable :columns="columns" :data="data" :loading="loading" />
    <NModal v-model:show="dialogVisible" title="error" preset="dialog">
      {{  errMessage }}
    </NModal>
  </CommonPage>
</template>

<script setup lang="ts">
import { request } from '@/utils';
import { DataTableColumns, NButton, NInput } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const errMessage = ref('缺少upc, 请从库存页面进入')
const data = ref<any[]>([])

const loading = ref(true)
const dialogVisible = ref(false)

function format_disk(size: number) {
  if (size < 1024)  {
    return `${size/2}GB`
  } else {
    return `${size/1024}T`
  }
}

const columns: DataTableColumns = [
  { title: 'mem', key: 'memory' },
  { title: 'disk', key: 'disk', render(row, index) {
    return format_disk(row.disk)
  } },
  { title: 'operatingSystem', key: 'operatingSystem' },
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
    title: "Action",
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
    console.log(inventory_data)
    return inventory_data
  } catch (error) {
    console.error('Error fetching data', error);
  }


}

onMounted(async () => {
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

})




</script>
