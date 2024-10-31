interface StoreState {
    isLock: boolean
    yongHuList: Map<number, LoginRecordParams | null>,
}