<template>
    <div class="page">
        <h4>Thêm Độc Giả</h4>
        <ReaderForm :reader="reader" @submit:reader="saveReader" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import ReaderForm from "@/components/ReaderForm.vue";
import ReaderService from "@/services/reader.service";

export default {
    components: {
        ReaderForm,
    },
    data() {
        return {
            reader: { HoLot: "", Ten: "", NgaySinh: "", Phai: "", DiaChi: "", DienThoai: "" },
            message: "",
        };
    },
    methods: {
        async saveReader(data) {
            try {
                await ReaderService.create(data);
                alert("Độc giả được thêm thành công.");
                this.$router.push({ name: "readerlist" });
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>