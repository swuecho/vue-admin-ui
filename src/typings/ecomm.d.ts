interface Parameter {
        name: string,
        description: string | null,
        value: string
}

interface Hardware {
        product_type: string,
        upc: string,

        //
        os: string,
        osGeneration: string,
        osVersion: string,

        //
        cpuBrand: string,
        cpuSerial: string, // N5051
        cpuModel: string,

        // 
        memSlotType: string,
        memTotalSize: string,
        memType: string,
        memSizeBySlot: string,
        
        diskTotalSize: number,
        diskType: string,
        diskInterface: string,


        //
        screen: string // 21,24,27
}