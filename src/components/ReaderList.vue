<script>
export default {
    props: {
        readers: { type: Array, default: [] },
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
            v-for="(reader, index) in readers"
            :key="reader.DienThoai"
            :class="{ active: index === activeIndex }"
            @click="updateActiveIndex(index)"
        >
            {{ reader.HoLot }} {{ reader.Ten }}
        </li>
    </ul>
</template>
