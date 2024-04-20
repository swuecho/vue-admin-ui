interface Parameter {
        name: string,
        description: string | null,
        value: string
}

interface Hardware {
        product_type: string,
        upc: string,
        operatingSystem: string,

        // 
        memSlotType: string,
        memTotalSize: number,
        memType: string,
        
        diskTotalSize: number,
        diskType: string,
        diskInterface: string,

        cpuBrand: string,
        cpuCategory: string,
        cpuSerial: string, // N5051
        //
        screen: string // 21,24,27
}