interface Parameter {
        name: string,
        description: string | null,
        value: string
}

interface Hardware {
        upc: string,
        cpuModel: string,
        operatingSystem: string,
        solderedMemory: boolean,
        memSlot: number,
        solderedDisk: boolean,
        diskType: string,
}