<script>
export default {
    props: {
        borrows: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        }
    }
};
</script>

<template>
    <ul class="list-group">
        <li
            class="list-group-item"
            v-for="(borrow, index) in borrows"
            :key="borrow.MaSach + '-' + borrow.MaDocGia"
            :class="{ active: index === activeIndex }"
            @click="updateActiveIndex(index)"
        >
            <strong>Mã Độc Giả:</strong> {{ borrow.MaDocGia }} | 
            <strong>Mã Sách:</strong> {{ borrow.MaSach }} | 
            <strong>Ngày Mượn:</strong> {{ borrow.NgayMuon }} | 
            <strong>Ngày Trả:</strong> {{ borrow.NgayTra }}
        </li>
    </ul>
</template>

<style scoped>
.list-group-item.active {
    background-color: #007bff;
    color: white;
    font-weight: bold;
}
</style>
