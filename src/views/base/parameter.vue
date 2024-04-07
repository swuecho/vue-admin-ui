<script setup lang="ts">
import { ref, h, onMounted } from 'vue'
import { DataTableColumns, NButton, NInput } from 'naive-ui'
import { request } from '@/utils';
import { NDataTable, NModal, useDialog } from 'naive-ui'
import { HoverButton } from '@/components/common'
import { AddParameterForm } from '@/components/common';


const dialog = useDialog()
const data = ref<Parameter[]>([])
const dialogVisible = ref(false)
const loading = ref(true)

const columns: DataTableColumns = [
  { title: 'Desc', key: 'description' },
  { title: 'Name', key: 'name' },
  { title: 'Value', key: 'value', render(row: Parameter, index: number) {
      return h(NInput, {
        value: row.value,
        width: 5,
        async onUpdateValue(v: string) {
          data.value[index].value = v
          console.log(data.value)
          await UpdateRow(data.value[index])
        },
      })
    },
},
  {
    title: "Action",
    key: 'actions',
    render(row: any) {
      return h(
        HoverButton,
        {
          tooltip: 'Delete',
          onClick: () => deleteRow(row),
        },
        {
          default: () => {
            return h('div', {
              class: 'i-fe:trash-2',
            })
          },
        },
      )
    },
  },
]

onMounted(async () => {
  refreshData()
});

async function refreshData() {
  try {
    const response = await request.get('/parameters/');
    // @ts-ignore
    const results = response.results;
    data.value = results;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching data', error);
  }
}

async function deleteParamer(value: string) {
  const response = await request.delete(`/parameters/${value}`);
  console.log(response)
}

async function updateParameter(name: string, params: any) {
  const response = await request.put(`/parameters/${name}/`, params);
  console.log(response)
}


async function addRow() {
  await refreshData()
  dialogVisible.value = false
}

async function UpdateRow(row: Parameter) {
  console.log(row)
  if (row.name)
    await updateParameter(row.name, {
      ...row, value: row.value || ''
    })
}

async function deleteRow(row: any) {
  dialog.warning({
    title: "delete",
    content: "delete content mesaage",
    positiveText: "yes",
    negativeText: "no",
    onPositiveClick: async () => {
      await deleteParamer(row.name)
      await refreshData()
    },
  })
}

</script>

<template>
  <CommonPage show-footer>
    <NModal v-model:show="dialogVisible" title="add" preset="dialog">
      <AddParameterForm @new-row-added="addRow" />
    </NModal>
    <div class="flex justify-end">
      <HoverButton @click="dialogVisible = true">
          <i class="i-fe:plus" />
      </HoverButton>
    </div>
    <NDataTable :columns="columns" :data="data" :loading="loading" />
  </CommonPage>
</template>
