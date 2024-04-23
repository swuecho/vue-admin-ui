<template>
  <CommonPage show-footer>
    <n-tabs type="line" animated>
      <n-tab-pane name="cost" tab="采购相关">

        <n-form :ref="formCostRef" :model="formCostModel" :rules="formCostRules">
          <n-form-item label="UPC" path="upc" :show-require-mark="true">
            <n-input v-model:value="formModel.upc" placeholder="从库存页面进入会自动带上UPC" />
          </n-form-item>

          <n-form-item label="购买Link" path="purchase_link" :show-require-mark="true">
            <n-input v-model:value="formCostModel.purchase_link" />
          </n-form-item>

          <n-form-item label="产品类型" path="product_type" :show-require-mark="true">
            <n-select v-model:value="formCostModel.product_type" :options="product_type_options">
            </n-select>
          </n-form-item>

          <n-form-item label="采购单号PO号" path="purchase_po" :show-require-mark="true">
            <n-input v-model:value="formCostModel.purchase_po" />
          </n-form-item>

          <n-form-item label="采购价格" path="purchase_price" :show-require-mark="true">
            <n-input v-model:value="formCostModel.purchase_price" />
          </n-form-item>
          <n-button type="primary" @click="submitCostForm">Submit</n-button>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="hardware" tab="硬件相关">
        <n-form :ref="formRef" :model="formModel" :rules="formRules">
          <n-form-item label="UPC" path="upc" :show-require-mark="true">
            <n-input v-model:value="formModel.upc" placeholder="从库存页面进入会自动带上UPC" />
          </n-form-item>

          <n-divider title-placement="left">
            中央处理器
          </n-divider>
          <n-form-item label="系统" path="osBrandOption" :show-require-mark="true">
            <n-select v-model:value="formModel.cpu_brand" :options="cpu_brandOptions">
            </n-select>
          </n-form-item>
          <n-form-item label="CPU系列" path="cpu_serial" :show-require-mark="true">
            <n-select v-model:value="formModel.cpu_serial" :options="cpu_serialOptions">
            </n-select>
          </n-form-item>
          <n-form-item label="CPU型号" path="cpu_model" :show-require-mark="true">
            <n-input v-model:value="formModel.cpu_model" />
          </n-form-item>

          <n-divider title-placement="left">
            操作系统
          </n-divider>
          <n-form-item label="类型" path="os" :show-require-mark="true">
            <n-select v-model:value="formModel.os" :options="osOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="代数" path="os_generation" :show-require-mark="true">
            <n-select v-model:value="formModel.os_generation" :options="os_generationOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="版本" path="os_version" :show-require-mark="true">
            <n-select v-model:value="formModel.os_version" :options="os_versionOptions">
            </n-select>
          </n-form-item>

          <n-divider title-placement="left">
            内存
          </n-divider>

          <n-form-item label="总内存大小" path="mem_total_size" :show-require-mark="true">
            <n-select v-model:value="formModel.mem_total_size" :options="mem_total_sizeOptions">
            </n-select>
          </n-form-item>


          <n-form-item label="内存槽格式: x-y (x为总个数, y为焊在主板上的个数)" path="mem_slot_type" :show-require-mark="true">
            <n-select v-model:value="formModel.mem_slot_type" :options="mem_slot_typeOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="物理内存大小 格式为 x-y  每一个字母代表一个物理内存的大小(x-y 为两个内存 x为 第一块的大小 y为第二块)" path="mem_size_by_slot"
            :show-require-mark="true">
            <n-select v-model:value="formModel.mem_size_by_slot" :options="mem_size_by_slotOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="内存类型" path="mem_type" :show-require-mark="true">
            <n-select v-model:value="formModel.mem_type" :options="mem_typeOptions">
            </n-select>
          </n-form-item>

          <n-divider title-placement="left">
            硬盘
          </n-divider>

          <n-form-item label="总硬盘大小(GB)" path="disk_total_size" :show-require-mark="true">
            <n-select v-model:value="formModel.disk_total_size" :options="disk_total_sizeOptions">
            </n-select>
          </n-form-item>

          <n-form-item label="接口类型 格式 x:num-y:num (x 和y 填写 Sata, PCIe, HDD, num是 物理硬盘大小)" path="disk_slot_type"
            :show-require-mark="true">
            <n-input v-model:value="formModel.disk_slot_type" />
          </n-form-item>

          <n-form-item label="屏幕(ALL-IN-ONE的话屏幕大小)" path="screen">
            <n-select v-model:value="formModel.screen" :options="screenOptions">
            </n-select>
          </n-form-item>
          <n-button type="primary" @click="submitHardwareForm">Submit</n-button>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </CommonPage>
