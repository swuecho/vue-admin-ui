<template>
  <CommonPage show-footer>
    <n-data-table :columns="columns" :data="data" :cascade="false" allow-checking-not-loaded @load="onLoad" />
  </CommonPage>
</template>

<script lang="ts">
import { defineComponent, ref , h} from 'vue'
import { DataTableColumns, NButton } from 'naive-ui'

export default defineComponent({
  setup() {
    const columns: DataTableColumns = [
      { type: 'selection' },
      { key: 'upc', title: 'UPC' },
      { key: 'product', title: 'Product' },
      { key: 'total_qty', title: 'Qty' },
      { key: 'wh_id', title: 'WH ID' },
      {
      title: 'Action',
      key: 'actions',
      render (row) {
        return h(
          NButton,
          {
            size: 'small',
            onClick: () => console.log(row) 
          },
          { default: () => 'Edit' }
        )
      }
    }
    ]
    const dataRef = ref([
      {
        "upc": "USBPENRWCKB",
        "product": "USB PEN",
        "total_qty": 25,
        isLeaf: false
      },
      {
        "upc": "196786386312",
        "product": "HP 15-dy2703dx 15.6\" HD Touch-Screen Laptop - Intel Core i5 1135G7 8GB Memory - 512GB SSD - Natural Silver W11H S",
        "total_qty": 2,
        isLeaf: false

      },
      {
        "upc": "196378885971",
        "product": "(Custom:12G+W11H)Lenovo Laptop IdeaPad 3 14IML05 81WA00QMUS 14\"FHD Intel Core I5 10210U 8GB RAM 512GB SSD Intel UHD Graphics W11P Platinum Gray",
        "total_qty": 1,
        isLeaf: false

      },
      {
        "upc": "195133111720",
        "product": "\nU-Acer Laptop Aspire 5 A515-56-36UT 15.6\"FHD i3-1115G4 4GB RAM (on board) 128GB PCIe SSD Iris Xe Graphics WIN10S/WIN11S Silver",
        "total_qty": 2,
        isLeaf: false
      },
      {
        "upc": "884116442912",
        "product": "ALIENWARE 17 NOTEBOOK R2 LUNAR LIGHT 17.3\"FHD DISPLAY w/WEBCAM NVIDIA GeForce RTX 3070Ti 8G Graphics i9-12900H 16GB 1TB SSD WIN11 HOME",
        "total_qty": 2,
        isLeaf: false

      },
      {
        "upc": "21763065440",
        "product": "Dell Inspiron 15 Laptop i7-1255u 120HZ 16gb 1T FHD. carbon black non-Touch",
        "total_qty": 4,
        isLeaf: false

      },
      {
        "upc": "197192332467",
        "product": "(Custom:32G)HP Laptops 17-cp3035cl 17.3 HD LED TS AMD Ryzen 5 7530U  12GB SODIMM DDR4 RAM 1TB SSD WIN 11 ",
        "total_qty": 10,
        isLeaf: false

      },
    ])
    return {
      columns,
      data: dataRef,
      onLoad(row: Record<string, unknown>) {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            row.children = [{ key: row.upc + '-1', upc: row.upc + '-1' , product: row.product, wh_id: 123}]
            resolve()
          }, 100)
        })
      }
    }
  }
})
</script>