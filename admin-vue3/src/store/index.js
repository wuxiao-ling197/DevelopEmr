import piniaPersist from 'pinia-plugin-persist'

const store = createPinia()
store.use(piniaPersist) // 使用持久化存储

export default store