</template>

<script setup lang="ts">
import { request, requestSimple } from '@/utils';
import { FormInst } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const formRef = ref<FormInst | null>(null)

const formModel = ref<Hardware>({
  upc: '',

  cpu_brand: 'Intel', // amd, intel
  cpu_serial: 'i7',
  cpu_model: '',

  os: 'Windows',
  os_version: 'Home',
  os_generation: '11',

  mem_total_size: '16',
  mem_slot_type: '2-0',
  mem_size_by_slot: '8-8',
  mem_type: 'DDR4',

  disk_total_size: '512',
  disk_slot_type: '',

  screen: ''
});

const formCostRef = ref<FormInst | null>(null)
const formCostModel = ref({
  upc: '',
  purchase_po: '',
  purchase_link: '',
  purchase_price: '',
  product_type: 'laptop',
});

function array2options(arr) {
  return arr.map((x) => {
    return {
      label: x,
      value: x,
    }
  })
}

const operatingSystems = ['Windows', 'Chrome'];
const product_type_options = ['laptop', 'desktop', 'all-in-one', 'tablet'].map((x) => {
  return {
    label: x,
    value: x,
  }
})

const cpu_brandOptions = array2options(['AMD', 'Intel'])

const cpu_serialOptions = ['i3', 'i5', 'i7', 'i9', 'celeron', 'pentinum',
  'N', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Athlon Gold', 'Athlon Silver'].map((x) => {
    return {
      label: x,
      value: x,
    }
  })


const os_generationOptions = ['10', '11'].map((x) => {
  return {
    label: x,
    value: x,
  }
})

const os_versionOptions = ['Home', 'Pro'].map((x) => {
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

const mem_total_sizeOptions = array2options(['4', '8', '12', '16', '20', '24', '32', '48', '64'])
const mem_slot_typeOptions = array2options(['2-0', '2-1', '1-0', '1-1'])
const mem_size_by_slotOptions = array2options([
  '4-0', '4-4', '8-0', '8-4', '8-8', '16-4', '16-8', '32-16', '32-32', '64-0'
])

const mem_typeOptions = array2options([
  'DDR3', 'DDR4', 'DDR5', 'EMC'
])

const disk_total_sizeOptions = array2options([
  '64', '128', '256', '512', '1024', '2048'
])

const screenOptions = array2options(['None', '21', '24', '27'])



const formRules = {
  upc: {
    required: true,
    message: '必须填写',
    trigger: 'blur'
  },
  cpu_brand: {
    required: true,
    message: '必须填写',
    trigger: 'blur'
  },
  cpu_serial: {
    required: true,
  },
  cpu_model: {
    required: true,
    message: '必须填写',
    trigger: 'blur'
  },
  disk_slot_type: {
    required: true,
    message: '必须填写',
    trigger: 'blur'
  },
}


const formCostRules = {
  upc: {
    required: true,
    message: '必须填写',
    trigger: 'blur'
  },
  purchase_po: {
    required: true,
    message: '必须填写',
    trigger: 'blur'
  },
  purchase_link: {
    required: true,
    message: '必须填写',
    trigger: 'blur'
  },
  purchase_price: {
    required: true,
    message: '必须填写',
    trigger: 'blur'
  },
}


async function getHardwareByUpc(name: string) {
  try {
    const response = await requestSimple.get(`/hardwares/${name}/`);
    // @ts-ignore
    return response.data
  } catch (error) {
    console.error('Error fetching data', error);
  }
}

async function getInventoryExtraByUpc(name: string) {
  try {
    const response = await requestSimple.get(`/inventory_extras/${name}/`);
    // @ts-ignore
    return response.data
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
    let existingInventoryExtra = await getInventoryExtraByUpc(formCostModel.value.upc)
    if (existingInventoryExtra) {
      // @ts-ignore
      formCostModel.value = existingInventoryExtra
    }
  }

})
// const rules = ref({
//   upc: [{ required: true, message: 'Please enter UPC号', trigger: 'blur' }],
//   cost: [{ required: true, message: 'Please enter 蓝海入库成本价', trigger: 'blur' }],
//   cpu_model: [{ required: true, message: 'Please enter CPU型号', trigger: 'blur' }],
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
  console.log(value)
  let result = await request.post('/inventory_extras/', value)
  return result
}

const submitHardwareForm = async (e: MouseEvent) => {
  // Handle form submission logic here
  await createHardware(formModel.value)
  await createAsinEntries(formModel.value)


};

const submitCostForm = async () => {
  // Handle form submission logic here
  await createInventoryExtra(formCostModel.value)
};



</script>
