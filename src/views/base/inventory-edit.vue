<template>
  <CommonPage show-footer>
    <n-tabs type="line" animated>
      <n-tab-pane name="cost" tab="采购相关">

        <n-form ref="formCost" :model="formCostModel">
          <n-form-item label="UPC" path="upc">
            <n-input v-model:value="formModel.upc" placeholder="从库存页面进入会自动带上UPC" />
          </n-form-item>

          <n-form-item label="购买Link" path="purchaseLink">
            <n-input v-model:value="formCostModel.purchaseLink" />
          </n-form-item>

          <n-form-item label="产品类型" path="productType">
            <n-select v-model:value="formCostModel.productType" :options="productTypeOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="采购单号PO号" path="purchasePO">
            <n-input v-model:value="formCostModel.purchasePO" />
          </n-form-item>

          <n-form-item label="采购价格" path="cost">
            <n-input v-model:value="formCostModel.purchasePrice" />
          </n-form-item>
          <n-button type="primary" @click="submitCostForm">Submit</n-button>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="hardware" tab="硬件相关">
        <n-form ref="form" :model="formModel">
          <n-form-item label="UPC" path="upc">
            <n-input v-model:value="formModel.upc" placeholder="从库存页面进入会自动带上UPC" />
          </n-form-item>

          <n-divider title-placement="left">
            中央处理器
          </n-divider>
          <n-form-item label="系统" path="osBrandOption">
            <n-select v-model:value="formModel.cpuBrand" :options="cpuBrandOptions">
            </n-select>
          </n-form-item>
          <n-form-item label="CPU系列" path="cpuSerial">
            <n-select v-model:value="formModel.cpuSerial" :options="cpuSerialOptions">
            </n-select>
          </n-form-item>
          <n-form-item label="CPU型号" path="cpuModel">
            <n-input v-model:value="formModel.cpuModel" />
          </n-form-item>

          <n-divider title-placement="left">
            操作系统
          </n-divider>
          <n-form-item label="类型" path="operatingSystem">
            <n-select v-model:value="formModel.os" :options="osOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="代数" path="operatingSystem">
            <n-select v-model:value="formModel.osGeneration" :options="osGenerationOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="版本" path="osVersion">
            <n-select v-model:value="formModel.osVersion" :options="osVersionOptions">
            </n-select>
          </n-form-item>

          <n-divider title-placement="left">
            内存
          </n-divider>

          <n-form-item label="总内存大小" path="memTotalSize">
            <n-select v-model:value="formModel.memTotalSize" :options="memTotalSizeOptions">
            </n-select>
          </n-form-item>


          <n-form-item label="内存槽格式: x-y (x为总个数, y为焊在主板上的个数)" path="memSlotType">
            <n-select v-model:value="formModel.memSlotType" :options="memSlotTypeOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="物理内存大小 格式为 x-y  每一个字母代表一个物理内存的大小(x-y 为两个内存 x为 第一块的大小 y为第二块)" path="memSizeBySlot">
            <n-select v-model:value="formModel.memSizeBySlot" :options="memSizeBySlotOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="内存类型" path="memType">
            <n-select v-model:value="formModel.memType" :options="memTypeOptions">
            </n-select>
          </n-form-item>

          <n-divider title-placement="left">
            硬盘
          </n-divider>

          <n-form-item label="总硬盘大小(GB)" path="diskTotalSize">
            <n-select v-model:value="formModel.diskTotalSize" :options="diskTotalSizeOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="接口类型 格式 x:num-y:num x 和y 填写 Sata, PCIe, HDD, num是 物理硬盘大小" path="diskSlotType">
            <n-input v-model:value="formModel.diskSlotType" />
          </n-form-item>
          <n-button type="primary" @click="submitHardwareForm">Submit</n-button>
        </n-form>
      </n-tab-pane>

    </n-tabs>
  </CommonPage>
</template>

<script setup lang="ts">
import { request, requestSimple } from '@/utils';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

function array2options(arr) {
  return arr.map((x) => {
    return {
      label: x,
      value: x,
    }
  })
}


const operatingSystems = ['Windows', 'Chrome'];
const diskType = ['PCIe SSD', 'SATA2 SSD', 'HDD']
const productTypeOptions = ['laptop', 'desktop', 'all-in-one', 'tablet'].map((x) => {
  return {
    label: x,
    value: x,
  }
})

const cpuBrandOptions = array2options(['AMD', 'Intel'])

const cpuSerialOptions = ['i3', 'i5', 'i7', 'i9', 'celeron', 'pentinum',
  'N', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Athlon Gold', 'Athlon Silver'].map((x) => {
    return {
      label: x,
      value: x,
    }
  })


const osGenerationOptions = ['10', '11'].map((x) => {
  return {
    label: x,
    value: x,
  }
})

const osVersionOptions = ['Home', 'Pro'].map((x) => {
  return {
    label: x,
    value: x,
  }
})

const osOptions = operatingSystems.map((x) => {
  return {
    label: x,
    value: x.replace(' ', "_"),
  }
})

const memTotalSizeOptions = array2options(['4', '8', '12', '16', '20', '24', '32', '48', '64'])
const memSlotTypeOptions = array2options(['2-0', '2-1', '1-0', '1-1'])
const memSizeBySlotOptions = array2options([
  '4-0', '4-4', '8-0', '8-4', '8-8', '16-4', '16-8', '32-16', '32-32', '64-0'
])

const memTypeOptions = array2options([
  'DDR3', 'DDR4', 'DDR5', 'EMC'
])

const diskTotalSizeOptions = array2options([
  '64', '128', '256', '512', '1024', '2048'
])

const diskTypeOptions = diskType.map((x) => {
  return {
    label: x,
    value: x.replace(' ', "_"),
  }
})



const formModel = ref<Hardware>({
  upc: '',

  cpuBrand: 'Intel', // amd, intel
  cpuSerial: 'i7',
  cpuModel: '',

  os: 'Windows',
  osVersion: 'Home',
  osGeneration: '11',

  memTotalSize: '16',
  memSlotType: '2-0',
  memSizeBySlot: '8-8',
  memType: 'DDR4',
  solderedDisk: false,
  diskTotalSize: '512',
  diskType: 'PCIe_SSD',
});


const formCostModel = ref({
  upc: '',
  purchasePO: '',
  purchaseLink: '',
  purchasePrice: '',
  productType: 'laptop',
});


async function getHardwareByUpc(name: string) {
  try {
    const response = await requestSimple.get(`/hardwares/${name}/`);
    // @ts-ignore
    return response
  } catch (error) {
    console.error('Error fetching data', error);
  }
}

async function getInventoryExtraByUpc(name: string) {
  try {
    const response = await requestSimple.get(`/inventory_extras/${name}/`);
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
    if (existingData) {
      // @ts-ignore
      formModel.value = existingData
    }
    let existingInventoryExtra = await getInventoryExtraByUpc(formModel.value.upc)
    if (existingData) {
      // @ts-ignore
      formCostModel.value = existingInventoryExtra
    }
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

async function createAsinEntries(value: Hardware) {
  let result = await request.post('/standard_product_asin/', { upc: value.upc })
  return result
}

async function createInventoryExtra(value: any) {
  let result = await request.post('/inventory_extras/', value)
  return result
}

const submitHardwareForm = async () => {
  // Handle form submission logic here
  await createHardware(formModel.value)
  await createAsinEntries(formModel.value)
};

const submitCostForm = async () => {
  // Handle form submission logic here
  await createInventoryExtra(formCostModel.value)
};



</script>
