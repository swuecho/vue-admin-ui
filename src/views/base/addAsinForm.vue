<script setup lang="ts">
import { request } from '@/utils';
import { ref } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();
interface HardwareSpec {
        memory: string
        disk: string
        operatingSystem: string
        asin: string
        comment: string
}

const emit = defineEmits<Emit>()

const form = ref<HardwareSpec>({
        memory: '',
        disk: '',
        operatingSystem: '',
        asin: '',
        comment: ''
})

interface Emit {
        (e: 'newRowAdded'): void
}

async function submitForm() {
        let result =  await addRow(form.value)
        if (result) {
                emit('newRowAdded')
        }
}

async function addRow(row) {
        console.log(row)
        let upc = router.currentRoute.value.query.upc
        console.log(upc)
        const response = await request.post(`/asins/`, {
                upc: upc, memory: row.memory, disk: row.disk,
                operatingSystem: row.operatingSystem, comment: row.comment,
                asin: row.asin
        });
        return response
}

</script>

<template>
        <div>
                <NForm :model="form">
                        <NFormItem path="memeory" label="memory">
                                <NInput v-model:value="form.memory" />
                        </NFormItem>
                        <NFormItem path="disk" label="hardware.disk(GB, 整数)">
                                <NInput v-model:value="form.disk" />
                        </NFormItem>
                        <NFormItem path="operatingSystem" label="operating_system">
                                <NInput v-model:value="form.operatingSystem" />
                        </NFormItem>
                        <NFormItem path="asin" label="asin">
                                <NInput v-model:value="form.asin" />
                        </NFormItem>
                        <NFormItem path="comment" label="comment">
                                <NInput v-model:value="form.comment" />
                        </NFormItem>
                </NForm>
                <NButton type="primary" block secondary strong @click="submitForm">
                        保存
                </NButton>
        </div>
</template>