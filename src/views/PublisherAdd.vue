<template>
    <div class="page">
        <h4>Thêm nhà xuất bản</h4>
        <PublisherForm :publisher="publisher" @submit:publisher="savePublisher" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import PublisherForm from "@/components/PublisherForm.vue";
import PublisherService from "@/services/publisher.service";

export default {
    components: {
        PublisherForm,
    },
    data() {
        return {
            publisher: { TenNXB: "", DiaChi: "" },
            message: "",
        };
    },
    methods: {
        async savePublisher(data) {
            try {
                await PublisherService.create(data);
                alert("Nhà xuất bản được thêm thành công.");
                this.$router.push({ name: "publisher" });
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
