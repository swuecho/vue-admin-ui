interface Parameter {
        name: string,
        description: string | null,
        value: string
}

interface Hardware {
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
        
        diskTotalSize: string,
        diskSlotType: string,


        //
        screen: string // 21,24,27
}