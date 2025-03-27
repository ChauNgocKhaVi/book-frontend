<template>
    <div v-if="borrow" class="page">
        <h4>Hiệu chỉnh người mượn</h4>
        <BorrowForm :borrow="borrow" @submit:borrow="updateBorrow" @delete:borrow="deleteBorrow" />
        <p>{{ message }}</p>
    </div>
</template>
<script>
import BorrowForm from "@/components/BorrowForm.vue";
import BorrowService from "@/services/borrow.service";
export default {
    components: {
        BorrowForm,
    },
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            borrow: null,
            message: "",
        };
    },
    methods: {
        async getBorrow(id) {
            try {
                this.borrow = await BorrowService.get(id);
            } catch (error) {
                console.log(error);
                this.$router.push({
                    name: "notfound",
                    params: {
                        pathMatch: this.$route.path.split("/").slice(1)
                    },
                    query: this.$route.query,
                    hash: this.$route.hash,
                });
            }
        },
        async updateBorrow(data) {
            try {
                await BorrowService.update(this.borrow._id, data);
                alert('Người mượn được cập nhật thành công.');
                this.$router.push({ name: "borrowlist" });
            } catch (error) {
                console.log(error);
            }
        },
        async deleteBorrow() {
            if (confirm("Bạn muốn xóa này?")) {
                try {
                    await BorrowService.delete(this.borrow._id);
                    this.$router.push({ name: "borrowlist" });
                } catch (error) {
                    console.log(error);
                }
            }
        },
    },
    created() {
        this.getBorrow(this.id);
        this.message = "";
    },
};
</script>
