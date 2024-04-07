<template>
  <CommonPage show-footer>
    <n-tabs type="line" animated>
      <n-tab-pane name="hardware" tab="硬件">
        <n-form ref="form" :model="formModel">
          <n-form-item label="UPC" path="upc">
            <n-input v-model:value="formModel.upc"  placeholder="从库存页面进入会自动带上UPC"/>
          </n-form-item>

          <n-form-item label="CPU型号" path="cpuModel">
            <n-input v-model:value="formModel.cpuModel" />
          </n-form-item>
          <n-form-item label="系统" path="operatingSystem">
            <n-select v-model:value="formModel.operatingSystem" :options="osOptions">
            </n-select>
          </n-form-item>
          <n-form-item label="运存是否焊接" path="solderedMemory">
            <n-switch v-model:value="formModel.solderedMemory" />
          </n-form-item>
          <n-form-item label="内存槽数量" path="cost" v-if="!formModel.solderedMemory">
            <n-input-number v-model:value="formModel.memSlot" />
          </n-form-item>
          <n-form-item label="硬盘是否焊接" path="solderedDisk">
            <n-switch v-model:value="formModel.solderedDisk" />
          </n-form-item>
          <n-form-item label="硬盘类型" path="diskType" v-if="!formModel.solderedDisk">
            <n-select v-model:value="formModel.diskType" :options="diskTypeOptions">
            </n-select>
          </n-form-item>
          <n-button type="primary" @click="submitHardwareForm">Submit</n-button>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="cost" tab="成本">

        <n-form ref="formCost" :model="formCostModel">
          <n-form-item label="UPC" path="upc">
            <n-input v-model:value="formModel.upc" />
          </n-form-item>
          <n-form-item label="蓝海入库成本价" path="cost">
            <n-input v-model:value="formCostModel.cost" />
          </n-form-item>
          <n-button type="primary" @click="submitCostForm">Submit</n-button>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </CommonPage>
</template>

<script setup lang="ts">
import { request } from '@/utils';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const operatingSystems = ['win 10 home', 'win 10 pro', 'win 11 home', 'win 11 pro'];
const diskType = ['PCIe SSD', 'SATA2 SSD', 'HDD']

const osOptions = operatingSystems.map((x) => {
  return {
    label: x,
    value: x.replace(' ', "_"),
  }
})

const diskTypeOptions = diskType.map((x) => {
  return {
    label: x,
    value: x.replace(' ', "_"),
  }
})

const formModel = ref<Hardware>({
  upc: '',
  cpuModel: '',
  operatingSystem: 'win_10_home',
  solderedMemory: false,
  memSlot: 2,
  solderedDisk: false,
  diskType: 'PCIe_SSD',
});


const formCostModel = ref({
  upc: '',
  cost: '',
});


async function getHardwareByUpc(name:string) {
  try {
    const response = await request.get(`/hardwares/${name}/`);
    // @ts-ignore
    return response
  } catch (error) {
    console.error('Error fetching data', error);
  }
}

async function getInventoryExtraByUpc(name:string) {
  try {
    const response = await request.get(`/inventory_extras/${name}/`);
    // @ts-ignore
    return response
  } catch (error) {
    console.error('Error fetching data', error);
  }
}


onMounted(async () => {
  // Retrieve UPC from route query and pre-fill the form field
  if (router.currentRoute.value.query.upc) {
    formModel.value.upc = router.currentRoute.value.query.upc as string;
    formCostModel.value.upc = router.currentRoute.value.query.upc as string;
    let existingData = await getHardwareByUpc(formModel.value.upc)
    // @ts-ignore
    formModel.value = existingData
    let existingInventoryExtra = await getInventoryExtraByUpc(formModel.value.upc)
    // @ts-ignore
    formCostModel.value = existingInventoryExtra
  }
  
})
// const rules = ref({
//   upc: [{ required: true, message: 'Please enter UPC号', trigger: 'blur' }],
//   cost: [{ required: true, message: 'Please enter 蓝海入库成本价', trigger: 'blur' }],
//   cpuModel: [{ required: true, message: 'Please enter CPU型号', trigger: 'blur' }],
//   operatingSystem: [{ required: true, message: 'Please enter 系统', trigger: 'blur' }],
//   solderedMemory: [{ required: true, message: 'Please enter 运存是否焊接', trigger: 'blur' }],
// });

async function createHardware(value: Hardware) {
  let result = await request.post('/hardwares/', value)
  return result
}


async function createInventoryExtra(value: any) {
  let result = await request.post('/inventory_extras/', value)
  return result
}

const submitHardwareForm = async () => {
  // Handle form submission logic here
  console.log('Form submitted:', formModel.value);
  await createHardware(formModel.value)
};

const submitCostForm = async () => {
  // Handle form submission logic here
  await createInventoryExtra(formCostModel.value)
};



</script>
